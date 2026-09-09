import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { FoodCard } from '../components/FoodCard';
import { MenuCategory } from '../types';
import { Search, X, SlidersHorizontal, UtensilsCrossed } from 'lucide-react';

const CATEGORIES: MenuCategory[] = [
  'All',
  'Nigerian Dishes',
  'Rice & Pasta',
  'Swallow & Soups',
  'Grills',
  'Fast Food',
  'Snacks',
  'Drinks',
  'Desserts',
];

export const MenuView: React.FC = () => {
  const { menuItems, searchQuery, setSearchQuery } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('All');
  const [selectedDiet, setSelectedDiet] = useState<'all' | 'spicy' | 'popular'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Filtered and sorted menu items
  const filteredItems = useMemo(() => {
    return menuItems
      .filter((item) => {
        // Category match
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Search match
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchCat && !matchTags) {
            return false;
          }
        }

        // Dietary / Flag filter
        if (selectedDiet === 'spicy' && (!item.spicyLevel || item.spicyLevel === 0)) {
          return false;
        }
        if (selectedDiet === 'popular' && !item.isPopular) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [menuItems, selectedCategory, searchQuery, selectedDiet, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          Full Culinary Collection
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Our Signature Menu
        </h1>
        <p className="text-sm text-zinc-400">
          From steaming hot firewood Jollof to silky Amala and flame-kissed Suya skewers, explore our handcrafted delicacies prepared fresh to order.
        </p>
      </div>

      {/* Search & Secondary Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl">
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-amber-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search food by name, ingredient, or soup type (e.g. Egusi, Suya, Ofada)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Secondary Filter options */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0 text-xs">
          {/* Diet pill */}
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setSelectedDiet('all')}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                selectedDiet === 'all' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setSelectedDiet('popular')}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                selectedDiet === 'popular'
                  ? 'bg-amber-500 text-black'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Popular ⭐
            </button>
            <button
              onClick={() => setSelectedDiet('spicy')}
              className={`px-3 py-1.5 rounded-lg transition font-semibold ${
                selectedDiet === 'spicy' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Spicy 🌶️
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-zinc-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'default' | 'price-asc' | 'price-desc')}
              className="bg-transparent text-xs text-white focus:outline-hidden cursor-pointer"
            >
              <option value="default" className="bg-zinc-900">
                Featured Sort
              </option>
              <option value="price-asc" className="bg-zinc-900">
                Price: Low to High
              </option>
              <option value="price-desc" className="bg-zinc-900">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              id={`cat-pill-${category.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-black shadow-md font-bold'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Result Status Count */}
      <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
        <span>
          Showing <strong className="text-white">{filteredItems.length}</strong> dishes
          {selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}
          {searchQuery ? ` matching "${searchQuery}"` : ''}
        </span>

        {(selectedCategory !== 'All' || searchQuery || selectedDiet !== 'all' || sortBy !== 'default') && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSelectedDiet('all');
              setSortBy('default');
            }}
            className="text-amber-400 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Menu Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No dishes matched your search</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search terms or select another category from the top tabs.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSelectedDiet('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
