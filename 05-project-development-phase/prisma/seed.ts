import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const transactions = [
  { type: 'income', merchant: 'Northstar Studio', category: 'Salary', amount: 5400, date: new Date('2025-09-01'), note: 'September salary' },
  { type: 'expense', merchant: 'The Green Grocer', category: 'Food', amount: 86.42, date: new Date('2025-09-03'), note: 'Weekly shop' },
  { type: 'expense', merchant: 'Metro Pass', category: 'Transport', amount: 72, date: new Date('2025-09-04'), note: 'Monthly pass' },
  { type: 'expense', merchant: 'Luma Home', category: 'Home', amount: 126, date: new Date('2025-09-05'), note: 'Household supplies' },
  { type: 'expense', merchant: 'Tidal Coffee', category: 'Food', amount: 14.8, date: new Date('2025-09-07'), note: 'Coffee with a friend' },
  { type: 'expense', merchant: 'Arc Streaming', category: 'Fun', amount: 18.99, date: new Date('2025-09-08'), note: 'Monthly subscription' },
  { type: 'expense', merchant: 'Cloudline Mobile', category: 'Bills', amount: 64, date: new Date('2025-09-10'), note: 'Mobile plan' },
  { type: 'expense', merchant: 'Harvest Market', category: 'Food', amount: 112.3, date: new Date('2025-09-12'), note: 'Dinner ingredients' },
  { type: 'expense', merchant: 'Daylight Books', category: 'Fun', amount: 42, date: new Date('2025-09-14'), note: 'New reading' },
  { type: 'expense', merchant: 'Juniper Electric', category: 'Bills', amount: 91.2, date: new Date('2025-09-15'), note: 'Electricity' },
]

const budgets = [
  { category: 'Food', limit: 520, color: '#d2694c' },
  { category: 'Home', limit: 400, color: '#e2a93b' },
  { category: 'Transport', limit: 180, color: '#397b72' },
  { category: 'Bills', limit: 300, color: '#6e6aa8' },
  { category: 'Fun', limit: 240, color: '#c76c8b' },
]

async function main() {
  await prisma.transaction.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.transaction.createMany({ data: transactions })
  await prisma.budget.createMany({ data: budgets })
  console.log('PocketSmart demo data seeded.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
