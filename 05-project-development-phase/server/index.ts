import cors from 'cors'
import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()
const port = Number(process.env.PORT || 3001)

app.use(cors())
app.use(express.json())

app.get('/api/transactions', async (_req, res) => {
  const transactions = await prisma.transaction.findMany({ orderBy: { date: 'desc' } })
  res.json(transactions)
})

app.post('/api/transactions', async (req, res) => {
  const { type, merchant, category, amount, date, note } = req.body
  if (!type || !merchant || !category || !amount || !date) return res.status(400).json({ error: 'Missing required fields' })
  const transaction = await prisma.transaction.create({ data: { type, merchant, category, amount: Number(amount), date: new Date(date), note } })
  res.status(201).json(transaction)
})

app.put('/api/transactions/:id', async (req, res) => {
  const { type, merchant, category, amount, date, note } = req.body
  const transaction = await prisma.transaction.update({ where: { id: Number(req.params.id) }, data: { type, merchant, category, amount: Number(amount), date: new Date(date), note } })
  res.json(transaction)
})

app.delete('/api/transactions/:id', async (req, res) => {
  await prisma.transaction.delete({ where: { id: Number(req.params.id) } })
  res.status(204).end()
})

app.get('/api/budgets', async (_req, res) => {
  const budgets = await prisma.budget.findMany({ orderBy: { id: 'asc' } })
  res.json(budgets)
})

app.put('/api/budgets/:category', async (req, res) => {
  const budget = await prisma.budget.update({ where: { category: req.params.category }, data: { limit: Number(req.body.limit) } })
  res.json(budget)
})

app.get('/api/recommendations', async (_req, res) => {
  const [transactions, budgets] = await Promise.all([
    prisma.transaction.findMany({ where: { type: 'expense' } }),
    prisma.budget.findMany(),
  ])
  const recommendations = budgets.flatMap((budget) => {
    const spent = transactions.filter((transaction) => transaction.category === budget.category).reduce((sum, transaction) => sum + transaction.amount, 0)
    if (spent > budget.limit) return [{ tone: 'alert', category: budget.category, title: `${budget.category} is over plan`, body: `You are $${(spent - budget.limit).toFixed(2)} above your monthly limit.` }]
    if (spent / budget.limit > 0.7) return [{ tone: 'watch', category: budget.category, title: `${budget.category} is trending high`, body: `You have $${(budget.limit - spent).toFixed(2)} left for this category.` }]
    return []
  })
  if (!recommendations.length) recommendations.push({ tone: 'good', category: 'Savings', title: 'You are on a steady track', body: 'Every category is comfortably inside its plan this month.' })
  res.json(recommendations)
})

app.listen(port, () => console.log(`PocketSmart API listening on http://localhost:${port}`))
