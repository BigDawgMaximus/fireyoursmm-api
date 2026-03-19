"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_js_1 = require("../generated/prisma/client.js");
const connectionString = process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/fireyoursmm";
const adapter = new adapter_pg_1.PrismaPg({ connectionString });
exports.prisma = new client_js_1.PrismaClient({ adapter });
//# sourceMappingURL=prisma.js.map