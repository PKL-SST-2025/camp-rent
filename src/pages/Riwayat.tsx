import { createSignal, createMemo, onMount, onCleanup } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import { Trash2 } from "lucide-solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Riwayat() {
  const saved = localStorage.getItem("riwayatSewa");
  const initialData = saved ? JSON.parse(saved) : [];

  const [riwayat, setRiwayat] = createSignal(initialData);
  const [filterStatus, setFilterStatus] = createSignal("Semua");

  const filtered = createMemo(() =>
    filterStatus() === "Semua"
      ? riwayat()
      : riwayat().filter((item: any) => item.status === filterStatus())
  );

  const columnDefs = [
    { headerName: "Nama Barang", field: "name", flex: 1 },
    {
  headerName: "Tanggal Sewa",
  field: "date",
  flex: 1,
  cellRenderer: (params: any) => {
    try {
      const startDateStr = params.value; // contoh: "2025-07-10"
      const durationText = params.data?.duration; // contoh: "3 Hari"
      const start = new Date(startDateStr);
      const duration = parseInt(durationText); // ambil angka dari "3 Hari"
      
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

    { headerName: "Durasi", field: "duration", flex: 1 },
    { headerName: "Total", field: "price", flex: 1 },
    {
  headerName: "Status",
  field: "status",
  flex: 1,
  cellRenderer: (params: any) => {
    const status = params.value;
    const id = params.data?.id;
    const color =
      status === "Diproses"
        ? "bg-yellow-400"
        : status === "Dikirim"
        ? "bg-blue-400"
        : "bg-green-400";

    const link = document.createElement("a");
    link.href = `/tracking/${id}`;
    link.className = `px-3 py-1 rounded-full text-white text-xs font-medium ${color} hover:underline`;
    link.textContent = status;

    return link;
  },
},

    {
      headerName: "Aksi",
      field: "id",
      flex: 0.5,
      cellRenderer: (params: any) => {
        const button = document.createElement("button");
        button.setAttribute("data-id", params.value);
        button.className =
          "text-[#D0797F] hover:text-red-600 text-lg font-bold cursor-pointer";
        button.textContent = "🗑️";
        return button;
      },
    },
  ];

  const handleDeleteClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const id = target.getAttribute("data-id");
    if (id) {
      const updated = riwayat().filter((item: any) => item.id !== Number(id));
      setRiwayat(updated);
      localStorage.setItem("riwayatSewa", JSON.stringify(updated));
    }
  };

  onMount(() => {
    document.addEventListener("click", handleDeleteClick);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleDeleteClick);
  });

  const hapusSemua = () => {
    if (confirm("Yakin hapus semua riwayat?")) {
      setRiwayat([]);
      localStorage.removeItem("riwayatSewa");
    }
  };

  return (
    <>
      <div class="max-w-6xl mx-auto">
        {/* Header */}
        <div class="bg-[#6C5E82] text-white p-6 rounded-2xl shadow mb-6 flex justify-between items-center">
          <h2 class="text-xl font-semibold">Riwayat Pemesanan</h2>
          <div class="flex items-center gap-3">
            <select
              class="bg-white text-[#3F5B8B] text-sm px-3 py-1 rounded shadow outline-none"
              onInput={(e) => setFilterStatus(e.currentTarget.value)}
            >
              <option value="Semua">Semua</option>
              <option value="Diproses">Diproses</option>
              <option value="Dikirim">Dikirim</option>
              <option value="Selesai">Selesai</option>
            </select>
            <button
              class="bg-[#D0797F] hover:bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1 shadow"
              onClick={hapusSemua}
            >
              <Trash2 size={16} />
              Hapus Semua
            </button>
          </div>
        </div>

        {/* AG Grid Table */}
        <div
          class="ag-theme-alpine"
          style={{
            height: "400px",
            width: "100%",
            background: "#96AAC5",
            padding: "1rem",
            "border-radius": "1rem",
            "box-shadow": "0 4px 20px rgba(0,0,0,0.1)",
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
            }}
          />
        </div>
      </div>
    </>
  );
}
