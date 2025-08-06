import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

type FormField = "name" | "email" | "phone" | "address" | "method" | "agreement";

export default function Checkout() {
  const [formData, setFormData] = createSignal<{
    [key: string]: string | boolean;
    name: string;
    email: string;
    phone: string;
    address: string;
    method: string;
    agreement: boolean;
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
    method: "",
    agreement: false,
  });

  const [items, setItems] = createSignal<any[]>([]);
  const navigate = useNavigate();

  onMount(() => {
    const saved = localStorage.getItem("keranjang");
    if (saved) setItems(JSON.parse(saved));
  });

  const subtotal = () =>
    items().reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getShippingCost = () => {
    const method = formData().method;
    if (method === "cod") return 10000;
    if (method === "transfer") return 2500;
    return 0; // ewallet atau kosong
  };

  const total = () => subtotal() + getShippingCost();

  const handleInputChange = (field: FormField, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
  e.preventDefault();

  if (!formData().name || !formData().email || !formData().method) {
    alert("Mohon isi data wajib terlebih dahulu.");
    return;
  }
  if (!formData().agreement) {
    alert("Harap setujui syarat dan ketentuan.");
    return;
  }

  // Data untuk checkout summary
  const checkoutData = {
    name: formData().name,
    items: items().map((item) => ({
      name: item.name,
      days: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    })),
    subtotal: subtotal(),
    shipping: getShippingCost(),
    total: total(),
  };

  // Simpan ke checkout summary
  localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

  // Simpan ke riwayatSewa untuk Dashboard & Riwayat
  const riwayatSewa = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
  const tanggalSekarang = new Date().toISOString().split("T")[0]; // format YYYY-MM-DD
  items().forEach((item) => {
    riwayatSewa.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: item.name,
      date: tanggalSekarang,
      duration: `${item.quantity} Hari`,
      price: item.price * item.quantity,
      status: "Diproses",
    });
  });
  localStorage.setItem("riwayatSewa", JSON.stringify(riwayatSewa));

  alert("✅ Checkout berhasil!");
  navigate("/checkout-summary");
};

  return (
    <div class="p-6 max-w-3xl mx-auto text-[#3F5B8B]">
      <h2 class="text-2xl font-bold mb-6 text-center">Formulir Checkout</h2>

      <form
        onSubmit={handleSubmit}
        class="space-y-5 bg-white p-6 rounded shadow-md border border-[#E3ECF7]"
      >
        <div>
          <label class="block text-sm mb-1">Nama Lengkap *</label>
          <input
            type="text"
            class="w-full border border-[#cbd5e1] p-2 rounded focus:ring-2 focus:ring-[#3F5B8B]"
            value={formData().name}
            onInput={(e) => handleInputChange("name", e.currentTarget.value)}
          />
        </div>
        <div>
          <label class="block text-sm mb-1">Email *</label>
          <input
            type="email"
            class="w-full border border-[#cbd5e1] p-2 rounded focus:ring-2 focus:ring-[#3F5B8B]"
            value={formData().email}
            onInput={(e) => handleInputChange("email", e.currentTarget.value)}
          />
        </div>
        <div>
          <label class="block text-sm mb-1">No. HP</label>
          <input
            type="tel"
            class="w-full border border-[#cbd5e1] p-2 rounded focus:ring-2 focus:ring-[#3F5B8B]"
            value={formData().phone}
            onInput={(e) => handleInputChange("phone", e.currentTarget.value)}
          />
        </div>
        <div>
          <label class="block text-sm mb-1">Alamat</label>
          <textarea
            rows={3}
            class="w-full border border-[#cbd5e1] p-2 rounded focus:ring-2 focus:ring-[#3F5B8B]"
            value={formData().address}
            onInput={(e) => handleInputChange("address", e.currentTarget.value)}
          />
        </div>
        <div>
          <label class="block text-sm mb-1">Metode Pembayaran *</label>
          <select
            class="w-full border border-[#cbd5e1] p-2 rounded focus:ring-2 focus:ring-[#3F5B8B]"
            value={formData().method}
            onInput={(e) => handleInputChange("method", e.currentTarget.value)}
          >
            <option value="">Pilih metode</option>
            <option value="transfer">Transfer Bank (Biaya Admin Rp2.500)</option>
            <option value="cod">COD (Ongkir Rp10.000)</option>
            <option value="ewallet">E-Wallet</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData().agreement as boolean}
            onInput={(e) => handleInputChange("agreement", e.currentTarget.checked)}
          />
          <label class="text-sm">
            Saya menyetujui{" "}
            <span class="underline text-[#6C5E82]">syarat dan ketentuan</span>
          </label>
        </div>

        <div class="flex justify-between items-center mt-4">
          <span class="font-semibold text-base">
            Total: Rp.{total().toLocaleString("id-ID")}
          </span>
          <button
            type="submit"
            class="bg-[#3F5B8B] text-white px-6 py-2 rounded hover:bg-[#334670] transition shadow-md hover:scale-[1.03]"
          >
            Bayar Sekarang
          </button>
        </div>
      </form>
    </div>
  );
}
