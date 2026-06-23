'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { MapPin, Phone, Facebook, Instagram, Search, ChefHat } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-brand-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Цэс олдсонгүй</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-2">
            {restaurant.logoUrl && (
              <img src={restaurant.logoUrl} alt={restaurant.name} className="w-12 h-12 rounded-xl object-cover" />
            )}
            <div>
              <h1 className="text-xl font-bold">{restaurant.name}</h1>
              <div className="flex gap-3 text-xs text-gray-500">
                {restaurant.address && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {restaurant.address}</span>
                )}
                {restaurant.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {restaurant.phone}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {restaurant.facebookUrl && (
              <a href={restaurant.facebookUrl} target="_blank" className="text-gray-400 hover:text-blue-600"><Facebook className="w-4 h-4" /></a>
            )}
            {restaurant.instagramUrl && (
              <a href={restaurant.instagramUrl} target="_blank" className="text-gray-400 hover:text-pink-600"><Instagram className="w-4 h-4" /></a>
            )}
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Хоол хайх..."
            className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-3xl mx-auto px-4 mb-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium ${!activeCategory ? 'bg-brand-600 text-white' : 'bg-white border'}`}
        >
          Бүгд
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap font-medium ${activeCategory === cat.id ? 'bg-brand-600 text-white' : 'bg-white border'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="max-w-3xl mx-auto px-4 pb-8 space-y-6">
        {(activeCategory ? filteredCategories.filter((c) => c.id === activeCategory) : filteredCategories).map((category) => (
          <section key={category.id}>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-brand-600" />
              {category.name}
            </h2>
            <div className="space-y-2">
              {category.menuItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border flex gap-4">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="font-bold text-brand-600 text-sm">
                        {new Intl.NumberFormat('mn-MN').format(Number(item.price))}₮
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Powered by */}
      <footer className="text-center py-6 border-t bg-white">
        <p className="text-xs text-gray-400">
          QR Menu Mongolia ⚡
        </p>
      </footer>
    </div>
  );
}
