'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QrCode } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setSent(true);
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
          <h1 className="text-2xl font-bold">Нууц үг сэргээх</h1>
        </div>

        <div className="bg-white p-8 rounded-xl border shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 font-medium">Имэйл илгээгдлээ!</div>
              <p className="text-gray-500 text-sm">
                Хэрэв таны имэйл хаяг бүртгэлтэй бол нууц үг сэргээх линк илгээгдэнэ.
              </p>
              <Link href="/login" className="text-brand-600 hover:underline font-medium">
                Нэвтрэх хуудас руу буцах
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Имэйл</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition"
              >
                {loading ? 'Илгээж байна...' : 'Сэргээх линк авах'}
              </button>

              <p className="text-center text-sm">
                <Link href="/login" className="text-brand-600 hover:underline font-medium">
                  Нэвтрэх хуудас руу буцах
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
