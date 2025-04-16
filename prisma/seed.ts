// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const states = [
  { name: 'California' },
  { name: 'Colorado' },
  { name: 'Florida' },
  { name: 'Georgia' },
  { name: 'Idaho' },
  { name: 'Maryland' },
  { name: 'Massachusetts' },
  { name: 'Minnesota' },
  { name: 'Montana' },
  { name: 'North Carolina' },
  { name: 'Nevada' },
  { name: 'Oregon' },
  { name: 'South Carolina' },
  { name: 'Tennessee' },
  { name: 'Texas' },
  { name: 'Virginia' },
  { name: 'Washington' }
];

async function main() {
  for (const state of states) {
    await prisma.state.upsert({
      where: { name: state.name },
      update: {},
      create: {
        name: state.name,
        incomeTaxRate: 0, // You can update this later
        population: 0 // Placeholder, update later if needed
      }
    });
  }
}

main()
  .then(() => {
    console.log('✅ Seed complete');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('❌ Seed error', e);
    return prisma.$disconnect();
  });
