import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export default function Tracking() {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = createSignal<any>(null);

  // Ambil data dari localStorage saat mount
  onMount(() => {
    const all = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
    const found = all.find((item: any) => String(item.id) === params.id);
    setData(found);
  });

  // Fungsi update status
  const updateStatus = () => {
    const current = data();
    if (!current) return;

    const nextStatus =
      current.status === "Diproses"
        ? "Dikirim"
        : current.status === "Dikirim"
        ? "Selesai"
        : null;

    if (nextStatus) {
      const all = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
      const updated = all.map((item: any) =>
        String(item.id) === params.id ? { ...item, status: nextStatus } : item
      );

      localStorage.setItem("riwayatSewa", JSON.stringify(updated));
      setData({ ...current, status: nextStatus });

      // Optional: trigger sinkronisasi ke Riwayat (kalau pakai event listener)
      window.dispatchEvent(new Event("storage"));
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
            <Detail label="Tanggal Sewa" value={data().date} />
            <Detail label="Durasi" value={data().duration} />
            <Detail label="Total Pembayaran" value={data().price} />
            <Detail label="Status Saat Ini" value={data().status} color="text-yellow-600" />
          </div>

          {/* Progress Bar */}
          <ProgressBar status={data().status} />

          {/* Tombol Ubah Status */}
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
              onClick={() => navigate("/riwayat")}
              class="bg-[#3F5B8B] text-white px-5 py-2 rounded-md hover:bg-[#2e406b] transition"
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

// Komponen Detail Info
function Detail(props: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p class="text-sm text-gray-500">{props.label}</p>
      <p class={`font-semibold text-gray-700 ${props.color || ""}`}>{props.value}</p>
    </div>
  );
}

// Komponen ProgressBar
function ProgressBar(props: { status: string }) {
  const { status } = props;

  return (
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <Step
          active={["Diproses", "Dikirim", "Selesai"].includes(status)}
          label="Pesanan\nDikonfirmasi"
          color="bg-yellow-400"
        />
        <Line />
        <Step
          active={["Dikirim", "Selesai"].includes(status)}
          label="Dalam\nPerjalanan"
          color="bg-blue-500"
        />
        <Line />
        <Step
          active={status === "Selesai"}
          label="Tiba di\nLokasi"
          color="bg-green-500"
        />
      </div>
    </div>
  );
}

function Step(props: { active: boolean; label: string; color: string }) {
  return (
    <div class="flex flex-col items-center">
      <div
        class={`w-4 h-4 rounded-full mb-2 ${
          props.active ? props.color : "bg-gray-300"
        }`}
      ></div>
      <span class="text-xs text-center text-gray-600 whitespace-pre-line">
        {props.label}
      </span>
    </div>
  );
}

function Line() {
  return <div class="flex-1 h-1 bg-gray-200 mx-2"></div>;
}
