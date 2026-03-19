"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveExperiments = saveExperiments;
exports.getRecentExperiments = getRecentExperiments;
exports.markExperimentUsed = markExperimentUsed;
exports.getCalibrationFactors = getCalibrationFactors;
const prisma_js_1 = require("../lib/prisma.js");
async function saveExperiments(userId, experiments) {
    const data = experiments.map((e) => ({
        user_id: userId,
        type: e.type,
        variant: e.variant,
        content: e.content ?? null,
        score: e.score,
    }));
    const result = await prisma_js_1.prisma.experimentLog.createMany({ data });
    return result.count;
}
async function getRecentExperiments(userId, days = 30, type) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return prisma_js_1.prisma.experimentLog.findMany({
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
async function markExperimentUsed(experimentId, actualEngagement) {
    await prisma_js_1.prisma.experimentLog.update({
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
async function getCalibrationFactors(userId) {
    const used = await prisma_js_1.prisma.experimentLog.findMany({
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
    const byType = {};
    for (const exp of used) {
        if (!byType[exp.type]) {
            byType[exp.type] = { predicted: [], actual: [] };
        }
        byType[exp.type].predicted.push(exp.score);
        byType[exp.type].actual.push(exp.actual_engagement ?? 0);
    }
    const factors = {};
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
//# sourceMappingURL=experiment-log.js.map