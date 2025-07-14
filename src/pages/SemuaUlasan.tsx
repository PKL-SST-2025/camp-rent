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
  { id: 1, name: "Tenda Dome", img: "src/assets/tenda.png" },
  { id: 2, name: "Kompor Lipat", img: "src/assets/kompor.png" },
  { id: 3, name: "Lampu Camping", img: "src/assets/lampu.png" },
  { id: 4, name: "Carrier 60L", img: "src/assets/carrier.png" },
  { id: 5, name: "Sleeping Bag", img: "src/assets/sleepbag.png" },
  { id: 6, name: "Headlamp LED", img: "src/assets/headlamp.png" },
  { id: 7, name: "Flysheet", img: "src/assets/flysheet.png" },
  { id: 8, name: "Gas Kaleng", img: "src/assets/gas.png" },
  { id: 9, name: "Cooking Set", img: "src/assets/cookset.png" },
  { id: 10, name: "Matras", img: "src/assets/matras.png" },
];

export default function SemuaUlasan() {
  const [ulasanList, setUlasanList] = createSignal<Ulasan[]>([]);
  const [filterRating, setFilterRating] = createSignal<number | null>(null);
  const [filterProduct, setFilterProduct] = createSignal<number | null>(null);
  const [sortNewest, setSortNewest] = createSignal(true);

  onMount(() => {
    const all = JSON.parse(localStorage.getItem("ulasanProduk") || "[]");
    setUlasanList(all);
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
    <div class="max-w-6xl mx-auto p-4">
      <h2 class="text-2xl font-bold text-[#3F5B8B] mb-4">Semua Ulasan Produk</h2>

      {/* FILTER SECTION */}
      <div class="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div class="flex flex-wrap gap-2">
          {/* Filter Rating */}
          <button
            onClick={() => setFilterRating(null)}
            class={`px-3 py-1 rounded-full text-sm border ${
              filterRating() === null
                ? "bg-[#F4A6B8] text-white"
                : "bg-white text-[#3F5B8B] border-[#3F5B8B]"
            }`}
          >
            Semua Rating
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              onClick={() => setFilterRating(star)}
              class={`px-3 py-1 rounded-full text-sm border ${
                filterRating() === star
                  ? "bg-[#F4A6B8] text-white"
                  : "bg-white text-[#3F5B8B] border-[#3F5B8B]"
              }`}
            >
              {"★".repeat(star)}{"☆".repeat(5 - star)}
            </button>
          ))}
        </div>

        {/* Sort by waktu */}
        <button
          onClick={() => setSortNewest((prev) => !prev)}
          class="text-sm px-4 py-1 border border-[#3F5B8B] text-[#3F5B8B] rounded-full bg-white hover:bg-[#F4A6B8] hover:text-white transition"
        >
          Sort: {sortNewest() ? "Terbaru" : "Terlama"}
        </button>
      </div>

      {/* Filter Produk */}
      <div class="mb-4">
        <label class="text-sm font-semibold mr-2 text-[#3F5B8B]">Filter Produk:</label>
        <select
          onInput={(e) =>
            setFilterProduct(
              e.currentTarget.value === "all" ? null : Number(e.currentTarget.value)
            )
          }
          class="px-3 py-1 border border-[#3F5B8B] text-sm rounded bg-white text-[#3F5B8B]"
        >
          <option value="all">Semua Produk</option>
          <For each={dummyProducts}>
            {(p) => <option value={p.id}>{p.name}</option>}
          </For>
        </select>
      </div>

      {/* DAFTAR ULASAN */}
      <Show
        when={filteredUlasan().length > 0}
        fallback={<p class="text-gray-500">Tidak ada ulasan yang cocok.</p>}
      >
        <div class="grid md:grid-cols-2 gap-6">
          <For each={filteredUlasan()}>
            {(ulasan) => {
              const product = getProduct(ulasan.productId);
              return (
                <div class="bg-white p-4 rounded-xl shadow space-y-2">
                  <div class="flex items-center gap-4">
                    <img
                      src={product?.img}
                      alt={product?.name}
                      class="w-16 h-16 object-contain rounded"
                    />
                    <div>
                      <h3 class="font-bold text-gray-800">{product?.name}</h3>
                      <div class="text-yellow-400 text-sm">
                        {"★".repeat(ulasan.rating)}{"☆".repeat(5 - ulasan.rating)}
                      </div>
                    </div>
                  </div>
                  <p class="text-gray-700">{ulasan.comment}</p>
                  <p class="text-xs text-gray-500 italic">
                    {new Date(ulasan.date).toLocaleString("id-ID")} - {ulasan.user}
                  </p>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
}
