const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
p.post.findMany({ where: { featured: true }, select: { id: true, title: true, featuredOrder: true, status: true, content: true } })
  .then(r => { r.forEach(x => console.log(x.id, x.title.substring(0,40), 'order:', x.featuredOrder, 'status:', x.status, 'content len:', x.content?.length)); p.$disconnect(); })
  .catch(e => { console.error(e.message); p.$disconnect(); });
