import { createSignal, createMemo, onMount } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import AgGridSolid from "ag-grid-solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Tracking() {
  const params = useParams();
  const navigate = useNavigate();
  const [riwayat, setRiwayat] = createSignal<any[]>([]);
  const [filterStatus, setFilterStatus] = createSignal("Semua");
  const [data, setData] = createSignal<any>(null);

  // Ambil data saat mount
  onMount(() => {
    const all = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
    setRiwayat(all);

    if (params.id) {
      const found = all.find((item: any) => String(item.id) === params.id);
      setData(found || null);
    }
  });

  // Filter list tracking
  const filtered = createMemo(() =>
    filterStatus() === "Semua"
      ? riwayat()
      : riwayat().filter((item: any) => item.status === filterStatus())
  );

  // Ubah status pesanan
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
      const all = riwayat().map((item) =>
        String(item.id) === params.id ? { ...item, status: next } : item
      );
      localStorage.setItem("riwayatSewa", JSON.stringify(all));
      setRiwayat(all);
      setData({ ...current, status: next });

      if (next === "Selesai") navigate("/riwayat");
    }
  };

  // Kolom tabel list tracking
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
        const badge = document.createElement("a");
        badge.href = `/tracking/${id}`;
        badge.className = `px-3 py-1 rounded-full text-white text-xs font-medium ${color} hover:opacity-90 transition duration-150 cursor-pointer`;
        badge.textContent = status;
        return badge;
      },
    },
  ];

  // Mode detail atau list
  if (params.id && data()) {
    return (
      <div class="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto mt-8">
        <h2 class="text-2xl font-bold text-[#3F5B8B] mb-6 text-center">
          {data().name}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Detail label="Tanggal Sewa" value={data().date} />
          <Detail label="Durasi" value={data().duration} />
          <Detail label="Total Pembayaran" value={data().price} />
          <Detail label="Status Saat Ini" value={data().status} color="text-yellow-600" />
        </div>
        <ProgressBar status={data().status} />
        {["Diproses", "Dikirim"].includes(data().status) && (
          <div class="text-center mb-6">
            <button
              onClick={updateStatus}
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Ubah status ke {data().status === "Diproses" ? "Dikirim" : "Selesai"}
            </button>
          </div>
        )}
        <div class="text-center">
          <button
            onClick={() => navigate("/tracking")}
            class="bg-[#3F5B8B] text-white px-5 py-2 rounded-md hover:bg-[#2e406b] transition"
          >
            ← Kembali ke Tracking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="max-w-6xl mx-auto px-4">
      <div class="bg-[#6C5E82] text-white p-6 rounded-2xl shadow mb-6 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <h2 class="text-xl font-semibold">Tracking Pemesanan</h2>
        <select
          class="bg-white text-[#3F5B8B] text-sm px-3 py-1 rounded shadow outline-none"
          onInput={(e) => setFilterStatus(e.currentTarget.value)}
        >
          <option value="Semua">Semua</option>
          <option value="Diproses">Diproses</option>
          <option value="Dikirim">Dikirim</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>
      <div class="overflow-x-auto rounded-xl shadow">
        <div
          class="ag-theme-alpine"
          style={{
            width: "100%",
            background: "#96AAC5",
            padding: "1rem",
            "border-radius": "1rem",
          }}
        >
          <AgGridSolid
            rowData={filtered()}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            suppressCellFocus={true}
            defaultColDef={{
              resizable: true,
              sortable: true,
              flex: 1,
              minWidth: 100,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Detail(props: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p class="text-sm text-gray-500">{props.label}</p>
      <p class={`font-semibold text-gray-700 ${props.color || ""}`}>{props.value}</p>
    </div>
  );
}

function ProgressBar(props: { status: string }) {
  const { status } = props;
  return (
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <Step active={["Diproses", "Dikirim", "Selesai"].includes(status)} label="Pesanan Dikonfirmasi" color="bg-yellow-400" />
        <Line />
        <Step active={["Dikirim", "Selesai"].includes(status)} label="Dalam Perjalanan" color="bg-blue-500" />
        <Line />
        <Step active={status === "Selesai"} label="Tiba di Lokasi" color="bg-green-500" />
      </div>
    </div>
  );
}

function Step(props: { active: boolean; label: string; color: string }) {
  return (
    <div class="flex flex-col items-center">
      <div class={`w-4 h-4 rounded-full mb-2 ${props.active ? props.color : "bg-gray-300"}`}></div>
      <span class="text-xs text-center text-gray-600 whitespace-pre-line">{props.label}</span>
    </div>
  );
}

function Line() {
  return <div class="flex-1 h-1 bg-gray-200 mx-2"></div>;
}
