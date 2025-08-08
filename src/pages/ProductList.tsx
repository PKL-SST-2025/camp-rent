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

// Tipe untuk riwayat sewa
type RiwayatItem = {
  id?: number;
  name: string;
  date: string;
  duration: string;
  price: string;
  status: string;
  productId?: number;
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

const ClockIcon = () => (
  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TruckIcon = () => (
  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = createSignal("semua");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [products, setProducts] = createSignal<Product[]>([]);
  const [rentedProducts, setRentedProducts] = createSignal<{[key: number]: string}>({});
  const [isLoaded, setIsLoaded] = createSignal(false);

  onMount(() => {
    // Load products
    setProducts(defaultProducts);

    // Load riwayat sewa dari localStorage
    try {
      const riwayatSewa = JSON.parse(localStorage.getItem("riwayatSewa") || "[]") as RiwayatItem[];
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const userEmail = currentUser.email;

      // Buat mapping produk yang sudah pernah disewa beserta statusnya
      const rentedMap: {[key: number]: string} = {};
      
      riwayatSewa.forEach((item: RiwayatItem) => {
        // Cari produk berdasarkan nama (karena mungkin productId belum ada)
        const product = defaultProducts.find(p => p.name === item.name);
        if (product) {
          // Hanya tampilkan tombol ulasan jika status "Selesai"
          if (item.status === "Selesai") {
            rentedMap[product.id] = item.status;
          }
        }
      });

      setRentedProducts(rentedMap);
      console.log("Rented products:", rentedMap); // Debug log
    } catch (error) {
      console.error("Error loading rental history:", error);
      setRentedProducts({});
    }

    setTimeout(() => setIsLoaded(true), 200);
  });

  // Function untuk cek apakah user sudah selesai menyewa produk ini
  const hasCompletedRental = (productId: number) => {
    return rentedProducts()[productId] === "Selesai";
  };

  // Function untuk cek status rental produk
  const getRentalStatus = (productId: number) => {
    return rentedProducts()[productId];
  };

  const filteredProducts = () =>
    products().filter((product) => {
      const matchCategory = selectedCategory() === "semua" || product.category === selectedCategory();
      const matchSearch = product.name.toLowerCase().includes(searchQuery().toLowerCase());
      return matchCategory && matchSearch;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Diproses":
        return {
          icon: ClockIcon,
          text: "Sedang Diproses",
          class: "bg-yellow-100 text-yellow-700 border-yellow-200"
        };
      case "Dikirim":
        return {
          icon: TruckIcon,
          text: "Sedang Dikirim",
          class: "bg-blue-100 text-blue-700 border-blue-200"
        };
      case "Selesai":
        return {
          icon: CheckCircleIcon,
          text: "Selesai Disewa",
          class: "bg-green-100 text-green-700 border-green-200"
        };
      default:
        return null;
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div class="fixed inset-0 opacity-5 pointer-events-none">
        <div class="absolute inset-0" style={{
          "background-image": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <div class={`text-center mb-6 sm:mb-8 transform transition-all duration-1000 ${
          isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] opacity-0'
        }`}>
          <h1 class="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#3F5B8B] to-[#6C5E82] bg-clip-text text-transparent mb-2">
            Katalog Produk
          </h1>
          <p class="text-gray-600 text-sm sm:text-base">Temukan peralatan camping terbaik untuk petualangan Anda</p>
        </div>

        {/* Search Bar */}
        <div class={`mb-4 sm:mb-6 transform transition-all duration-1000 ${
          isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`} style={{ "animation-delay": "200ms" }}>
          <div class="relative max-w-2xl mx-auto">
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Cari produk camping..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#3F5B8B]/10 focus:border-[#3F5B8B] transition-all duration-300 shadow-lg hover:shadow-xl bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Filter Kategori */}
        <div class={`mb-6 sm:mb-8 flex gap-2 sm:gap-3 flex-wrap justify-center transform transition-all duration-1000 ${
          isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`} style={{ "animation-delay": "400ms" }}>
          <For each={categories}>
            {(cat, index) => (
              <button
                onClick={() => setSelectedCategory(cat.id)}
                class={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg animate-slide-up ${
                  selectedCategory() === cat.id
                    ? "bg-gradient-to-r from-[#3F5B8B] to-[#6C5E82] text-white shadow-xl"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 border-2 border-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-[#3F5B8B]/30"
                }`}
                style={{ "animation-delay": `${600 + index() * 100}ms` }}
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
            class="px-4 sm:px-6 py-2 sm:py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 animate-slide-up"
            style={{ "animation-delay": "1000ms" }}
          >
            <RotateIcon />
            Reset
          </button>
        </div>

        {/* Daftar Produk */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <For each={filteredProducts()}>
            {(item, index) => {
              const rentalStatus = getRentalStatus(item.id);
              const statusBadge = rentalStatus ? getStatusBadge(rentalStatus) : null;
              
              return (
                <div class={`bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] hover:border-[#3F5B8B]/30 overflow-hidden relative animate-slide-up group`}
                     style={{ "animation-delay": `${1200 + index() * 100}ms` }}>
                  {/* Badge */}
                  {item.badge && (
                    <div class="absolute top-3 left-3 z-10">
                      <span
                        class={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full text-white shadow-lg animate-pulse ${item.badgeColor}`}
                      >
                        <StarIcon />
                        {item.badge}
                      </span>
                    </div>
                  )}

                  {/* Rental Status Badge */}
                  {statusBadge && (
                    <div class="absolute top-3 right-3 z-10">
                      <span class={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${statusBadge.class}`}>
                        <statusBadge.icon />
                        <span class="hidden sm:inline">{statusBadge.text}</span>
                      </span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div class="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
                    <img
                      src={item.img}
                      alt={item.name}
                      class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-4"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                    {/* Floating shine effect */}
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform skew-x-12 translate-x-full group-hover:translate-x-[-100%]"></div>
                  </div>

                  <div class="p-4 sm:p-6">
                    {/* Product Info */}
                    <div class="space-y-3 mb-6">
                      <h3 class="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-[#3F5B8B] transition-colors duration-300 line-clamp-2">
                        {item.name}
                      </h3>
                      <div class="flex items-center gap-2">
                        <ShoppingCartIcon />
                        <span class="text-[#3F5B8B] font-bold text-xl">
                          Rp{item.price.toLocaleString("id-ID")}
                        </span>
                        <span class="text-sm text-gray-500">/hari</span>
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
                        class="bg-gradient-to-r from-[#3F5B8B] to-[#6C5E82] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#2C4A6C] hover:to-[#5A4D73] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                      >
                        <EyeIcon />
                        Lihat Detail
                      </A>
                      
                      {/* Tombol Ulasan - kondisional berdasarkan status rental */}
                      {hasCompletedRental(item.id) ? (
                        <A
                          href={`/ulasan/${item.id}`}
                          class="border-2 border-green-500 text-green-600 py-3 px-4 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:border-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm animate-pulse"
                        >
                          <StarIcon />
                          Berikan Ulasan
                        </A>
                      ) : (
                        <div class="relative group">
                          <button
                            disabled
                            class="w-full border-2 border-gray-300 text-gray-400 py-3 px-4 rounded-xl cursor-not-allowed bg-gray-50 font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                            title="Selesaikan rental terlebih dahulu untuk memberikan ulasan"
                          >
                            <LockIcon />
                            <span class="hidden sm:inline">Ulasan Terkunci</span>
                            <span class="sm:hidden">Terkunci</span>
                          </button>
                          {/* Enhanced Tooltip */}
                          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-800 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-20 hidden sm:block shadow-2xl">
                            <div class="flex items-center gap-2 mb-1">
                              <LockIcon />
                              <span class="font-semibold">Fitur Terkunci</span>
                            </div>
                            <p>Selesaikan rental produk ini untuk membuka ulasan</p>
                            <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }}
          </For>
        </div>

        {/* Empty State */}
        {filteredProducts().length === 0 && (
          <div class={`text-center py-20 transform transition-all duration-1000 ${
            isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div class="text-8xl mb-6 animate-bounce">🏕️</div>
            <h3 class="text-2xl font-bold text-gray-600 mb-3">Tidak ada produk yang ditemukan</h3>
            <p class="text-gray-500 text-lg mb-6">Coba ubah kata kunci pencarian atau kategori</p>
            <button
              onClick={() => {
                setSelectedCategory("semua");
                setSearchQuery("");
              }}
              class="bg-gradient-to-r from-[#3F5B8B] to-[#6C5E82] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#2C4A6C] hover:to-[#5A4D73] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
            >
              <RotateIcon />
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Enhanced CSS Animations */}
      <style>
        {`
          @keyframes slide-up {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes bounce {
            0%, 100% { 
              transform: translateY(0); 
            }
            50% { 
              transform: translateY(-20px); 
            }
          }
          
          .animate-slide-up {
            animation: slide-up 0.8s ease-out both;
          }
          
          .animate-bounce {
            animation: bounce 2s infinite;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #3F5B8B, #6C5E82);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #2E4A73, #5A4D73);
          }
        `}
      </style>
    </div>
  );
}