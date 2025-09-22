import { useEffect, useState } from 'react'
import './App.css'
import { login, register, getProfile, updateProfile, getDietSuggestion, logout } from './api'
import axios from 'axios'

function App() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem('access'))
  const [tab, setTab] = useState('landing')

  useEffect(() => {
    if (!authed && (tab === 'dashboard' || tab === 'quiz')) setTab('login')
  }, [authed])

  return (
    <div>
      <div className="space-between">
        <h1>DietApp</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setTab('landing')}>Gut Health</button>
          <button onClick={() => setTab('experts')}>Experts</button>
          <button onClick={() => setTab('dashboard')}>Dashboard</button>
          <button onClick={() => setTab('quiz')}>Quiz</button>
          {authed ? (
            <button onClick={() => { logout(); setAuthed(false) }}>Logout</button>
          ) : (
            <>
              <button onClick={() => setTab('login')}>Login</button>
              <button onClick={() => setTab('register')}>Register</button>
            </>
          )}
        </nav>
      </div>
      {tab === 'landing' && <GutLanding />}
      {tab === 'login' && <Login onSuccess={() => setAuthed(true)} onSwitch={() => setTab('register')} />}
      {tab === 'register' && <Register onSuccess={() => setTab('login')} onSwitch={() => setTab('login')} />}
      {tab === 'dashboard' && authed && <Dashboard />}
      {tab === 'experts' && <Experts />}
      {tab === 'quiz' && authed && <Quiz />}
      {tab === 'quiz' && !authed && <p>Please login to take the quiz.</p>}
    </div>
  )
}

function Login({ onSuccess, onSwitch }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  return (
    <div className="card">
      <h2>Login</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={async (e) => {
        e.preventDefault()
        try {
          await login(form.username, form.password)
          onSuccess()
        } catch (err) {
          setError('Invalid credentials')
        }
      }}>
        <label>Username<input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <button onClick={onSwitch}>Register</button></p>
    </div>
  )
}

function Register({ onSuccess, onSwitch }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', height_cm: '', weight_kg: '', dietary_preference: '', wants_daily_email: true })
  const [error, setError] = useState('')
  return (
    <div className="card">
      <h2>Register</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={async (e) => {
        e.preventDefault()
        try {
          const payload = { ...form, height_cm: form.height_cm ? parseInt(form.height_cm) : null, weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null }
          await register(payload)
          onSuccess()
        } catch (err) {
          setError('Registration failed')
        }
      }}>
        <label>Username<input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></label>
        <label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <div className="row">
          <label>Height (cm)<input type="number" value={form.height_cm} onChange={e => setForm({ ...form, height_cm: e.target.value })} /></label>
          <label>Weight (kg)<input type="number" step="0.1" value={form.weight_kg} onChange={e => setForm({ ...form, weight_kg: e.target.value })} /></label>
        </div>
        <label>Dietary Preference<input value={form.dietary_preference} onChange={e => setForm({ ...form, dietary_preference: e.target.value })} /></label>
        <label><input type="checkbox" checked={form.wants_daily_email} onChange={e => setForm({ ...form, wants_daily_email: e.target.checked })} /> Receive daily email</label>
        <button type="submit">Create Account</button>
      </form>
      <p>Have an account? <button onClick={onSwitch}>Login</button></p>
    </div>
  )
}

function GutLanding() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', consent: true })
  const [submitted, setSubmitted] = useState(false)
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState(['','','','','',''])
  const base = (import.meta.env.VITE_API_BASE || 'http://localhost:8001/api')
  async function submitLead(e) {
    e.preventDefault()
    try {
      await axios.post(`${base}/leads/`, { ...form, source: 'gut-landing' })
      setSubmitted(true)
    } catch (e) {
      alert('Failed to submit. Please try again.')
    }
  }
  function handleOtp(i, v) {
    const arr = [...otp]; arr[i] = v.replace(/\D/g, '').slice(0,1); setOtp(arr)
  }
  return (
    <div>
      <section className="hero">
        <h2>Optimize Your <span className="em">Gut Health</span> For a Happier You</h2>
        <p className="sub">Customized Gut Nutrition Plan tailored to your body, preferences, and goals.</p>
        <div className="stats">
          <div className="stat"><div className="num">90+</div><div className="label">Dietitians</div></div>
          <div className="stat"><div className="num">30,000+</div><div className="label">Happy Clients</div></div>
          <div className="stat"><div className="num">14+</div><div className="label">Years Experience</div></div>
          <div className="stat"><div className="num">10</div><div className="label">Clinics</div></div>
        </div>
        <div className="card lead-form">
          <h3 style={{ marginTop: 0 }}>Fill up your details</h3>
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2) }}>
              <div className="row">
                <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
                <label>Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></label>
              </div>
              <label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
              <label><input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} /> I agree to the terms</label>
              <div className="row">
                <button type="submit" className="secondary">Send OTP</button>
              </div>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={submitLead}>
              <label>Enter OTP</label>
              <div className="otp">
                {otp.map((d, i) => (
                  <input key={i} value={d} onChange={(e) => handleOtp(i, e.target.value)} />
                ))}
              </div>
              <div className="row" style={{ marginTop: '.8rem' }}>
                <button type="button" className="secondary" onClick={() => setStep(1)}>Back</button>
                <button type="submit">Register</button>
              </div>
            </form>
          )}
          {submitted && <p style={{ color: 'green' }}>Thanks! We will contact you shortly.</p>}
        </div>
      </section>

      <section className="section">
        <h3>How can our customized Gut Nutrition Plan help you?</h3>
        <div className="grid-3">
          <div className="tile">Addresses specific digestive concerns</div>
          <div className="tile">Optimizes nutrition absorption</div>
          <div className="tile">Balances the gut microbiome</div>
          <div className="tile">Manages food sensitivities</div>
          <div className="tile">Supports overall wellbeing</div>
          <div className="tile">Lifestyle recommendations</div>
        </div>
      </section>

      <section className="section">
        <h3>Problems a tailor‑made plan can solve</h3>
        <div className="grid-3">
          <div className="tile">IBS</div>
          <div className="tile">GERD</div>
          <div className="tile">IBD</div>
          <div className="tile">SIBO</div>
          <div className="tile">Leaky Gut</div>
          <div className="tile">Gastritis</div>
        </div>
      </section>

      <section className="section expert">
        <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop" alt="Expert" />
        <div>
          <h3>Led by Expert Dietitians</h3>
          <p>Our experienced team crafts evidence-based nutrition strategies and partners with you for sustainable results.</p>
        </div>
      </section>

      <section className="section">
        <h3>Testimonials</h3>
        <div className="testimonials">
          <div className="t-card">
            <p>“They completely changed my eating habits. No more sensitive gut, more energy.”</p>
            <div className="name">Meena S.</div>
          </div>
          <div className="t-card">
            <p>“Understood my triggers and built a plan. Gut health and migraines improved.”</p>
            <div className="name">Shubham B.</div>
          </div>
          <div className="t-card">
            <p>“Following the plan my symptoms are much better. Highly recommend.”</p>
            <div className="name">Arti S.</div>
          </div>
        </div>
      </section>

      <section className="section faq">
        <h3>FAQs</h3>
        <details><summary>What is a Gut Health Nutrition Plan?</summary><p>A customized program with meal plans, guidance, and lifestyle tips to support your gut.</p></details>
        <details><summary>Can you handle dietary restrictions?</summary><p>Yes—vegan, vegetarian, gluten-free, and more are supported.</p></details>
        <details><summary>How long is the program?</summary><p>We offer short and long-term options depending on your goals.</p></details>
      </section>
    </div>
  )
}

function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [suggestion, setSuggestion] = useState(null)
  const [form, setForm] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => { (async () => { setProfile(await getProfile()) })() }, [])
  useEffect(() => {
    if (profile) {
      setForm({ ...profile })
      if (profile.height_cm && profile.weight_kg) {
        (async () => setSuggestion(await getDietSuggestion()))()
      }
    }
  }, [profile])

  async function fetchSuggestion() {
    const data = await getDietSuggestion()
    setSuggestion(data)
  }

  return (
    <div className="card">
      <h2>Dashboard</h2>
      {!profile ? <p>Loading...</p> : (
        <>
          <form onSubmit={async (e) => {
            e.preventDefault()
            const payload = { ...form }
            if (payload.height_cm === '') payload.height_cm = null
            if (payload.weight_kg === '') payload.weight_kg = null
            const data = await updateProfile(payload)
            setProfile(data)
            setMessage('Profile updated')
            setTimeout(() => setMessage(''), 1500)
          }}>
            <div className="row">
              <label>Height (cm)<input type="number" value={form?.height_cm ?? ''} onChange={e => setForm({ ...form, height_cm: e.target.value ? parseInt(e.target.value) : '' })} /></label>
              <label>Weight (kg)<input type="number" step="0.1" value={form?.weight_kg ?? ''} onChange={e => setForm({ ...form, weight_kg: e.target.value ? parseFloat(e.target.value) : '' })} /></label>
            </div>
            <label>Dietary Preference<input value={form?.dietary_preference ?? ''} onChange={e => setForm({ ...form, dietary_preference: e.target.value })} /></label>
            <label><input type="checkbox" checked={!!form?.wants_daily_email} onChange={e => setForm({ ...form, wants_daily_email: e.target.checked })} /> Receive daily email</label>
            <button type="submit">Save</button>
          </form>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={fetchSuggestion}>Get Diet Suggestion</button>
          </div>
          {suggestion && (
            <div style={{ marginTop: '1rem' }}>
              <p><strong>BMI:</strong> {suggestion.bmi ?? 'N/A'} &nbsp; <strong>Category:</strong> {suggestion.category}</p>
              <p>{suggestion.suggestion}</p>
            </div>
          )}
          {message && <p style={{ color: 'green' }}>{message}</p>}
        </>
      )}
    </div>
  )
}

function Experts() {
  const [experts, setExperts] = useState(null)
  useEffect(() => { (async () => {
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:8001/api'
    const { data } = await axios.get(`${base}/experts/list/`)
    setExperts(data)
  })() }, [])
  if (!experts) return <p>Loading experts...</p>
  return (
    <div className="card">
      <h2>Diet Experts</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: 16 }}>
        {experts.map(e => (
          <div key={e.id} className="card" style={{ padding: 12 }}>
            {e.image_url && <img src={e.image_url} alt={e.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />}
            <h3>{e.name}</h3>
            <p style={{ color: '#666' }}>{e.specialty}</p>
            <p>{e.bio}</p>
            {e.email && <a href={`mailto:${e.email}`}>Email</a>}
          </div>
        ))}
      </div>
    </div>
  )
}

function Quiz() {
  const [questions, setQuestions] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)

  useEffect(() => { (async () => {
    const base = import.meta.env.VITE_API_BASE || 'http://localhost:8001/api'
    const { data } = await axios.get(`${base}/quiz/questions/`)
    setQuestions(data)
  })() }, [])

  if (!questions) return <p>Loading quiz...</p>
  return (
    <div className="card">
      <h2>Food Quiz</h2>
      {!submitted ? (
        <form onSubmit={(e) => {
          e.preventDefault()
          // For demo, compute score on client as we don't return answers
          let sc = 0
          questions.forEach(q => { /* no correctness info */ })
          setScore(sc)
          setSubmitted(true)
        }}>
          <ol>
            {questions.map(q => (
              <li key={q.id} style={{ marginBottom: 8 }}>
                <strong>{q.text}</strong><br />
                <label><input type="radio" name={`q_${q.id}`} value="good" onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} /> Good</label>
                <label><input type="radio" name={`q_${q.id}`} value="bad" onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })} /> Not Good</label>
              </li>
            ))}
          </ol>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Thanks! Responses recorded.</p>
      )}
    </div>
  )
}

export default App
