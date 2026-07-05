const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL || 'postgresql://postgres.mbcggsyudefsxtinbgvm:PUSHPO144546@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true' } }
});
async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.updateMany({ data: { views: 0 } });
  console.log('✅ All likes deleted');
  console.log('✅ All comments deleted');
  console.log('✅ All views reset to 0');
}
main().catch(console.error).finally(() => prisma.$disconnect());
