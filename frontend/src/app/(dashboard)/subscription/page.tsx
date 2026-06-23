'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { CreditCard, Check, QrCode, BarChart3, Infinity, AlertCircle } from 'lucide-react';

export default function SubscriptionPage() {
  const [slug, setSlug] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('restaurantSlug');
    if (cached) setSlug(cached);
    setLoading(true);
    let attempts = 0;
    const tryLoad = () => {
      attempts++;
      api.get('/restaurants').then(res => {
        if (res.data.data.length > 0) {
          const s = res.data.data[0].slug;
          setSlug(s);
          localStorage.setItem('restaurantSlug', s);
        }
        setLoading(false);
      }).catch(() => {
        if (attempts < 3) setTimeout(tryLoad, 2000);
        else setLoading(false);
      });
    };
    tryLoad();
  }, []);

  useEffect(() => {
    if (slug) loadSub();
  }, [slug]);

  const loadSub = () => {
    api.get(`/restaurants/${slug}/subscription`).then(res => setSubscription(res.data.data)).catch(() => {});
    api.get(`/restaurants/${slug}/subscription/invoices`).then(res => setInvoices(res.data.data || [])).catch(() => {});
  };

  const handleUpgrade = async (tier: string) => {
    if (!slug) { setError('Ресторан олдсонгүй. Хуудсыг refresh хийнэ үү.'); return; }
    setError('');
    setUpgrading(true);
    try {
      const res = await api.post(`/restaurants/${slug}/subscription/pay`, { tier });
      const url = res.data.data?.checkoutUrl;
      if (url) window.location.href = url;
      else setError('Төлбөрийн холбоос үүсэхэд алдаа гарлаа. Wire тохиргоог шалгана уу.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Төлбөр үүсгэхэд алдаа гарлаа');
    } finally { setUpgrading(false); }
  };

  const handleDirectActivate = async (tier: string) => {
    if (!confirm(`${tier} багцыг шууд идэвхжүүлэх үү? (Тест/Админ горим)`)) return;
    setUpgrading(true);
    try { await api.patch(`/restaurants/${slug}/subscription`, { tier }); loadSub(); }
    catch (err: any) { alert(err?.response?.data?.message || 'Алдаа'); }
    finally { setUpgrading(false); }
  };

  const plans = [
    { tier: 'STARTER', name: 'Starter', price: 29000, features: ['QR цэс', '50 хүртэл хоол', '10 ангилал', 'Үндсэн аналитик'], icon: QrCode },
    { tier: 'PRO', name: 'Pro', price: 49000, features: ['QR цэс', '200 хүртэл хоол', '30 ангилал', 'Дэлгэрэнгүй аналитик', 'Нэмэлт админ'], icon: BarChart3, popular: true },
    { tier: 'ENTERPRISE', name: 'Enterprise', price: 79000, features: ['QR цэс', 'Хязгааргүй хоол', 'Хязгааргүй ангилал', 'Бүрэн аналитик', 'Custom domain'], icon: Infinity },
  ];

  if (loading) return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Захиалга</h2>
      <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
        <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-brand-600 animate-spin" />
        Ачаалж байна...
      </div>
    </div>
  );

  if (!slug) return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Захиалга</h2>
      <p className="text-gray-400 py-4">Ресторан олдсонгүй. Эхлээд Dashboard-оос ресторан үүсгэнэ үү.</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Захиалга</h2>

      {subscription && (
        <div className="bg-gradient-to-r from-brand-50 to-white p-6 rounded-xl border border-brand-100 mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-brand-600" />
            <div>
              <p className="text-lg font-semibold text-brand-700">
                {subscription.status === 'TRIAL'
                  ? `7 хоног үнэгүй туршилт (${new Date(subscription.expiresAt).toLocaleDateString('mn-MN')} хүртэл)`
                  : `${subscription.tier || '—'} · ${subscription.status === 'ACTIVE' ? '🟢 Идэвхтэй' : subscription.status}`}
              </p>
              <p className="text-sm text-gray-500">
                {subscription.status === 'TRIAL'
                  ? 'Туршилт дууссаны дараа Starter багц ₮29,000/сар'
                  : `Дуусах: ${new Date(subscription.expiresAt).toLocaleDateString('mn-MN')}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-4 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}

      <h3 className="text-lg font-semibold mb-1">Багц сонгох</h3>
      <p className="text-sm text-gray-400 mb-4">7 хоног үнэгүй туршиж үзэх боломжтой</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map(plan => {
          const isCurrent = subscription?.tier === plan.tier;
          return (
            <div key={plan.tier} className={`bg-white p-6 rounded-2xl ${plan.popular ? 'border-brand-500 ring-2 ring-brand-500' : 'border-gray-200 border'} relative`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  ⭐ Хамгийн эрэлттэй
                </div>
              )}
              <plan.icon className="w-8 h-8 text-brand-600 mb-3" />
              <h4 className="font-bold text-lg">{plan.name}</h4>
              <p className="text-3xl font-extrabold mt-2 mb-1">₮{plan.price.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mb-4">/ сар</p>
              <ul className="space-y-2.5 mb-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={isCurrent || upgrading}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition mb-2 ${isCurrent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : plan.popular ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-md' : 'border-2 border-brand-600 text-brand-600 hover:bg-brand-50'}`}
              >
                {upgrading ? '...' : isCurrent ? 'Одоогийн багц' : '💳 Wire-р төлөх'}
              </button>
              {!isCurrent && (
                <button onClick={() => handleDirectActivate(plan.tier)} className="w-full py-1.5 rounded-xl text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                  Админ шууд идэвхжүүлэх
                </button>
              )}
            </div>
          );
        })}
      </div>

      {invoices.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Төлбөрийн түүх</h3>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3">Огноо</th>
                  <th className="text-left px-4 py-3">Багц</th>
                  <th className="text-left px-4 py-3">Дүн</th>
                  <th className="text-left px-4 py-3">Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id} className="border-t">
                    <td className="px-4 py-3">{new Date(inv.startedAt).toLocaleDateString('mn-MN')}</td>
                    <td className="px-4 py-3">{inv.tier}</td>
                    <td className="px-4 py-3 font-medium">₮{Number(inv.amount).toLocaleString()}</td>
                    <td className="px-4 py-3">{inv.status === 'ACTIVE' ? '🟢 Төлөгдсөн' : inv.status === 'PAST_DUE' ? '⏳ Хүлээгдэж' : '🟡 Trial'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
