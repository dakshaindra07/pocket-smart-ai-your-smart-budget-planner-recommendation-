import { useEffect, useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, BarChart3, Bell, ChevronDown, CircleHelp, CreditCard, Lightbulb, Menu, Pencil, Plus, Receipt, Settings2, Sparkles, Target, Trash2, TrendingUp, Wallet, X } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Transaction = { id: number; type: 'income' | 'expense'; merchant: string; category: string; amount: number; date: string; note?: string }
type Budget = { id: number; category: string; limit: number; color: string }
type Recommendation = { tone: 'alert' | 'watch' | 'good'; category: string; title: string; body: string }

const money = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
const categories = ['Food', 'Home', 'Transport', 'Bills', 'Fun', 'Health', 'Other']
const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(date))

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    const [transactionsRes, budgetsRes, recommendationsRes] = await Promise.all([
      fetch('/api/transactions'), fetch('/api/budgets'), fetch('/api/recommendations'),
    ])
    setTransactions(await transactionsRes.json())
    setBudgets(await budgetsRes.json())
    setRecommendations(await recommendationsRes.json())
    setLoading(false)
  }

  useEffect(() => { loadData().catch(() => setLoading(false)) }, [])

  const income = transactions.filter((transaction) => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0)
  const spent = transactions.filter((transaction) => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0)
  const balance = income - spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0)
  const saved = Math.max(0, balance - 2300)

  const categoryData = useMemo(() => budgets.map((budget) => {
    const value = transactions.filter((transaction) => transaction.type === 'expense' && transaction.category === budget.category).reduce((sum, transaction) => sum + transaction.amount, 0)
    return { ...budget, spent: value, percent: Math.min(100, Math.round(value / budget.limit * 100)) }
  }), [budgets, transactions])

  const trendData = useMemo(() => {
    const days = ['Sep 01', 'Sep 05', 'Sep 09', 'Sep 13', 'Sep 17', 'Sep 21', 'Sep 25', 'Sep 29']
    return days.map((day, index) => ({ day, spent: Math.round(spent * (0.18 + index * 0.1)), budget: Math.round(totalBudget * (0.15 + index * 0.1)) }))
  }, [spent, totalBudget])

  const handleDelete = async (id: number) => {
    await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    await loadData()
  }

  const handleBudget = async (category: string, limit: number) => {
    await fetch(`/api/budgets/${encodeURIComponent(category)}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ limit }) })
    await loadData()
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="PocketSmart AI home"><span className="brand-mark"><Sparkles size={17} /></span><span>PocketSmart <b>AI</b></span></a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a className="active" href="#overview">Overview</a><a href="#transactions">Transactions</a><a href="#planner">Planner</a>
        </nav>
        <div className="top-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i /></button><button className="avatar" aria-label="Open profile menu">AM</button><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"><Menu size={20} /></button></div>
      </header>

      <main id="top" className="page-wrap">
        <section className="hero-row" id="overview">
          <div><p className="eyebrow">Monday, September 22, 2025 <span className="live-dot" /> Live overview</p><h1>Good morning, Alex<span className="orange-dot">.</span></h1><p className="hero-copy">A clearer view of your money, with a little help from AI.</p></div>
          <div className="month-control"><span>Viewing</span><button>September 2025 <ChevronDown size={15} /></button></div>
        </section>

        <section className="metrics-grid" aria-label="Monthly financial summary">
          <article className="metric-card highlight"><div className="metric-label"><span>Available to spend</span><span className="mini-icon teal"><Wallet size={15} /></span></div><strong>{money(balance)}</strong><div className="metric-foot positive"><ArrowUpRight size={14} /> 8.4% <span>vs last month</span></div><div className="sparkline"><span /><span /><span /><span /><span /><span /><span /></div></article>
          <article className="metric-card"><div className="metric-label"><span>Monthly income</span><span className="mini-icon gold"><TrendingUp size={15} /></span></div><strong>{money(income)}</strong><div className="metric-foot positive"><ArrowUpRight size={14} /> 3.1% <span>vs last month</span></div></article>
          <article className="metric-card"><div className="metric-label"><span>Total spent</span><span className="mini-icon coral"><ArrowDownRight size={15} /></span></div><strong>{money(spent)}</strong><div className="metric-foot negative"><ArrowUpRight size={14} /> 2.8% <span>vs last month</span></div></article>
          <article className="metric-card"><div className="metric-label"><span>Saving streak</span><span className="mini-icon pink"><Target size={15} /></span></div><strong>4 <small>months</small></strong><div className="metric-foot"><span className="streak-dots">● ● ● ● ○ ○</span> <span>to your goal</span></div></article>
        </section>

        <section className="content-grid">
          <article className="panel trend-panel"><div className="panel-heading"><div><p className="section-kicker">Cash flow</p><h2>Spending rhythm</h2></div><div className="legend"><span><i className="legend-line teal-line" />Spent</span><span><i className="legend-line gold-line" />Plan</span></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trendData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}><defs><linearGradient id="spentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4a8f86" stopOpacity={0.22} /><stop offset="100%" stopColor="#4a8f86" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#ece8de" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#98958c', fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#98958c', fontSize: 11 }} tickFormatter={(value) => `$${value}`} /><Tooltip formatter={(value) => money(Number(value))} contentStyle={{ border: '1px solid #e4dfd4', borderRadius: 8, boxShadow: '0 8px 20px #1e343008' }} /><Area type="monotone" dataKey="spent" stroke="#397b72" strokeWidth={2.5} fill="url(#spentFill)" /><Area type="monotone" dataKey="budget" stroke="#d9a544" strokeWidth={2} strokeDasharray="5 5" fill="none" /></AreaChart></ResponsiveContainer></div><div className="chart-note"><span className="pulse-dot" /> <b>On track</b> You’ve spent 62% of your plan with 8 days left.</div></article>

          <article className="panel goal-panel"><div className="panel-heading"><div><p className="section-kicker">One step ahead</p><h2>Rainy day fund</h2></div><button className="kebab" aria-label="Goal options">•••</button></div><div className="goal-visual"><div className="goal-ring"><span><b>{Math.round(saved / 10000 * 100)}%</b><small>of goal</small></span></div><div><strong>{money(saved)}</strong><p>of {money(10000)} target</p></div></div><div className="goal-progress"><span style={{ width: `${Math.min(100, saved / 10000 * 100)}%` }} /></div><div className="goal-foot"><span><Target size={14} /> Estimated by Mar 2026</span><button onClick={() => alert('Goal editing is ready for the next step.')}>Edit goal</button></div></article>
        </section>

        <section className="lower-grid" id="planner">
          <article className="panel categories-panel"><div className="panel-heading"><div><p className="section-kicker">Your plan</p><h2>Where your money goes</h2></div><button className="text-button"><Settings2 size={15} /> Manage</button></div><div className="category-list">{categoryData.map((item) => <div className="category-row" key={item.category}><span className="category-swatch" style={{ background: item.color }} /><div className="category-name"><b>{item.category}</b><small>{money(item.spent)} spent</small></div><div className="category-bar"><span style={{ width: `${item.percent}%`, background: item.color }} /></div><div className={item.percent > 90 ? 'category-value warn' : 'category-value'}><b>{money(item.limit - item.spent)}</b><small>left</small></div><button className="edit-budget" onClick={() => { const value = window.prompt(`New ${item.category} budget`, String(item.limit)); if (value) handleBudget(item.category, Number(value)) }} aria-label={`Edit ${item.category} budget`}><Pencil size={14} /></button></div>)}</div></article>

          <article className="panel recommendation-panel"><div className="panel-heading"><div><p className="section-kicker ai-kicker"><Sparkles size={13} /> PocketSmart AI</p><h2>Worth a look</h2></div><button className="refresh-button" onClick={() => loadData()} aria-label="Refresh recommendations"><BarChart3 size={15} /></button></div>{recommendations.slice(0, 3).map((recommendation) => <div className={`recommendation ${recommendation.tone}`} key={recommendation.category}><span className="recommendation-icon">{recommendation.tone === 'alert' ? '!' : recommendation.tone === 'watch' ? '↗' : '✓'}</span><div><b>{recommendation.title}</b><p>{recommendation.body}</p></div><button aria-label={`Dismiss ${recommendation.category} recommendation`}><X size={14} /></button></div>)}<button className="full-link">See all insights <ArrowUpRight size={15} /></button></article>
        </section>

        <section className="panel transactions-panel" id="transactions"><div className="panel-heading"><div><p className="section-kicker">Activity</p><h2>Recent transactions</h2></div><button className="primary-button" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={16} /> Add transaction</button></div>{loading ? <div className="empty-state">Loading your pocket...</div> : <div className="transactions-table"><div className="transaction-head"><span>Merchant</span><span>Category</span><span>Date</span><span>Amount</span><span /></div>{transactions.slice(0, 6).map((transaction) => <div className="transaction-row" key={transaction.id}><div className="merchant"><span className={`merchant-icon ${transaction.category.toLowerCase()}`}><Receipt size={16} /></span><div><b>{transaction.merchant}</b><small>{transaction.note}</small></div></div><span className="tag">{transaction.category}</span><span className="date">{formatDate(transaction.date)}</span><strong className={transaction.type === 'income' ? 'income-amount' : ''}>{transaction.type === 'income' ? '+' : '-'}{money(transaction.amount)}</strong><div className="row-actions"><button onClick={() => { setEditing(transaction); setShowForm(true) }} aria-label={`Edit ${transaction.merchant}`}><Pencil size={14} /></button><button onClick={() => handleDelete(transaction.id)} aria-label={`Delete ${transaction.merchant}`}><Trash2 size={14} /></button></div></div>)}</div>}</section>
      </main>
      <footer className="footer"><span>© 2025 PocketSmart AI</span><span><CircleHelp size={14} /> Built for a calmer money life</span></footer>
      {showForm && <TransactionModal transaction={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); loadData() }} />}
    </div>
  )
}

function TransactionModal({ transaction, onClose, onSaved }: { transaction: Transaction | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ type: transaction?.type ?? 'expense', merchant: transaction?.merchant ?? '', category: transaction?.category ?? 'Food', amount: transaction?.amount?.toString() ?? '', date: transaction?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10), note: transaction?.note ?? '' })
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent) => { event.preventDefault(); const url = transaction ? `/api/transactions/${transaction.id}` : '/api/transactions'; await fetch(url, { method: transaction ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: Number(form.amount) }) }); onSaved() }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><form className="modal" onSubmit={submit}><div className="modal-header"><div><p className="section-kicker">Pocket ledger</p><h2>{transaction ? 'Edit transaction' : 'Add transaction'}</h2></div><button type="button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><div className="type-toggle"><button type="button" className={form.type === 'expense' ? 'selected expense' : ''} onClick={() => update('type', 'expense')}>Expense</button><button type="button" className={form.type === 'income' ? 'selected income' : ''} onClick={() => update('type', 'income')}>Income</button></div><label>Merchant<input required value={form.merchant} onChange={(event) => update('merchant', event.target.value)} placeholder="e.g. The Green Grocer" /></label><div className="form-grid"><label>Amount<input required min="0.01" step="0.01" type="number" value={form.amount} onChange={(event) => update('amount', event.target.value)} placeholder="0.00" /></label><label>Date<input required type="date" value={form.date} onChange={(event) => update('date', event.target.value)} /></label></div><label>Category<select value={form.category} onChange={(event) => update('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}{form.type === 'income' && <option>Salary</option>}</select></label><label>Note <span className="optional">Optional</span><input value={form.note} onChange={(event) => update('note', event.target.value)} placeholder="Add a little context" /></label><button className="primary-button modal-submit" type="submit">{transaction ? 'Save changes' : 'Add to ledger'} <ArrowUpRight size={16} /></button></form></div>
}

export default App
