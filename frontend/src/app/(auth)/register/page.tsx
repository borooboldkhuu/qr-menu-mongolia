'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message 
        || err?.message 
        || err?.code
        || 'Бүртгүүлэхэд алдаа гарлаа (сервертэй холбогдож чадсангүй)';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-brand-600 mb-2">
            <QrCode className="w-7 h-7" />
            QR Menu
          </Link>
          <h1 className="text-2xl font-bold">Бүртгүүлэх</h1>
          <p className="text-gray-500 text-sm mt-1">14 хоног үнэгүй турших</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border shadow-sm space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Нэр</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              placeholder="Таны нэр"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Имэйл</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              placeholder="name@email.mn"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Нууц үг</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              placeholder="Хамгийн багадаа 6 тэмдэгт"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition disabled:opacity-50"
          >
            {loading ? 'Бүртгэж байна...' : 'Үнэгүй бүртгүүлэх'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Бүртгэлтэй юу?{' '}
            <Link href="/login" className="text-brand-600 hover:underline font-medium">
              Нэвтрэх
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
