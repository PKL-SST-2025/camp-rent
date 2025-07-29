import { createSignal, createMemo, onMount, onCleanup } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import { Trash2 } from "lucide-solid";
import { A } from "@solidjs/router";
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

        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
          <a href="/tracking/${id}" class="px-3 py-1 rounded-full text-white text-xs font-medium ${color} hover:opacity-90 transition duration-150 cursor-pointer">
            ${status}
          </a>
        `;
        container.appendChild(wrapper.firstChild as HTMLElement);
        return container;
      },
    },
    {
      headerName: "Aksi",
      field: "id",
      flex: 0.5,
      minWidth: 90,
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
    <div class="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div class="bg-[#6C5E82] text-white p-6 rounded-2xl shadow mb-6 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <h2 class="text-xl font-semibold">Riwayat Pemesanan</h2>
        <div class="flex flex-wrap gap-3">
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
    </div>
  );
}
