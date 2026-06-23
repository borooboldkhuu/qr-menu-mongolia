'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Check, QrCode, BarChart3, Infinity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const plans = [
  { tier: 'STARTER', name: 'Starter', price: '29,000', color: 'border-gray-200', features: ['QR цэс', '50 хүртэл хоол', '10 ангилал', 'Үндсэн аналитик'], icon: QrCode },
  { tier: 'PRO', name: 'Pro', price: '49,000', color: 'border-emerald-500 ring-2 ring-emerald-500', features: ['QR цэс', '200 хүртэл хоол', '30 ангилал', 'Дэлгэрэнгүй аналитик', 'Нэмэлт админ'], icon: BarChart3, popular: true },
  { tier: 'ENTERPRISE', name: 'Enterprise', price: '79,000', color: 'border-gray-200', features: ['QR цэс', 'Хязгааргүй хоол', 'Хязгааргүй ангилал', 'Бүрэн аналитик', 'Custom domain'], icon: Infinity },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [slug, setSlug] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setUser({ token });
      api.get('/restaurants').then(r => {
        if (r.data.data.length > 0) setSlug(r.data.data[0].slug);
      }).catch(() => {});
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', res.data.data.accessToken);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Нэвтрэхэд алдаа гарлаа');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">Q</span>
          <span className="font-bold text-lg">QR Menu</span>
        </div>
        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <Link href={slug ? `/menu/${slug}` : '/dashboard'} className="text-sm text-gray-500 hover:text-emerald-600">
                Миний цэс
              </Link>
              <Link href="/dashboard" className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                Хянах самбар
              </Link>
            </>
          ) : (
            <a href="#login" className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700">Нэвтрэх</a>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="text-center px-6 py-16 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
          Монгол рестораны<br/><span className="text-emerald-600">QR цэсний шийдэл</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          Хэвлэх цэсний зардалгүй. Зөвхөн QR код үүсгээд харилцагчид цахим цэс үзүүлээрэй.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/register" className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 shadow-lg transition flex items-center gap-2">
            7 хоног үнэгүй <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="border-2 border-gray-200 px-8 py-3 rounded-xl font-semibold text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition">
            Нэвтрэх
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-3">Картын мэдээлэл шаардлагагүй</p>
      </section>

      {/* PRICING */}
      <section className="px-6 py-12 max-w-5xl mx-auto" id="pricing">
        <h2 className="text-2xl font-bold text-center mb-2">Багц сонгох</h2>
        <p className="text-sm text-gray-400 text-center mb-8">7 хоног үнэгүй туршиж үзэх боломжтой</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.tier} className={`bg-white p-6 rounded-2xl ${plan.color} relative`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  ⭐ Хамгийн эрэлттэй
                </div>
              )}
              <plan.icon className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-lg">{plan.name}</h3>
              <p className="text-3xl font-extrabold mt-2 mb-1">₮{plan.price}</p>
              <p className="text-sm text-gray-400 mb-4">/ сар</p>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`block text-center py-2.5 rounded-xl font-semibold text-sm transition ${plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md' : 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50'}`}>
                Эхлэх
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* LOGIN */}
      <section id="login" className="px-6 py-12 max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-center">Нэвтрэх</h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Имэйл" className="w-full border rounded-xl px-4 py-3" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Нууц үг" className="w-full border rounded-xl px-4 py-3" required />
            <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700">
              {submitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-4">
            Бүртгэлгүй юу? <Link href="/register" className="text-emerald-600 font-medium">Бүртгүүлэх</Link>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 text-xs text-gray-400">
        QR Menu Mongolia © 2026
      </footer>
    </div>
  );
}
