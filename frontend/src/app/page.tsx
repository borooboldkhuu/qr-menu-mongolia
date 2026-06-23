'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Check, QrCode, BarChart3, Infinity, ArrowRight, Smartphone, BarChart, Globe, CreditCard, LayoutDashboard, Image } from 'lucide-react';
import Link from 'next/link';

const plans = [
  { tier: 'STARTER', name: 'Starter', price: '29,000', features: ['50 хүртэл хоол', '10 ангилал', '1 QR код', '1 зураг/хоол', 'Үндсэн аналитик'], icon: QrCode },
  { tier: 'PRO', name: 'Pro', price: '49,000', features: ['200 хүртэл хоол', '30 ангилал', '3 QR код', '5 зураг/хоол', 'Дэлгэрэнгүй аналитик', '1 нэмэлт админ', 'Chat дэмжлэг'], icon: BarChart3, popular: true },
  { tier: 'ENTERPRISE', name: 'Enterprise', price: '79,000', features: ['Хязгааргүй хоол', 'Хязгааргүй ангилал', '10 QR код', 'Хязгааргүй зураг', 'Түүхэн аналитик', '3 нэмэлт админ', 'Custom domain', '24/7 дэмжлэг'], icon: Infinity },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

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
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">Q</div>
            <span className="font-bold text-lg hidden sm:inline">QR Menu Mongolia</span>
          </div>
          <div className="flex gap-2 items-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-emerald-600 px-3 py-2">Нэвтрэх</Link>
            <Link href="/register" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 shadow-md transition">Үнэгүй эхлэх</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center px-6 pt-20 pb-12 max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold mb-6">
          🇲🇳 Монголын ресторануудад зориулав
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
          Цэсээ дижитал<br/>
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">QR кодоор болго</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
          QR кодоор цэсээ харуулж, админ самбараас шуурхай удирдана. Цаасан цэсний зардлаа 90% бууруулж, үйлчлүүлэгчдийнхээ туршлагыг сайжруул.
        </p>
        <div className="flex gap-3 justify-center mb-4">
          <Link href="/register" className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition flex items-center gap-2">
            Үнэгүй эхлэх <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#features" className="border-2 border-gray-200 px-8 py-3.5 rounded-xl font-semibold text-gray-600 hover:border-emerald-300 transition">
            Дэлгэрэнгүй
          </a>
        </div>
        <p className="text-xs text-gray-400">7 хоног үнэгүй • Кредит карт шаардлагагүй</p>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Бүх боломжууд</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { i: QrCode, t: 'QR код үүсгэх', d: 'Автоматаар QR код үүсгэж, PNG/SVG татах, хэвлэхэд бэлэн.' },
            { i: LayoutDashboard, t: 'Админ самбар', d: 'Цэс, ангилал, үнэ зэргийг хялбар удирдах админ самбар.' },
            { i: Smartphone, t: 'Гар утсанд тохирсон', d: 'Ямар ч утас, таблет дээр төгс харагдах нийтийн цэс.' },
            { i: BarChart, t: 'Статистик', d: 'QR уншуулалт, хандалтын дэлгэрэнгүй статистик.' },
            { i: CreditCard, t: 'Хямд үнэ', d: '₮29,000/сараас эхлэх 3 багц. Бүх түвшинд тохирсон.' },
            { i: Globe, t: '100% Монгол', d: 'Монгол хэл дээр бүрэн. Орон нутгийн дэмжлэгтэй.' },
          ].map(({ i: Icon, t, d }, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border hover:border-emerald-200 hover:shadow-md transition">
              <Icon className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-semibold mb-1">{t}</h3>
              <p className="text-sm text-gray-500">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">Үнийн багцууд</h2>
        <p className="text-sm text-gray-400 text-center mb-8">Бүх багц 7 хоног үнэгүй турших боломжтой</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div key={plan.tier} className={`bg-white p-6 rounded-2xl ${plan.popular ? 'border-emerald-500 ring-2 ring-emerald-500' : 'border-gray-200 border'} relative`}>
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
                Үнэгүй эхлэх
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3">QR цэсээ өнөөдөр эхлүүл</h2>
        <p className="text-gray-500 mb-6">5 минутын дотор таны цэс онлайн болно. 7 хоног үнэгүй турших.</p>
        <Link href="/register" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition text-lg">
          Үнэгүй бүртгүүлэх <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* LOGIN */}
      <section className="px-6 pb-20 max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl border shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-center">Нэвтрэх</h2>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Имэйл" className="w-full border rounded-xl px-4 py-3" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Нууц үг" className="w-full border rounded-xl px-4 py-3" required />
            <button type="submit" disabled={submitting} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">
              {submitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-4">
            Бүртгэлгүй юу? <Link href="/register" className="text-emerald-600 font-medium">Бүртгүүлэх</Link>
          </p>
        </div>
      </section>

      <footer className="text-center py-8 text-xs text-gray-400 border-t">
        QR Menu Mongolia © 2026
      </footer>
    </div>
  );
}
