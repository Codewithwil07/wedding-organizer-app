import { PrismaClient } from "@prisma/client";

// Bikin 1 'instance' aja biar hemat koneksi
const prisma = new PrismaClient();

export default prisma;
