import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export default function Tracking() {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = createSignal<any>(null);

  onMount(() => {
    const all = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
    const found = all.find((item: any) => String(item.id) === params.id);
    setData(found);
  });

  const updateStatus = () => {
    const current = data();
    if (!current) return;

    const next =
      current.status === "Diproses"
        ? "Dikirim"
        : current.status === "Dikirim"
        ? "Selesai"
        : null;

    if (next) {
      const all = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
      const updated = all.map((item: any) =>
        String(item.id) === params.id ? { ...item, status: next } : item
      );
      localStorage.setItem("riwayatSewa", JSON.stringify(updated));
      setData({ ...current, status: next });
    }
  };

  return (
    <>
      {data() ? (
        <div class="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mt-8">
          <h2 class="text-2xl font-bold text-[#3F5B8B] mb-6 text-center">
            {data().name}
          </h2>

          {/* Info Detail */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p class="text-sm text-gray-500">Tanggal Sewa</p>
              <p class="font-semibold text-gray-700">{data().date}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Durasi</p>
              <p class="font-semibold text-gray-700">{data().duration}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Pembayaran</p>
              <p class="font-semibold text-gray-700">{data().price}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status Saat Ini</p>
              <p class="font-semibold text-yellow-600">{data().status}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <div class="flex flex-col items-center">
                <div
                  class={`w-4 h-4 rounded-full mb-2 ${
                    ["Diproses", "Dikirim", "Selesai"].includes(data().status)
                      ? "bg-yellow-400"
                      : "bg-gray-300"
                  }`}
                ></div>
                <span class="text-xs text-center text-gray-600">
                  Pesanan<br />Dikonfirmasi
                </span>
              </div>
              <div class="flex-1 h-1 bg-gray-200 mx-2"></div>
              <div class="flex flex-col items-center">
                <div
                  class={`w-4 h-4 rounded-full mb-2 ${
                    ["Dikirim", "Selesai"].includes(data().status)
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <span class="text-xs text-center text-gray-600">
                  Dalam<br />Perjalanan
                </span>
              </div>
              <div class="flex-1 h-1 bg-gray-200 mx-2"></div>
              <div class="flex flex-col items-center">
                <div
                  class={`w-4 h-4 rounded-full mb-2 ${
                    data().status === "Selesai"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <span class="text-xs text-center text-gray-600">
                  Tiba di<br />Lokasi
                </span>
              </div>
            </div>
          </div>

          {/* Tombol Ubah Status (kalau belum selesai) */}
          {["Diproses", "Dikirim"].includes(data().status) && (
            <div class="text-center mb-6">
              <button
                onClick={updateStatus}
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Ubah status ke{" "}
                {data().status === "Diproses" ? "Dikirim" : "Selesai"}
              </button>
            </div>
          )}

          {/* Tombol Kembali */}
          <div class="text-center">
            <button
              class="bg-[#3F5B8B] text-white px-5 py-2 rounded-md hover:bg-[#2e406b] transition"
              onClick={() => navigate("/riwayat")}
            >
              ← Kembali ke Riwayat
            </button>
          </div>
        </div>
      ) : (
        <div class="text-center text-gray-600 text-sm mt-10">
          Data tidak ditemukan atau belum ada penyewaan.
        </div>
      )}
    </>
  );
}
