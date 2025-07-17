import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, onMount, For } from "solid-js";

// Tipe Produk & Ulasan
type Product = {
  id: number;
  name: string;
  img: string;
};

type Ulasan = {
  productId: number;
  rating: number;
  comment: string;
  date: string;
  user: string;
  productName: string;
};

// Dummy Data Produk
const dummyProducts: Product[] = [
  { id: 1, name: "Tenda Dome", img: "../assets/tenda.png" },
  { id: 2, name: "Kompor Lipat", img: "../assets/kompor.png" },
  { id: 3, name: "Lampu Camping", img: "../assets/lampu.png" },
  { id: 4, name: "Carrier 60L", img: "../assets/carrier.png" },
  { id: 5, name: "Sleeping Bag", img: "../assets/sleepbag.png" },
  { id: 6, name: "Headlamp LED", img: "../assets/headlamp.png" },
  { id: 7, name: "Flysheet", img: "../assets/flysheet.png" },
  { id: 8, name: "Gas Kaleng", img: "../assets/gas.png" },
  { id: 9, name: "Cooking Set", img: "../assets/cookset.png" },
  { id: 10, name: "Matras", img: "../assets/matras.png" },
];

export default function Ulasan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);
  const product = dummyProducts.find((p) => p.id === productId);

  const [ulasanList, setUlasanList] = createSignal<Ulasan[]>([]);
  const [rating, setRating] = createSignal(5);
  const [comment, setComment] = createSignal("");

  // Ambil ulasan dari localStorage saat mount
  onMount(() => {
    const all = JSON.parse(localStorage.getItem("ulasanProduk") || "[]");
    setUlasanList(all.filter((u: Ulasan) => u.productId === productId));
  });

  const handleSubmit = () => {
    if (comment().trim() === "") {
      alert("Komentar tidak boleh kosong.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const email = currentUser.email || "Anonim";

    const newUlasan: Ulasan = {
      productId,
      rating: rating(),
      comment: comment(),
      date: new Date().toISOString(),
      user: email,
      productName: product?.name || "Produk",
    };

    const all = JSON.parse(localStorage.getItem("ulasanProduk") || "[]");
    const updated = [...all, newUlasan];
    localStorage.setItem("ulasanProduk", JSON.stringify(updated));
    setUlasanList(updated.filter((u: Ulasan) => u.productId === productId));
    setComment("");
    alert("Ulasan berhasil dikirim!");
  };

  return (
    <div class="max-w-2xl mx-auto p-4">
      <h2 class="text-xl font-bold text-[#3F5B8B] mb-4">Ulasan Produk</h2>

      {/* Info Produk */}
      {product && (
        <div class="flex items-center gap-4 bg-white p-4 rounded shadow mb-6">
          <img src={product.img} alt={product.name} class="h-20 w-20 object-contain" />
          <div>
            <h3 class="text-lg font-bold text-gray-800">{product.name}</h3>
            <p class="text-sm text-gray-500">ID Produk: {product.id}</p>
          </div>
        </div>
      )}

      {/* Form Ulasan */}
      <div class="bg-white p-4 rounded shadow mb-6">
        <label class="text-sm font-medium text-gray-600">Rating:</label>
        <div class="flex gap-1 mt-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              onClick={() => setRating(star)}
              class={`text-2xl ${star <= rating() ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </button>
          ))}
        </div>

        <label class="text-sm font-medium text-gray-600">Komentar:</label>
        <textarea
          value={comment()}
          onInput={(e) => setComment(e.currentTarget.value)}
          class="w-full border p-2 mt-1 rounded"
          rows="4"
          placeholder="Tulis pengalaman kamu"
        ></textarea>

        <button
          onClick={handleSubmit}
          class="mt-4 w-full bg-[#3F5B8B] hover:bg-[#2C4A6C] text-white py-2 rounded transition"
        >
          Kirim Ulasan
        </button>
      </div>

      {/* Daftar Ulasan */}
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-lg font-semibold mb-3">Ulasan Pengguna:</h3>
        <For each={ulasanList()}>
          {(u) => (
            <div class="border-b py-2">
              <div class="flex gap-1 text-yellow-400 text-sm">
                {"★".repeat(u.rating)}
                {"☆".repeat(5 - u.rating)}
              </div>
              <p class="text-gray-700 mt-1">{u.comment}</p>
              <p class="text-xs text-gray-400">
                {new Date(u.date).toLocaleString("id-ID")} - {u.user}
              </p>
            </div>
          )}
        </For>
        {ulasanList().length === 0 && (
          <p class="text-sm text-gray-500">Belum ada ulasan.</p>
        )}
      </div>

      {/* Tombol Kembali */}
      <div class="mt-6 flex justify-start">
        <button
          onClick={() => navigate("/produk")}
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#3F5B8B] text-white rounded-full shadow hover:bg-[#2C4A6C] transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Produk
        </button>
      </div>
    </div>
  );
}
