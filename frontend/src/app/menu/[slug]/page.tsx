'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { MapPin, Phone, Facebook, Instagram, Search, ChevronRight, Clock } from 'lucide-react';

interface IRestaurant {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  coverUrl?: string;
  address?: string;
  phone?: string;
  facebookUrl?: string;
  instagramUrl?: string;
}

interface IMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  category?: { id: string; name: string };
}

interface ICategory {
  id: string;
  name: string;
  menuItems: IMenuItem[];
}

export default function PublicMenuPage() {
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.get(`/public/${slug}/menu`).then((res) => {
      setRestaurant(res.data.data.restaurant);
      setCategories(res.data.data.categories);
      setLoading(false);
    });
  }, [slug]);

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      menuItems: cat.menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
      ),
    }))
    .filter((cat) => cat.menuItems.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin h-10 w-10 border-[3px] border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-800 mb-2">Цэс олдсонгүй</p>
          <p className="text-gray-500 text-sm">QR кодыг дахин уншуулна уу</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero / Cover Image */}
      {restaurant.coverUrl ? (
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img src={restaurant.coverUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-4">
              {restaurant.logoUrl && (
                <img src={restaurant.logoUrl} alt={restaurant.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-lg" />
              )}
              <div>
                <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                <div className="flex flex-wrap gap-3 text-sm text-white/80 mt-1">
                  {restaurant.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{restaurant.address}</span>}
                  {restaurant.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{restaurant.phone}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              {restaurant.facebookUrl && <a href={restaurant.facebookUrl} target="_blank" className="text-white/70 hover:text-white"><Facebook className="w-4 h-4" /></a>}
              {restaurant.instagramUrl && <a href={restaurant.instagramUrl} target="_blank" className="text-white/70 hover:text-white"><Instagram className="w-4 h-4" /></a>}
            </div>
          </div>
        </div>
      ) : (
        <header className="bg-brand-600 text-white">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
              {restaurant.logoUrl && (
                <img src={restaurant.logoUrl} alt={restaurant.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20" />
              )}
              <div>
                <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                <div className="flex flex-wrap gap-3 text-sm text-white/70 mt-1">
                  {restaurant.address && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{restaurant.address}</span>}
                  {restaurant.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{restaurant.phone}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              {restaurant.facebookUrl && <a href={restaurant.facebookUrl} target="_blank" className="text-white/60 hover:text-white"><Facebook className="w-4 h-4" /></a>}
              {restaurant.instagramUrl && <a href={restaurant.instagramUrl} target="_blank" className="text-white/60 hover:text-white"><Instagram className="w-4 h-4" /></a>}
            </div>
          </div>
        </header>
      )}

      {/* Search + Category Tabs - Sticky */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Хоол хайх..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button onClick={() => setActiveCategory('')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition ${!activeCategory ? 'bg-brand-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              Бүгд
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium transition ${activeCategory === cat.id ? 'bg-brand-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Хоол олдсонгүй</p>
          </div>
        )}

        {(activeCategory ? filteredCategories.filter((c) => c.id === activeCategory) : filteredCategories).map((category) => (
          <section key={category.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-6 bg-brand-500 rounded-full" />
              <h2 className="text-lg font-bold text-gray-800">{category.name}</h2>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">{category.menuItems.length}</span>
            </div>
            <div className="space-y-3">
              {category.menuItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-2xl p-3 flex gap-4 hover:shadow-md transition-shadow group">
                  {item.imageUrl ? (
                    <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 flex-shrink-0 flex items-center justify-center">
                      <span className="text-3xl">🍽️</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-gray-800 leading-tight">{item.name}</h3>
                      <span className="font-bold text-brand-600 text-base whitespace-nowrap">
                        {new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 mt-8">
        <p className="text-xs text-gray-300">
          QR Menu Mongolia ⚡
        </p>
      </footer>
    </div>
  );
}
