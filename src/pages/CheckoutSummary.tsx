import { createSignal } from "solid-js";

interface OrderItem {
  name: string;
  days: number;
  price: number;
  total: number;
}

interface OrderData {
  name: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export default function CheckoutSummary() {
  const data = localStorage.getItem("checkoutData");
  const parsed: OrderData = data
    ? JSON.parse(data)
    : { name: "", items: [], subtotal: 0, shipping: 0, total: 0 };

  const [orderData] = createSignal<OrderData>(parsed);

 const handleConfirmOrder = () => {
  const checkout = orderData();

  // Ambil data lama dari localStorage
  const existing = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");

  // Ambil tanggal hari ini
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const today = formatter.format(now);

  // Format untuk setiap item dalam checkoutData
  const newEntries = checkout.items.map(item => ({
    name: item.name,
    date: today, // atau gunakan range jika tersedia
    duration: `${item.days} Hari`,
    price: `Rp.${item.total.toLocaleString("id-ID")},00`,
    status: "Diproses",
    statusColor: "bg-yellow-400"
  }));

  // Simpan data baru ke localStorage
  const updated = [...existing, ...newEntries];
  localStorage.setItem("riwayatSewa", JSON.stringify(updated));

  alert("✅ Pesanan berhasil dikonfirmasi!");
};

  return (
    <div class="p-6 bg-[#F4F7FA] min-h-screen">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-8 transition duration-300 hover:shadow-xl">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-[#3F5B8B]">Struk Pemesanan</h2>
            <p class="text-sm text-[#7A7A8B]">CampRent - Solusi sewa alat camping terpercaya</p>
          </div>

          <div class="mb-6">
            <h4 class="font-semibold text-[#3F5B8B] mb-2">Nama Pemesan</h4>
            <p class="text-gray-700 mb-4">{orderData().name || "Pengguna Tidak Diketahui"}</p>

            <h4 class="font-semibold text-[#3F5B8B] mb-2">Detail Barang Disewa</h4>
            <div class="space-y-4">
              {orderData().items.map((item) => (
                <div class="flex justify-between items-center bg-[#E3ECF7] p-3 rounded-md shadow-sm">
                  <div>
                    <div class="text-[#2C4A6C] font-medium">• {item.name}</div>
                    <div class="text-sm text-[#6C5E82] ml-4">{item.days} hari</div>
                  </div>
                  <div class="font-semibold text-[#3F5B8B]">
                    Rp.{item.total.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div class="border-t pt-4 space-y-2">
            <div class="flex justify-between text-sm text-[#3F5B8B]">
              <span>Subtotal</span>
              <span>Rp.{orderData().subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div class="flex justify-between text-sm text-[#3F5B8B]">
              <span>Ongkir</span>
              <span>Rp.{orderData().shipping.toLocaleString("id-ID")}</span>
            </div>
            <div class="flex justify-between font-bold text-lg text-[#2C4A6C] border-t pt-3">
              <span>Total Pembayaran</span>
              <span>Rp.{orderData().total.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button
              onClick={handleConfirmOrder}
              class="bg-[#3F5B8B] hover:bg-[#32466b] text-white font-semibold px-6 py-3 rounded-lg transition duration-300 shadow-md hover:shadow-xl hover:scale-[1.03]"
            >
              Konfirmasi Pesanan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
