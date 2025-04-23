// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const states = [
  { name: 'California', incomeTaxRate: 9.3, population: 39172742 },
  { name: 'Colorado', incomeTaxRate: 4.4, population: 5910000 },
  { name: 'Florida', incomeTaxRate: 0, population: 22300000 },
  { name: 'Georgia', incomeTaxRate: 5.75, population: 11000000 },
  { name: 'Idaho', incomeTaxRate: 5.8, population: 2000000 },
  { name: 'Maryland', incomeTaxRate: 7.0, population: 6200000 }, // includes local avg
  { name: 'Massachusetts', incomeTaxRate: 5.0, population: 7000000 },
  { name: 'Minnesota', incomeTaxRate: 7.05, population: 5800000 },
  { name: 'Montana', incomeTaxRate: 6.75, population: 1100000 },
  { name: 'North Carolina', incomeTaxRate: 4.75, population: 10600000 },
  { name: 'Nevada', incomeTaxRate: 0, population: 3300000 },
  { name: 'Oregon', incomeTaxRate: 9.0, population: 4300000 },
  { name: 'South Carolina', incomeTaxRate: 6.5, population: 5400000 },
  { name: 'Tennessee', incomeTaxRate: 0, population: 7200000 },
  { name: 'Texas', incomeTaxRate: 0, population: 30200000 },
  { name: 'Virginia', incomeTaxRate: 5.75, population: 8900000 },
  { name: 'Washington', incomeTaxRate: 0, population: 7900000 }
];

async function main() {
  for (const state of states) {
    await prisma.state.upsert({
      where: { name: state.name },
      update: { incomeTaxRate: state.incomeTaxRate, population: state.population },
      create: {
        name: state.name,
        incomeTaxRate: state.incomeTaxRate, // You can update this later
        population: state.population // Placeholder, update later if needed
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
