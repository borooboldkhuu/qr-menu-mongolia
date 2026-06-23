'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { CreditCard, Check, Crown } from 'lucide-react';

export default function SubscriptionPage() {
  const [slug, setSlug] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    api.get('/restaurants').then((res) => {
      if (res.data.data.length > 0) setSlug(res.data.data[0].slug);
    });
  }, []);

  useEffect(() => {
    if (slug) {
      api.get(`/restaurants/${slug}/subscription`).then((res) => setSubscription(res.data.data));
      api.get(`/restaurants/${slug}/subscription/invoices`).then((res) => setInvoices(res.data.data));
    }
  }, [slug]);

  const plans = [
    { tier: 'STARTER', name: 'Starter', price: 29000, features: ['50 хоол', '10 ангилал', '1 QR код'] },
    { tier: 'PRO', name: 'Pro', price: 49000, features: ['200 хоол', '30 ангилал', '3 QR код', 'Аналитик', 'Chat дэмжлэг'], popular: true },
    { tier: 'ENTERPRISE', name: 'Enterprise', price: 79000, features: ['Хязгааргүй', '10 QR код', 'Custom domain', '24/7 дэмжлэг'] },
  ];

  const handleUpgrade = async (tier: string) => {
    await api.patch(`/restaurants/${slug}/subscription`, { tier });
    const res = await api.get(`/restaurants/${slug}/subscription`);
    setSubscription(res.data.data);
    alert('Амжилттай шинэчлэгдлээ! 🎉');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Захиалга</h2>

      {subscription && (
        <div className="bg-white p-6 rounded-xl border mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-brand-600" />
            <div>
              <p className="text-lg font-semibold">{subscription.tier === 'STARTER' ? 'Starter' : subscription.tier === 'PRO' ? 'Pro' : 'Enterprise'} багц</p>
              <p className="text-sm text-gray-500">
                {subscription.status === 'TRIAL' ? '14 хоног үнэгүй туршилт' : subscription.status === 'ACTIVE' ? 'Идэвхтэй' : 'Дууссан'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Дуусах: {new Date(subscription.expiresAt).toLocaleDateString('mn-MN')}
          </p>
        </div>
      )}

      <h3 className="text-lg font-semibold mb-4">Багц сонгох</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {plans.map((plan) => (
          <div key={plan.tier} className={`bg-white p-6 rounded-xl border ${plan.popular ? 'border-brand-500 ring-2 ring-brand-500 relative' : ''}`}>
            {plan.popular && <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-3 py-0.5 rounded-full text-xs">Хамгийн эрэлттэй</div>}
            <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
            <p className="text-3xl font-bold mb-4">₮{plan.price.toLocaleString()}<span className="text-sm text-gray-400">/сар</span></p>
            <ul className="space-y-2 mb-4">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-500" /> {f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.tier)}
              disabled={subscription?.tier === plan.tier}
              className={`w-full py-2 rounded-lg font-medium text-sm ${
                subscription?.tier === plan.tier
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : plan.popular ? 'bg-brand-600 text-white hover:bg-brand-700' : 'border border-brand-600 text-brand-600 hover:bg-brand-50'
              }`}
            >
              {subscription?.tier === plan.tier ? 'Одоогийн' : 'Сонгох'}
            </button>
          </div>
        ))}
      </div>

      {invoices.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-4">Төлбөрийн түүх</h3>
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
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-t">
                    <td className="px-4 py-3">{new Date(inv.startedAt).toLocaleDateString('mn-MN')}</td>
                    <td className="px-4 py-3">{inv.tier}</td>
                    <td className="px-4 py-3">₮{Number(inv.amount).toLocaleString()}</td>
                    <td className="px-4 py-3">{inv.status === 'ACTIVE' ? '🟢 Төлөгдсөн' : inv.status === 'TRIAL' ? '🟡 Trial' : '🔴 Дууссан'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
