'use client';

import Link from 'next/link';
import { Menu, QrCode, BarChart3, Smartphone, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600 flex items-center gap-2">
            <QrCode className="w-6 h-6" />
            QR Menu Mongolia
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Нэвтрэх
            </Link>
            <Link
              href="/register"
              className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition"
            >
              Үнэгүй эхлэх
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
          🇲🇳 Монголын ресторануудад зориулав
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Цэсээ дижитал
          <br />
          <span className="text-brand-600">QR кодоор</span> болго
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          QR кодоор цэсээ харуулж, админ самбараас шуурхай удирдана. Цаасан цэсний
          зардлаа 90% бууруулж, үйлчлүүлэгчдийнхээ туршлагыг сайжруул.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-brand-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-brand-700 transition inline-flex items-center gap-2"
          >
            Үнэгүй эхлэх <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition"
          >
            Дэлгэрэнгүй
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-4">14 хоног үнэгүй • Кредит карт шаардлагагүй</p>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Бүх боломжууд</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <QrCode className="w-8 h-8" />,
                title: 'QR код үүсгэх',
                desc: 'Автоматаар QR код үүсгэж, PNG/SVG татах, хэвлэхэд бэлэн.',
              },
              {
                icon: <Menu className="w-8 h-8" />,
                title: 'Админ самбар',
                desc: 'Цэс, ангилал, үнэ зэргийг хялбар удирдах админ самбар.',
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: 'Гар утсанд тохирсон',
                desc: 'Ямар ч утас, таблет дээр төгс харагдах нийтийн цэс.',
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'Статистик',
                desc: 'QR уншуулалт, хандалтын дэлгэрэнгүй статистик.',
              },
              {
                icon: <span className="text-2xl">₮</span>,
                title: 'Хямд үнэ',
                desc: '₮29,000/сараас эхлэх 3 багц. Бүх түвшинд тохирсон.',
              },
              {
                icon: <span className="text-2xl">🇲🇳</span>,
                title: '100% Монгол',
                desc: 'Монгол хэл дээр бүрэн. Орон нутгийн дэмжлэгтэй.',
              },
            ].map((feat, i) => (
              <div key={i} className="p-6 rounded-xl border bg-gray-50 hover:shadow-md transition">
                <div className="text-brand-600 mb-4">{feat.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-gray-600">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Үнийн багцууд</h2>
          <p className="text-gray-600 text-center mb-16">
            Бүх багц 14 хоног үнэгүй турших боломжтой
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '29,000', features: ['50 хүртэл хоол', '10 ангилал', '1 QR код', '1 зураг/хоол', 'Үндсэн аналитик'], border: 'border-gray-200' },
              { name: 'Pro', price: '49,000', features: ['200 хүртэл хоол', '30 ангилал', '3 QR код', '5 зураг/хоол', 'Дэлгэрэнгүй аналитик', '1 нэмэлт админ', 'Chat дэмжлэг'], border: 'border-brand-500 ring-2 ring-brand-500', popular: true },
              { name: 'Enterprise', price: '79,000', features: ['Хязгааргүй хоол', 'Хязгааргүй ангилал', '10 QR код', 'Хязгааргүй зураг', 'Түүхэн аналитик', '3 нэмэлт админ', 'Custom domain', '24/7 дэмжлэг'], border: 'border-gray-200' },
            ].map((plan, i) => (
              <div key={i} className={`bg-white p-8 rounded-2xl ${plan.border} relative`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Хамгийн эрэлттэй
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₮{plan.price}</span>
                  <span className="text-gray-500">/сар</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'border border-brand-600 text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  Үнэгүй эхлэх
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">QR цэсээ өнөөдөр эхлүүл</h2>
          <p className="text-brand-100 mb-8 text-lg">
            5 минутын дотор таны цэс онлайн болно. 14 хоног үнэгүй турших.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-brand-50 transition"
          >
            Үнэгүй бүртгүүлэх <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; 2026 QR Menu Mongolia. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </footer>
    </div>
  );
}
