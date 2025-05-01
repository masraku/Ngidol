import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  const events = await prisma.event.findMany({
    where: { slug: null }, // hanya yang belum punya slug
  });

  for (const event of events) {
    let baseSlug = slugify(event.name, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Cek jika slug sudah dipakai, tambahkan angka
    while (await prisma.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    await prisma.event.update({
      where: { id: event.id },
      data: { slug },
    });

    console.log(`Updated event ID ${event.id} → slug: ${slug}`);
  }

  console.log('Selesai generate slug untuk semua event.');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
