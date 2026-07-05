const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
async function main() {
  // set all featured posts with order 0 to 99 (go to end)
  const result = await p.post.updateMany({ where: { featured: true, featuredOrder: 0 }, data: { featuredOrder: 99 } });
  console.log('Updated', result.count, 'posts: featuredOrder 0 → 99');
  // verify
  const posts = await p.post.findMany({ where: { featured: true }, orderBy: { featuredOrder: 'asc' }, select: { id: true, title: true, featuredOrder: true } });
  posts.forEach(x => console.log('  [' + x.featuredOrder + '] ' + x.title.substring(0, 50)));
  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });
