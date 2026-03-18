import { prisma } from "../lib/prisma.js";

// ============================================================
// EXPERIMENT LOG
// Stores every autoresearch experiment for compound learning.
// Over time, calibrates scoring using actual engagement data.
// ============================================================

export interface Experiment {
  type: "hook" | "format" | "timing" | "pillar" | "gap" | "voice";
  variant: string;
  content?: string;
  score: number;
}

export async function saveExperiments(
  userId: string,
  experiments: Experiment[],
): Promise<number> {
  const data = experiments.map((e) => ({
    user_id: userId,
    type: e.type,
    variant: e.variant,
    content: e.content ?? null,
    score: e.score,
  }));

  const result = await prisma.experimentLog.createMany({ data });
  return result.count;
}

export async function getRecentExperiments(
  userId: string,
  days: number = 30,
  type?: string,
): Promise<Array<{
  type: string;
  variant: string;
  content: string | null;
  score: number;
  was_used: boolean;
  actual_engagement: number | null;
  date: Date;
}>> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return prisma.experimentLog.findMany({
    where: {
      user_id: userId,
      date: { gte: since },
      ...(type ? { type } : {}),
    },
    orderBy: { score: "desc" },
    select: {
      type: true,
      variant: true,
      content: true,
      score: true,
      was_used: true,
      actual_engagement: true,
      date: true,
    },
  });
}

/**
 * When a user actually uses a suggested hook/draft, mark it and store
 * real engagement once available. This closes the feedback loop.
 */
export async function markExperimentUsed(
  experimentId: string,
  actualEngagement?: number,
): Promise<void> {
  await prisma.experimentLog.update({
    where: { id: experimentId },
    data: {
      was_used: true,
      ...(actualEngagement !== undefined ? { actual_engagement: actualEngagement } : {}),
    },
  });
}

/**
 * Calculate calibration factor: how well do our scores predict actual engagement?
 * Returns a multiplier per experiment type.
 */
export async function getCalibrationFactors(
  userId: string,
): Promise<Record<string, number>> {
  const used = await prisma.experimentLog.findMany({
    where: {
      user_id: userId,
      was_used: true,
      actual_engagement: { not: null },
    },
    select: {
      type: true,
      score: true,
      actual_engagement: true,
    },
  });

  const byType: Record<string, { predicted: number[]; actual: number[] }> = {};

  for (const exp of used) {
    if (!byType[exp.type]) {
      byType[exp.type] = { predicted: [], actual: [] };
    }
    byType[exp.type].predicted.push(exp.score);
    byType[exp.type].actual.push(exp.actual_engagement ?? 0);
  }

  const factors: Record<string, number> = {};

  for (const [type, data] of Object.entries(byType)) {
    if (data.predicted.length < 5) {
      factors[type] = 1.0; // Not enough data to calibrate
      continue;
    }

    const avgPredicted = data.predicted.reduce((a, b) => a + b, 0) / data.predicted.length;
    const avgActual = data.actual.reduce((a, b) => a + b, 0) / data.actual.length;

    // Ratio of actual to predicted — >1 means we underestimate, <1 means we overestimate
    factors[type] = avgPredicted > 0 ? avgActual / avgPredicted : 1.0;
  }

  return factors;
}
