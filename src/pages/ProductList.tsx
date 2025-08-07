import { createSignal, For, onMount } from "solid-js";
import { A } from "@solidjs/router";

// Tipe produk
type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  img: string;
  badge?: string;
  badgeColor?: string;
};

const defaultProducts: Product[] = [
  { id: 1, name: "Tenda Dome", price: 50000, stock: 4, category: "tenda", img: "/tenda.png", badge: "Paling Laris", badgeColor: "bg-yellow-400" },
  { id: 2, name: "Kompor Lipat", price: 10000, stock: 10, category: "peralatan", img: "/kompor.png" },
  { id: 3, name: "Lampu Camping", price: 10000, stock: 10, category: "penerangan", img: "/lampu.png", badge: "Promo", badgeColor: "bg-green-400" },
  { id: 4, name: "Carrier 60L", price: 40000, stock: 5, category: "tas", img: "/carrier.png" },
  { id: 5, name: "Sleeping Bag", price: 25000, stock: 6, category: "tidur", img: "/sleepbag.png" },
  { id: 6, name: "Headlamp LED", price: 20000, stock: 8, category: "penerangan", img: "/headlamp.png" },
  { id: 7, name: "Flysheet", price: 15000, stock: 12, category: "tenda", img: "/flysheet.png" },
  { id: 8, name: "Gas Kaleng", price: 8000, stock: 20, category: "peralatan", img: "/gas.png" },
  { id: 9, name: "Cooking Set", price: 30000, stock: 7, category: "peralatan", img: "/cookset.png" },
  { id: 10, name: "Matras", price: 10000, stock: 10, category: "tidur", img: "/matras.png" },
];

const categories = [
  { id: "semua", label: "Semua" },
  { id: "tenda", label: "Tenda" },
  { id: "peralatan", label: "Peralatan" },
  { id: "penerangan", label: "Penerangan" },
  { id: "tidur", label: "Peralatan Tidur" },
  { id: "tas", label: "Tas" },
];

// SVG Icons as components
const SearchIcon = () => (
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6H4m3 7v4a1 1 0 001 1h8a1 1 0 001-1v-4M9 17h6" />
  </svg>
);

const StarIcon = () => (
  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const LockIcon = () => (
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
  </svg>
);

const PackageIcon = () => (
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const RotateIcon = () => (
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const EyeIcon = () => (
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = createSignal("semua");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [products, setProducts] = createSignal<Product[]>([]);
  const [rentedProducts, setRentedProducts] = createSignal<number[]>([]);

  onMount(() => {
    // Simulasi localStorage dari kode pertama - TIDAK MENGGUNAKAN localStorage asli
    const local = null; // localStorage.getItem("produkList");
    const parsed = local ? JSON.parse(local) : null;
    const isValid = parsed && Array.isArray(parsed) && parsed.every(p => typeof p.img === "string" && p.img.startsWith("/"));

    if (!isValid) {
      // localStorage.setItem("produkList", JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    } else {
      setProducts(parsed);
    }

    // Load riwayat produk yang sudah pernah disewa (selesai checkout)
    const rentedHistory = null; // localStorage.getItem("rentedHistory");
    if (rentedHistory) {
      setRentedProducts(JSON.parse(rentedHistory));
    }
  });

  // Function untuk cek apakah user sudah pernah nyewa produk ini
  const hasRentedProduct = (productId: number) => {
    return rentedProducts().includes(productId);
  };

  const filteredProducts = () =>
    products().filter((product) => {
      const matchCategory = selectedCategory() === "semua" || product.category === selectedCategory();
      const matchSearch = product.name.toLowerCase().includes(searchQuery().toLowerCase());
      return matchCategory && matchSearch;
    });

  return (
    <div class="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">

      {/* Search Bar */}
      <div class="mb-6 relative">
        <div class="relative">
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Cari produk camping..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            class="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md bg-white"
          />
        </div>
      </div>

      {/* Filter Kategori */}
      <div class="mb-6 flex gap-3 flex-wrap">
        <For each={categories}>
          {(cat) => (
            <button
              onClick={() => setSelectedCategory(cat.id)}
              class={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory() === cat.id
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md"
              }`}
            >
              {cat.label}
            </button>
          )}
        </For>
        <button
          onClick={() => {
            setSelectedCategory("semua");
            setSearchQuery("");
          }}
          class="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <RotateIcon />
          Reset
        </button>
      </div>

      {/* Daftar Produk */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <For each={filteredProducts()}>
          {(item) => (
            <div class="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 hover:border-blue-200 overflow-hidden relative">
              {/* Badge */}
              {item.badge && (
                <div class="absolute top-4 left-4 z-10">
                  <span
                    class={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full text-white shadow-lg ${item.badgeColor}`}
                  >
                    <StarIcon />
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Product Image */}
              <div class="relative h-48 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  class="w-full h-full object-contain transition-transform duration-500 hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div class="p-6">
                {/* Product Info */}
                <div class="space-y-3 mb-6">
                  <h3 class="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <div class="flex items-center gap-2">
                    <ShoppingCartIcon />
                    <span class="text-blue-600 font-bold text-xl">
                      Rp{item.price.toLocaleString("id-ID")}/hari
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <PackageIcon />
                    <span class="text-sm text-gray-600">Stok:</span>
                    <span class={`text-sm font-semibold px-3 py-1 rounded-full ${
                      item.stock > 5 ? 'bg-green-100 text-green-700' : 
                      item.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.stock} unit
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div class="flex flex-col gap-3">
                  <A
                    href={`/produk/detail/${item.id}`}
                    class="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <EyeIcon />
                    Lihat Detail
                  </A>
                  
                  {/* Tombol Ulasan - kondisional berdasarkan history rental */}
                  {hasRentedProduct(item.id) ? (
                    <A
                      href={`/ulasan/${item.id}`}
                      class="border-2 border-blue-500 text-blue-500 py-3 px-4 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <StarIcon />
                      Ulasan
                    </A>
                  ) : (
                    <div class="relative group">
                      <button
                        disabled
                        class="w-full border-2 border-gray-300 text-gray-400 py-3 px-4 rounded-xl cursor-not-allowed bg-gray-50 font-medium transition-all duration-300 flex items-center justify-center gap-2"
                        title="Anda harus menyewa produk ini terlebih dahulu untuk memberikan ulasan"
                      >
                        <LockIcon />
                        Ulasan (Sewa dulu)
                      </button>
                      {/* Tooltip */}
                      <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                        Sewa produk ini untuk membuka fitur ulasan
                        <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rental Status Badge for Current User */}
                {hasRentedProduct(item.id) && (
                  <div class="mt-4 text-center">
                    <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      <CheckCircleIcon />
                      Pernah Anda Sewa
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Empty State */}
      {filteredProducts().length === 0 && (
        <div class="text-center py-20">
          <div class="text-8xl mb-6">🏕️</div>
          <h3 class="text-2xl font-semibold text-gray-600 mb-3">Tidak ada produk yang ditemukan</h3>
          <p class="text-gray-500 text-lg">Coba ubah kata kunci pencarian atau kategori</p>
        </div>
      )}
    </div>
  );
}