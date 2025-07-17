import { createSignal, For } from "solid-js";
import { useParams, useNavigate, A } from "@solidjs/router";
import { Star, ChevronDown } from "lucide-solid";



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
    badgeColor: "bg-yellow-300",
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
    badgeColor: "bg-green-300",
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
      <Star class={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ));

  if (!product) {
    return (
      <div class="text-center mt-20 text-gray-500 text-lg">
        Produk tidak ditemukan ❌
      </div>
    );
  }

  return (
    <div class="bg-white rounded-xl p-6 shadow-md">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gambar Produk */}
        <div class="flex justify-center items-center">
          <img
            src={product.img}
            alt={product.name}
            class="w-60 h-60 object-contain"
          />
        </div>

        {/* Info Produk */}
        <div class="space-y-4">
          <h2 class="text-2xl font-bold text-[#3F5B8B]">{product.name}</h2>
          <div class="flex items-center gap-3">
            <p class="text-xl font-bold text-[#2C4A6C]">
              Rp{product.price.toLocaleString("id-ID")}
            </p>
            <span class="text-sm text-gray-500">/hari</span>
          </div>

          <div class="flex gap-1">{renderStars()}</div>

          <p class="text-gray-700">{product.desc}</p>

          <div class="text-sm text-gray-600 space-y-1">
            <p>Stok: <span class="font-semibold">{product.stock}</span></p>
            <p>Ukuran: <span class="font-semibold">{product.size}</span></p>
            <p>Berat: <span class="font-semibold">{product.weight}</span></p>
          </div>

          {/* Pilih jumlah hari */}
          <div class="relative mt-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen())}
              class="border px-4 py-2 rounded flex items-center gap-2 bg-white shadow-sm"
            >
              {quantity()} hari <ChevronDown class={`h-4 w-4 ${dropdownOpen() ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen() && (
              <div class="absolute mt-1 bg-white shadow border rounded w-full z-20">
                <For each={[1, 2, 3, 4, 5, 6, 7]}>
                  {(day) => (
                    <button
                      onClick={() => {
                        setQuantity(day);
                        setDropdownOpen(false);
                      }}
                      class="block w-full px-4 py-2 text-left hover:bg-[#E6F4EA]"
                    >
                      {day} hari
                    </button>
                  )}
                </For>
              </div>
            )}
          </div>

          {/* Tombol Aksi */}
          <div class="grid grid-cols-2 gap-3 mt-4">
            <button
              class="bg-[#3F5B8B] text-white py-2 rounded-lg hover:bg-[#2C4A6C] transition"
              onClick={() => {
                const keranjang = JSON.parse(localStorage.getItem("keranjang") || "[]");
                const existingIndex = keranjang.findIndex(
                  (item: any) => item.id === product.id
                );

                if (existingIndex !== -1) {
                  keranjang[existingIndex].quantity += quantity();
                } else {
                  keranjang.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    img: product.img,
                    quantity: quantity(),
                  });
                }

                localStorage.setItem("keranjang", JSON.stringify(keranjang));
                alert(`✔️ ${product.name} selama ${quantity()} hari ditambahkan ke keranjang!`);
                navigate("/keranjang");
              }}
            >
              Tambah ke Keranjang
            </button>
            <A
              href="/produk"
              class="border border-[#3F5B8B] text-[#3F5B8B] py-2 rounded-lg text-center hover:bg-[#E3ECF7] transition"
            >
              Kembali ke Produk
            </A>
          </div>

          <div class="bg-[#E3ECF7] p-4 rounded text-sm text-[#3F5B8B] mt-4">
            💡 <b>Tips:</b> Pastikan cek stok & waktu pengambilan sebelum menyewa!
          </div>
        </div>
      </div>

      {/* Semua Produk Lainnya */}
      <div class="mt-12">
        <h3 class="text-lg font-bold text-[#3F5B8B] mb-4">Lihat Produk Lainnya</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <For each={dummyProducts}>
            {(item) => (
              <div
                class="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer p-3 border border-gray-100 hover:border-[#3F5B8B]"
                onClick={() => navigate(`/produk/detail/${item.id}`)}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  class="w-full h-32 object-contain mb-2"
                />
                <div class="text-sm font-semibold text-[#3F5B8B]">{item.name}</div>
                <div class="text-xs text-gray-500">Rp{item.price.toLocaleString("id-ID")} / hari</div>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
