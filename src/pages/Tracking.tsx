import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, createMemo, onMount } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Tracking() {
  const params = useParams();
  const navigate = useNavigate();
  const [riwayat, setRiwayat] = createSignal<any[]>([]);
  const [data, setData] = createSignal<any>(null);

  // Ambil data dari localStorage saat mount
  onMount(() => {
    const all = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
    setRiwayat(all);

    // Kalau ada params.id berarti mode detail
    if (params.id) {
      const found = all.find((item: any) => String(item.id) === params.id);
      setData(found);
    }
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
      const updated = riwayat().map((item: any) =>
        String(item.id) === params.id ? { ...item, status: nextStatus } : item
      );

      localStorage.setItem("riwayatSewa", JSON.stringify(updated));
      setRiwayat(updated);
      setData({ ...current, status: nextStatus });
    }
  };

  // Mode LIST Tracking
  if (!params.id) {
    const columnDefs = [
      { headerName: "Nama Barang", field: "name", flex: 1, minWidth: 130 },
      {
        headerName: "Tanggal Sewa",
        field: "date",
        flex: 1,
        minWidth: 180,
        cellRenderer: (params: any) => {
          try {
            const start = new Date(params.value);
            const duration = parseInt(params.data?.duration);
            if (isNaN(start.getTime()) || isNaN(duration)) return params.value;

            const end = new Date(start);
            end.setDate(start.getDate() + duration);

            const formatter = new Intl.DateTimeFormat("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });

            return `${formatter.format(start)} - ${formatter.format(end)}`;
          } catch {
            return params.value;
          }
        },
      },
      { headerName: "Durasi", field: "duration", flex: 0.7, minWidth: 100 },
      { headerName: "Total", field: "price", flex: 1, minWidth: 130 },
      {
        headerName: "Status",
        field: "status",
        flex: 1,
        minWidth: 140,
        cellRenderer: (params: any) => {
          const status = params.value;
          const id = params.data?.id;

          const color =
            status === "Diproses"
              ? "bg-yellow-400"
              : status === "Dikirim"
              ? "bg-blue-400"
              : "bg-green-500";

          const container = document.createElement("div");
          container.className = "flex flex-col items-start gap-1";

          const badge = document.createElement("a");
          badge.href = `/tracking/${id}`;
          badge.className = `px-3 py-1 rounded-full text-white text-xs font-medium ${color} hover:opacity-90 transition duration-150 cursor-pointer`;
          badge.textContent = status;
          container.appendChild(badge);

          return container;
        },
      },
    ];

    return (
      <div class="max-w-6xl mx-auto px-4">
        <div class="bg-[#6C5E82] text-white p-6 rounded-2xl shadow mb-6">
          <h2 class="text-xl font-semibold">Tracking Pesanan</h2>
        </div>

        <div class="overflow-x-auto rounded-xl shadow">
          <div
            class="ag-theme-alpine min-w-[700px]"
            style={{
              height: "auto",
              width: "100%",
              background: "#96AAC5",
              padding: "1rem",
              "border-radius": "1rem",
              "box-shadow": "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <AgGridSolid
              rowData={riwayat()}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              suppressCellFocus={true}
              defaultColDef={{
                resizable: true,
                sortable: true,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Mode DETAIL Tracking
  return data() ? (
    <div class="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mt-8">
      <h2 class="text-2xl font-bold text-[#3F5B8B] mb-6 text-center">
        {data().name}
      </h2>

      {/* Info Detail */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Detail label="Tanggal Sewa" value={data().date} />
        <Detail label="Durasi" value={data().duration} />
        <Detail label="Total Pembayaran" value={data().price} />
        <Detail
          label="Status Saat Ini"
          value={data().status}
          color="text-yellow-600"
        />
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
          onClick={() => navigate("/tracking")}
          class="bg-[#3F5B8B] text-white px-5 py-2 rounded-md hover:bg-[#2e406b] transition"
        >
          ← Kembali ke Daftar Tracking
        </button>
      </div>
    </div>
  ) : (
    <div class="text-center text-gray-600 text-sm mt-10">
      Data tidak ditemukan atau belum ada penyewaan.
    </div>
  );
}

// Komponen Detail Info
function Detail(props: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p class="text-sm text-gray-500">{props.label}</p>
      <p class={`font-semibold text-gray-700 ${props.color || ""}`}>
        {props.value}
      </p>
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
          label="Pesanan Dikonfirmasi"
          color="bg-yellow-400"
        />
        <Line />
        <Step
          active={["Dikirim", "Selesai"].includes(status)}
          label="Dalam Perjalanan"
          color="bg-blue-500"
        />
        <Line />
        <Step
          active={status === "Selesai"}
          label="Tiba di Lokasi"
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
