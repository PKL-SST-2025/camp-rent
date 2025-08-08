import { createSignal, For } from "solid-js";
import { useParams, useNavigate, A } from "@solidjs/router";

// SVG Icons as components with proper props interface
interface IconProps {
  class?: string;
}

const StarIcon = (props: IconProps) => (
  <svg class={`w-4 h-4 ${props.class || ''}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ChevronDownIcon = (props: IconProps) => (
  <svg class={`w-4 h-4 ${props.class || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const ShoppingCartIcon = (props: IconProps) => (
  <svg class={`w-5 h-5 ${props.class || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 6H4m3 7v4a1 1 0 001 1h8a1 1 0 001-1v-4M9 17h6" />
  </svg>
);

const ArrowLeftIcon = (props: IconProps) => (
  <svg class={`w-5 h-5 ${props.class || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const PackageIcon = (props: IconProps) => (
  <svg class={`w-5 h-5 ${props.class || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const ScaleIcon = (props: IconProps) => (
  <svg class={`w-5 h-5 ${props.class || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const RulerIcon = (props: IconProps) => (
  <svg class={`w-5 h-5 ${props.class || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LightBulbIcon = (props: IconProps) => (
  <svg class={`w-5 h-5 ${props.class || ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

// src/data/produk.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  img: string;
  badge?: string;
  badgeColor?: string;
  desc: string;
  size: string;
  weight: string;
};

export const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Tenda Dome",
    price: 50000,
    stock: 4,
    category: "tenda",
    img: "/tenda.png",
    badge: "Paling Laris",
    badgeColor: "bg-yellow-400",
    desc: "Tenda ringan, waterproof, cocok untuk 2 orang",
    size: "200x200x100 cm",
    weight: "1.8 kg",
  },
  {
    id: 2,
    name: "Kompor Lipat",
    price: 10000,
    stock: 10,
    category: "peralatan",
    img: "/kompor.png",
    desc: "Kompor portable, hemat gas, ringan",
    size: "-",
    weight: "0.6 kg",
  },
  {
    id: 3,
    name: "Lampu Camping",
    price: 10000,
    stock: 10,
    category: "penerangan",
    img: "/lampu.png",
    badge: "Promo",
    badgeColor: "bg-green-400",
    desc: "Lampu LED awet dan terang",
    size: "-",
    weight: "0.3 kg",
  },
  {
    id: 4,
    name: "Carrier 60L",
    price: 40000,
    stock: 5,
    category: "tas",
    img: "/carrier.png",
    desc: "Ransel besar untuk pendakian panjang, kapasitas 60L",
    size: "60x35x25 cm",
    weight: "2.0 kg",
  },
  {
    id: 5,
    name: "Sleeping Bag",
    price: 25000,
    stock: 6,
    category: "tidur",
    img: "/sleepbag.png",
    desc: "Sleeping bag hangat untuk suhu dingin",
    size: "210x75 cm",
    weight: "1.1 kg",
  },
  {
    id: 6,
    name: "Headlamp LED",
    price: 20000,
    stock: 8,
    category: "penerangan",
    img: "/headlamp.png",
    desc: "Headlamp LED tahan air dan terang",
    size: "-",
    weight: "0.2 kg",
  },
  {
    id: 7,
    name: "Flysheet",
    price: 15000,
    stock: 12,
    category: "tenda",
    img: "/flysheet.png",
    desc: "Flysheet untuk pelindung hujan atau tenda darurat",
    size: "300x300 cm",
    weight: "0.9 kg",
  },
  {
    id: 8,
    name: "Gas Kaleng",
    price: 8000,
    stock: 20,
    category: "peralatan",
    img: "/gas.png",
    desc: "Gas kaleng butane universal untuk kompor camping",
    size: "-",
    weight: "0.25 kg",
  },
  {
    id: 9,
    name: "Cooking Set",
    price: 30000,
    stock: 7,
    category: "peralatan",
    img: "/cookset.png",
    desc: "Set alat masak lipat: panci, wajan, dan sendok",
    size: "-",
    weight: "0.8 kg",
  },
  {
    id: 10,
    name: "Matras",
    price: 10000,
    stock: 10,
    category: "tidur",
    img: "/matras.png",
    desc: "Matras gulung untuk alas tidur camping",
    size: "180x50x1 cm",
    weight: "0.7 kg",
  },
];

export default function ProductDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const product = dummyProducts.find((item) => item.id === Number(params.id));
  const [quantity, setQuantity] = createSignal(1);
  const [dropdownOpen, setDropdownOpen] = createSignal(false);

  const renderStars = () =>
    Array.from({ length: 5 }, (_, i) => (
      <StarIcon class={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ));

  if (!product) {
    return (
      <div class="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
        <div class="text-center mt-10 sm:mt-20 px-4">
          <div class="text-4xl sm:text-6xl mb-4">😵</div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-600 mb-2">Produk tidak ditemukan</h2>
          <p class="text-gray-500 mb-6 text-sm sm:text-base">Maaf, produk yang Anda cari tidak tersedia</p>
          <A
            href="/produk"
            class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            <ArrowLeftIcon />
            Kembali ke Produk
          </A>
        </div>
      </div>
    );
  }

  const addToCart = () => {
    try {
      // Dapatkan keranjang yang sudah ada
      const existingCart = JSON.parse(localStorage.getItem("keranjang") || "[]");
      const existingIndex = existingCart.findIndex((item: any) => item.id === product.id);

      if (existingIndex !== -1) {
        // Jika produk sudah ada, tambah quantity
        existingCart[existingIndex].quantity += quantity();
      } else {
        // Jika produk belum ada, tambahkan sebagai item baru
        existingCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          img: product.img,
          quantity: quantity(),
        });
      }

      // Simpan kembali ke localStorage
      localStorage.setItem("keranjang", JSON.stringify(existingCart));
      
      // Show success message
      alert(`✔️ ${product.name} selama ${quantity()} hari berhasil ditambahkan ke keranjang!`);
      
      // Navigate to cart
      navigate("/keranjang");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Terjadi kesalahan saat menambahkan ke keranjang. Silakan coba lagi.");
    }
  };

  return (
    <div class="max-w-7xl mx-auto p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Main Product Card */}
      <div class="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Product Image */}
          <div class="relative">
            {product.badge && (
              <div class="absolute top-2 sm:top-4 left-2 sm:left-4 z-10">
                <span class={`inline-flex items-center gap-1 px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-bold rounded-full text-white shadow-lg ${product.badgeColor}`}>
                  <StarIcon />
                  {product.badge}
                </span>
              </div>
            )}
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-8 flex justify-center items-center min-h-[250px] sm:min-h-[400px]">
              <img
                src={product.img}
                alt={product.name}
                class="w-48 h-48 sm:w-80 sm:h-80 object-contain transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>

          {/* Product Info */}
          <div class="space-y-4 sm:space-y-6">
            <div class="space-y-2 sm:space-y-3">
              <h1 class="text-2xl sm:text-4xl font-bold text-gray-800 leading-tight">{product.name}</h1>
              <div class="flex items-center gap-2 sm:gap-4">
                <div class="flex items-center gap-2">
                  <ShoppingCartIcon class="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <span class="text-xl sm:text-3xl font-bold text-blue-600">
                    Rp{product.price.toLocaleString("id-ID")}
                  </span>
                </div>
                <span class="text-sm sm:text-lg text-gray-500 font-medium">/hari</span>
              </div>
            </div>

            {/* Rating Stars */}
            <div class="flex gap-1 items-center">
              {renderStars()}
              <span class="ml-2 text-xs sm:text-sm text-gray-500">(4.8/5)</span>
            </div>

            {/* Description */}
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-100">
              <p class="text-gray-700 text-sm sm:text-lg leading-relaxed">{product.desc}</p>
            </div>

            {/* Product Specs */}
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div class="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <PackageIcon class="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <span class="text-xs sm:text-sm font-semibold text-gray-600">Stok</span>
                </div>
                <span class={`text-sm sm:text-lg font-bold ${
                  product.stock > 5 ? 'text-green-600' : 
                  product.stock > 0 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {product.stock} unit
                </span>
              </div>
              
              <div class="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <RulerIcon class="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <span class="text-xs sm:text-sm font-semibold text-gray-600">Ukuran</span>
                </div>
                <span class="text-sm sm:text-lg font-bold text-gray-800">{product.size}</span>
              </div>
              
              <div class="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 sm:col-span-1 col-span-1">
                <div class="flex items-center gap-2 sm:gap-3 mb-2">
                  <ScaleIcon class="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                  <span class="text-xs sm:text-sm font-semibold text-gray-600">Berat</span>
                </div>
                <span class="text-sm sm:text-lg font-bold text-gray-800">{product.weight}</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div class="space-y-3">
              <label class="text-sm font-semibold text-gray-700">Pilih Durasi Sewa</label>
              <div class="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen())}
                  class="w-full sm:w-48 border-2 border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-xl flex items-center justify-between bg-white shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  <span>{quantity()} hari</span>
                  <ChevronDownIcon class={`transition-transform duration-300 ${dropdownOpen() ? "rotate-180" : ""}`} />
                </button>
                {dropdownOpen() && (
                  <div class="absolute mt-2 bg-white shadow-xl border border-gray-200 rounded-xl w-full sm:w-48 z-20 overflow-hidden">
                    <For each={[1, 2, 3, 4, 5, 6, 7]}>
                      {(day) => (
                        <button
                          onClick={() => {
                            setQuantity(day);
                            setDropdownOpen(false);
                          }}
                          class="block w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 font-medium text-sm sm:text-base"
                        >
                          {day} hari
                        </button>
                      )}
                    </For>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                class="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                onClick={addToCart}
              >
                <ShoppingCartIcon class="w-4 h-4 sm:w-5 sm:h-5" />
                <span class="hidden sm:inline">Tambah ke Keranjang</span>
                <span class="sm:hidden">Tambah</span>
              </button>
              
              <A
                href="/produk"
                class="border-2 border-blue-500 text-blue-500 py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-center font-bold hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <ArrowLeftIcon class="w-4 h-4 sm:w-5 sm:h-5" />
                <span class="hidden sm:inline">Kembali ke Produk</span>
                <span class="sm:hidden">Kembali</span>
              </A>
            </div>

            {/* Tips Section */}
            <div class="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-yellow-200">
              <div class="flex items-start gap-3 sm:gap-4">
                <LightBulbIcon class="text-yellow-600 mt-1 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                <div>
                  <h4 class="font-bold text-yellow-800 mb-2 text-sm sm:text-base">💡 Tips Penting</h4>
                  <p class="text-yellow-700 text-xs sm:text-sm leading-relaxed">
                    Pastikan cek stok & waktu pengambilan sebelum menyewa! Hubungi kami jika ada pertanyaan khusus tentang produk ini.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div class="mt-8 sm:mt-16">
        <div class="text-center mb-6 sm:mb-12 px-4">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">Produk Lainnya</h2>
          <p class="text-gray-600 text-sm sm:text-base">Temukan produk camping lainnya yang mungkin Anda butuhkan</p>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <For each={dummyProducts.filter(item => item.id !== product.id).slice(0, 8)}>
            {(item) => (
              <div
                class="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer p-2 sm:p-4 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.02] group"
                onClick={() => navigate(`/produk/detail/${item.id}`)}
              >
                <div class="relative mb-2 sm:mb-4">
                  {item.badge && (
                    <div class="absolute top-1 sm:top-2 left-1 sm:left-2 z-10">
                      <span class={`inline-block px-1 sm:px-2 py-0.5 sm:py-1 text-xs font-bold rounded-full text-white ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                  )}
                  <div class="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-4 h-24 sm:h-32 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                
                <div class="space-y-1 sm:space-y-2">
                  <h3 class="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 text-xs sm:text-sm">
                    {item.name}
                  </h3>
                  <div class="flex items-center gap-1">
                    <span class="text-blue-600 font-bold text-xs sm:text-sm">
                      Rp{item.price.toLocaleString("id-ID")}
                    </span>
                    <span class="text-xs text-gray-500">/hari</span>
                  </div>
                  <div class={`text-xs font-semibold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full inline-block ${
                    item.stock > 5 ? 'bg-green-100 text-green-700' : 
                    item.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    Stok: {item.stock}
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}