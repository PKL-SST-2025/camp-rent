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

  const ONGKIR = 20000;
  const ADMIN_FEE = 5000;

  onMount(() => {
    const saved = localStorage.getItem("keranjang");
    if (saved) setItems(JSON.parse(saved));
  });

  const subtotal = () =>
    items().reduce((acc, item) => acc + item.price * item.quantity, 0);

  const biayaTambahan = () => {
    const method = formData().method;
    if (method === "cod") return ONGKIR;
    if (method === "transfer") return ADMIN_FEE;
    return 0;
  };

  const totalAkhir = () => subtotal() + biayaTambahan();

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

    const checkoutData = {
      name: formData().name,
      email: formData().email,
      phone: formData().phone,
      address: formData().address,
      method: formData().method,
      items: items().map(item => ({
        name: item.name,
        days: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal: subtotal(),
      tambahan: biayaTambahan(),
      total: totalAkhir(),
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));
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
            <option value="transfer">Transfer Bank</option>
            <option value="cod">COD</option>
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

        <div class="mt-4 space-y-1">
          <p>Subtotal: Rp.{subtotal().toLocaleString("id-ID")}</p>
          {formData().method === "cod" && (
            <p>Ongkir (COD): Rp.{ONGKIR.toLocaleString("id-ID")}</p>
          )}
          {formData().method === "transfer" && (
            <p>Biaya Admin (Transfer): Rp.{ADMIN_FEE.toLocaleString("id-ID")}</p>
          )}
          <p class="font-semibold text-base mt-2">
            Total: Rp.{totalAkhir().toLocaleString("id-ID")}
          </p>
        </div>

        <div class="flex justify-end">
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
