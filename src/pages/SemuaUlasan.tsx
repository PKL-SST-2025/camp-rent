import { onMount, createSignal, For, Show } from "solid-js";

type Ulasan = {
  productId: number;
  rating: number;
  comment: string;
  date: string;
  user: string;
};

type Product = {
  id: number;
  name: string;
  img: string;
};

// Dummy produk
const dummyProducts: Product[] = [
  { id: 1, name: "Tenda Dome", img: "/tenda.png" },
  { id: 2, name: "Kompor Lipat", img: "/kompor.png" },
  { id: 3, name: "Lampu Camping", img: "/lampu.png" },
  { id: 4, name: "Carrier 60L", img: "/carrier.png" },
  { id: 5, name: "Sleeping Bag", img: "/sleepbag.png" },
  { id: 6, name: "Headlamp LED", img: "/headlamp.png" },
  { id: 7, name: "Flysheet", img: "/flysheet.png" },
  { id: 8, name: "Gas Kaleng", img: "/gas.png" },
  { id: 9, name: "Cooking Set", img: "/cookset.png" },
  { id: 10, name: "Matras", img: "/matras.png" },
];

export default function SemuaUlasan() {
  const [ulasanList, setUlasanList] = createSignal<Ulasan[]>([]);
  const [filterRating, setFilterRating] = createSignal<number | null>(null);
  const [filterProduct, setFilterProduct] = createSignal<number | null>(null);
  const [sortNewest, setSortNewest] = createSignal(true);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(() => {
    // Simulate loading animation
    setTimeout(() => {
      const all = JSON.parse(localStorage.getItem("ulasanProduk") || "[]");
      setUlasanList(all);
      setIsLoading(false);
    }, 800);
  });

  const getProduct = (productId: number) =>
    dummyProducts.find((p) => p.id === productId);

  const filteredUlasan = () => {
    let result = [...ulasanList()];
    if (filterRating() !== null) {
      result = result.filter((u) => u.rating === filterRating());
    }
    if (filterProduct() !== null) {
      result = result.filter((u) => u.productId === filterProduct());
    }
    return result.sort((a, b) =>
      sortNewest()
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          .animate-slideInUp {
            animation: slideInUp 0.6s ease-out forwards;
          }
          
          .animate-slideInLeft {
            animation: slideInLeft 0.5s ease-out forwards;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
          
          .animate-pulse-custom {
            animation: pulse 2s ease-in-out infinite;
          }
          
          .animate-scaleIn {
            animation: scaleIn 0.4s ease-out forwards;
          }
          
          .stagger-1 { animation-delay: 0.1s; opacity: 0; }
          .stagger-2 { animation-delay: 0.2s; opacity: 0; }
          .stagger-3 { animation-delay: 0.3s; opacity: 0; }
          .stagger-4 { animation-delay: 0.4s; opacity: 0; }
          .stagger-5 { animation-delay: 0.5s; opacity: 0; }
          .stagger-6 { animation-delay: 0.6s; opacity: 0; }
          
          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }
          
          .filter-button {
            transition: all 0.2s ease-in-out;
            position: relative;
            overflow: hidden;
          }
          
          .filter-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }
          
          .filter-button:hover::before {
            left: 100%;
          }
          
          .loading-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}
      </style>
      
      <div class="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div class="text-center mb-8 animate-slideInUp">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#3F5B8B] to-[#F4A6B8] bg-clip-text text-transparent mb-2">
            Semua Ulasan Produk
          </h2>
          <div class="h-1 w-24 bg-gradient-to-r from-[#3F5B8B] to-[#F4A6B8] mx-auto rounded-full"></div>
        </div>

        <Show
          when={!isLoading()}
          fallback={
            <div class="space-y-6">
              <div class="flex flex-wrap gap-3 items-center justify-between">
                <div class="flex flex-wrap gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div class="loading-skeleton w-20 h-8 rounded-full"></div>
                  ))}
                </div>
                <div class="loading-skeleton w-24 h-8 rounded-full"></div>
              </div>
              <div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div class="bg-white p-6 rounded-2xl shadow-lg space-y-4">
                    <div class="flex items-center gap-4">
                      <div class="loading-skeleton w-16 h-16 rounded-lg"></div>
                      <div class="space-y-2 flex-1">
                        <div class="loading-skeleton h-4 w-24 rounded"></div>
                        <div class="loading-skeleton h-3 w-20 rounded"></div>
                      </div>
                    </div>
                    <div class="loading-skeleton h-16 w-full rounded"></div>
                    <div class="loading-skeleton h-3 w-32 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          }
        >
          {/* FILTER SECTION */}
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 mb-8 animate-slideInLeft">
            <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div class="w-full lg:w-auto">
                <h3 class="text-sm font-semibold text-[#3F5B8B] mb-3">Filter Rating:</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterRating(null)}
                    class={`filter-button px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300 ${
                      filterRating() === null
                        ? "bg-gradient-to-r from-[#3F5B8B] to-[#F4A6B8] text-white border-transparent shadow-lg scale-105"
                        : "bg-white text-[#3F5B8B] border-[#3F5B8B] hover:bg-[#3F5B8B] hover:text-white hover:scale-105"
                    }`}
                  >
                    Semua Rating
                  </button>
                  {[5, 4, 3, 2, 1].map((star, index) => (
                    <button
                      onClick={() => setFilterRating(star)}
                      class={`filter-button px-3 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300 stagger-${index + 1} animate-fadeIn ${
                        filterRating() === star
                          ? "bg-gradient-to-r from-[#F4A6B8] to-[#3F5B8B] text-white border-transparent shadow-lg scale-105"
                          : "bg-white text-[#3F5B8B] border-[#3F5B8B] hover:bg-[#F4A6B8] hover:text-white hover:scale-105"
                      }`}
                    >
                      <span class="flex items-center gap-1">
                        {"★".repeat(star)}<span class="text-gray-300">{"☆".repeat(5 - star)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Filter Produk */}
                <div class="flex-1 sm:flex-none">
                  <label class="text-sm font-semibold text-[#3F5B8B] block mb-2">Filter Produk:</label>
                  <select
                    onInput={(e) =>
                      setFilterProduct(
                        e.currentTarget.value === "all" ? null : Number(e.currentTarget.value)
                      )
                    }
                    class="w-full sm:w-48 px-4 py-2 border-2 border-[#3F5B8B] text-sm rounded-full bg-white text-[#3F5B8B] focus:outline-none focus:ring-2 focus:ring-[#F4A6B8] transition-all duration-300"
                  >
                    <option value="all">Semua Produk</option>
                    <For each={dummyProducts}>
                      {(p) => <option value={p.id}>{p.name}</option>}
                    </For>
                  </select>
                </div>

                {/* Sort Button */}
                <div class="flex-1 sm:flex-none">
                  <label class="text-sm font-semibold text-[#3F5B8B] block mb-2">Urutkan:</label>
                  <button
                    onClick={() => setSortNewest((prev) => !prev)}
                    class="w-full sm:w-auto filter-button px-4 py-2 border-2 border-[#3F5B8B] text-[#3F5B8B] rounded-full bg-white hover:bg-gradient-to-r hover:from-[#3F5B8B] hover:to-[#F4A6B8] hover:text-white hover:scale-105 transition-all duration-300 font-medium"
                  >
                    <span class="flex items-center justify-center gap-2">
                      {sortNewest() ? "🔽" : "🔼"}
                      {sortNewest() ? "Terbaru" : "Terlama"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DAFTAR ULASAN */}
          <Show
            when={filteredUlasan().length > 0}
            fallback={
              <div class="text-center py-16 animate-fadeIn">
                <div class="text-6xl mb-4 animate-pulse-custom">😔</div>
                <p class="text-xl text-gray-500 mb-2">Tidak ada ulasan yang cocok</p>
                <p class="text-gray-400">Coba ubah filter untuk melihat ulasan lainnya</p>
              </div>
            }
          >
            <div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              <For each={filteredUlasan()}>
                {(ulasan, index) => {
                  const product = getProduct(ulasan.productId);
                  return (
                    <div class={`card-hover bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 space-y-4 animate-scaleIn stagger-${(index() % 6) + 1}`}>
                      <div class="flex items-center gap-4">
                        <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 p-2 shadow-inner">
                          <img
                            src={product?.img}
                            alt={product?.name}
                            class="w-16 h-16 object-contain transition-transform duration-300 hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <h3 class="font-bold text-gray-800 truncate text-lg">{product?.name}</h3>
                          <div class="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span class={`text-lg transition-all duration-300 ${i < ulasan.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                            <span class="text-sm text-gray-500 ml-2">({ulasan.rating}/5)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="relative">
                        <p class="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border-l-4 border-[#F4A6B8] italic">
                          "{ulasan.comment}"
                        </p>
                      </div>
                      
                      <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <span class="inline-flex items-center gap-1">
                            📅 {new Date(ulasan.date).toLocaleDateString("id-ID", { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div class="flex items-center gap-1 text-xs font-medium text-[#3F5B8B] bg-blue-50 px-3 py-1 rounded-full">
                          👤 {ulasan.user}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}