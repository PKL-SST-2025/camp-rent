import { createSignal, For, onMount } from "solid-js";
import { A } from "@solidjs/router";

// Import gambar satu per satu
function ProdukList() {
  return (
    <div>
      <h1>Produk</h1>
      <img src="/tenda.png" alt="Tenda" />
      <img src="/kompor.png" alt="Kompor" />
      <img src="/lampu.png" alt="Lampu" />
      <img src="/carrier.png" alt="Carrier" />
      <img src="/sleepbag.png" alt="Sleeping Bag" />
      <img src="/headlamp.png" alt="Headlamp" />
      <img src="/flysheet.png" alt="Flysheet" />
      <img src="/gas.png" alt="Gas" />
      <img src="/cookset.png" alt="Cookset" />
      <img src="/matras.png" alt="Matras" />
    </div>
  );
}



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
  { id: 1, name: "Tenda Dome", price: 50000, stock: 4, category: "tenda", img: "/tenda.png", badge: "Paling Laris", badgeColor: "bg-yellow-300" },
  { id: 2, name: "Kompor Lipat", price: 10000, stock: 10, category: "peralatan", img: "/kompor.png" },
  { id: 3, name: "Lampu Camping", price: 10000, stock: 10, category: "penerangan", img: "/lampu.png", badge: "Promo", badgeColor: "bg-green-300" },
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

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = createSignal("semua");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [products, setProducts] = createSignal<Product[]>([]);
  

  onMount(() => {
  const local = localStorage.getItem("produkList");

  // Cek apakah datanya valid (mengandung img yang benar), kalau tidak reset
  const parsed = local ? JSON.parse(local) : null;
  const isValid = parsed && Array.isArray(parsed) && parsed.every(p => typeof p.img === "string" && p.img.startsWith("/"));

  if (!isValid) {
    localStorage.setItem("produkList", JSON.stringify(defaultProducts));
    setProducts(defaultProducts);
  } else {
    setProducts(parsed);
  }
});

  const filteredProducts = () =>
    products().filter((product) => {
      const matchCategory = selectedCategory() === "semua" || product.category === selectedCategory();
      const matchSearch = product.name.toLowerCase().includes(searchQuery().toLowerCase());
      return matchCategory && matchSearch;
    });

  return (
    <>
      {/* Filter Kategori */}
      <div class="mb-4 flex gap-2 flex-wrap">
        <For each={categories}>
          {(cat) => (
            <button
              onClick={() => setSelectedCategory(cat.id)}
              class={`px-4 py-2 rounded-full text-sm transition-all ${
                selectedCategory() === cat.id
                  ? "bg-[#A3BFF5] text-white"
                  : "bg-white text-gray-700 border hover:bg-[#CDE8FF]"
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
          class="px-4 py-2 bg-[#E0D4FD] text-gray-800 rounded-full text-sm hover:bg-[#D3E3FB]"
        >
          Reset
        </button>
      </div>

      {/* Daftar Produk */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={filteredProducts()}>
          {(item) => (
            <div class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all">
              {item.badge && (
                <div
                  class={`inline-block mb-2 px-3 py-1 text-xs font-semibold rounded-full text-white ${item.badgeColor}`}
                >
                  {item.badge}
                </div>
              )}
              <img
                src={item.img}
                alt={item.name}
                class="h-40 w-full object-contain mb-4"
              />
              <h3 class="text-lg font-bold text-gray-800">{item.name}</h3>
              <p class="text-[#5B77C5] font-semibold">
                Rp{item.price.toLocaleString("id-ID")}/hari
              </p>
              <p class="text-gray-500 text-sm mb-3">Stok: {item.stock}</p>
              <div class="flex flex-col gap-2 mt-2">
                <A
                  href={`/produk/detail/${item.id}`}
                  class="bg-[#7FA4F3] text-white py-2 rounded-lg text-center hover:bg-[#5C85E2] transition"
                >
                  Lihat Detail
                </A>
                <A
                  href={`/ulasan/${item.id}`}
                  class="border border-[#7FA4F3] text-[#7FA4F3] py-2 rounded-lg text-center hover:bg-[#E6EEFB] transition"
                >
                  Ulasan
                </A>
              </div>
            </div>
          )}
        </For>
      </div>

      {filteredProducts().length === 0 && (
        <div class="text-center py-12 text-gray-500 text-lg">
          Tidak ada produk yang ditemukan.
        </div>
      )}
    </>
  );
}