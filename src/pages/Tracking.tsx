import { createSignal, onMount, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import AgGridSolid from "ag-grid-solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Tracking() {
  const params = useParams();
  const navigate = useNavigate();

  const [riwayat, setRiwayat] = createSignal<any[]>([]);
  const [data, setData] = createSignal<any>(null);
  const [isLoading, setIsLoading] = createSignal(true);

  const loadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const saved = localStorage.getItem("riwayatSewa");
        console.log("Raw localStorage data:", saved); // Debug log
        const all = saved ? JSON.parse(saved) : [];
        console.log("Parsed data:", all); // Debug log
        console.log("Current params.id:", params.id); // Debug log
        
        setRiwayat(all);
        
        if (params.id) {
          const found = all.find((item: any) => {
            console.log(`Comparing ${item.id} with ${params.id}`); // Debug log
            return String(item.id) === String(params.id);
          });
          console.log("Found item:", found); // Debug log
          setData(found || null);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setRiwayat([]);
        setData(null);
      }
      setIsLoading(false);
    }, 200);
  };

  onMount(() => {
    loadData();
  });

  // Format date helper
  const formatDateRange = (dateString: string, duration: string): string => {
    if (!dateString) return "-";
    
    try {
      const start = new Date(dateString);
      if (isNaN(start.getTime())) return "-";
      
      const durationNum = parseInt(String(duration).replace(/\D/g, "")) || 0;
      const formatter = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      
      if (durationNum > 0) {
        const end = new Date(start);
        end.setDate(start.getDate() + durationNum);
        return `${formatter.format(start)} - ${formatter.format(end)}`;
      }
      
      return formatter.format(start);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  // Format price helper
  const formatPrice = (price: string | number): string => {
    try {
      const num = typeof price === 'string' ? parseFloat(price.replace(/[^\d]/g, '')) : Number(price);
      if (isNaN(num) || num <= 0) return "Rp 0";
      return `Rp ${num.toLocaleString("id-ID")}`;
    } catch (error) {
      console.error("Error formatting price:", error);
      return "Rp 0";
    }
  };

  // Update status
  const updateStatus = () => {
    if (!data()) return;
    const current = data();
    const nextStatus =
      current.status === "Diproses"
        ? "Dikirim"
        : current.status === "Dikirim"
        ? "Selesai"
        : null;

    if (nextStatus) {
      const updated = riwayat().map((item) =>
        String(item.id) === String(params.id) ? { ...item, status: nextStatus } : item
      );
      localStorage.setItem("riwayatSewa", JSON.stringify(updated));
      setRiwayat(updated);
      setData({ ...current, status: nextStatus });
      // Reload data to refresh
      loadData();
    }
  };

  // Column definitions for the table
  const columnDefs = [
    { 
      headerName: "Nama Barang", 
      field: "name", 
      flex: 1.2, 
      minWidth: 150,
      cellRenderer: (params: any) => {
        const name = params.value || "Tidak ada nama";
        const div = document.createElement("div");
        div.className = "font-medium text-gray-800";
        div.textContent = name;
        return div;
      }
    },
    {
      headerName: "Tanggal Sewa",
      field: "date",
      flex: 1.5,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const formatted = formatDateRange(params.value, params.data?.duration || "");
        const div = document.createElement("div");
        div.className = "text-sm text-gray-700";
        div.textContent = formatted;
        return div;
      },
    },
    { 
      headerName: "Durasi", 
      field: "duration", 
      flex: 0.8, 
      minWidth: 100,
      cellRenderer: (params: any) => {
        const duration = params.value || "-";
        const div = document.createElement("div");
        div.className = "text-center font-medium";
        div.textContent = duration;
        return div;
      }
    },
    {
      headerName: "Total Harga",
      field: "price",
      flex: 1,
      minWidth: 140,
      cellRenderer: (params: any) => {
        const formatted = formatPrice(params.value);
        const div = document.createElement("div");
        div.className = "font-semibold text-green-700";
        div.textContent = formatted;
        return div;
      },
    },
    {
      headerName: "Status",
      field: "status",
      flex: 0.8,
      minWidth: 140,
      cellRenderer: (params: any) => {
        const status = params.value || "Tidak diketahui";
        const id = params.data?.id;
        
        const getStatusColor = (status: string): string => {
          switch (status) {
            case "Diproses": return "bg-yellow-500 hover:bg-yellow-600";
            case "Dikirim": return "bg-blue-500 hover:bg-blue-600";
            case "Selesai": return "bg-green-500 hover:bg-green-600";
            case "Dibatalkan": return "bg-red-500 hover:bg-red-600";
            default: return "bg-gray-500 hover:bg-gray-600";
          }
        };

        const colorClass = getStatusColor(status);
        const container = document.createElement("div");
        container.className = "flex justify-center";
        
        const badge = document.createElement("button");
        badge.className = `px-4 py-1.5 rounded-full text-white text-xs font-medium transition-all duration-200 ${colorClass} shadow-sm`;
        badge.textContent = status;
        badge.onclick = (e: MouseEvent) => {
          e.preventDefault();
          if (id) navigate(`/tracking/${id}`);
        };
        
        container.appendChild(badge);
        return container;
      },
    },
  ];

  return (
    <Show when={!isLoading()} fallback={
      <div class="flex justify-center items-center min-h-[400px]">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C5E82] mx-auto mb-4"></div>
          <p class="text-gray-600">Memuat data tracking...</p>
        </div>
      </div>
    }>
      {!params.id ? (
        <div class="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div class="bg-gradient-to-r from-[#6C5E82] to-[#8B7CB9] text-white p-6 rounded-2xl shadow-lg mb-6">
            <h1 class="text-2xl font-bold mb-2">Tracking Pesanan</h1>
            <p class="text-white/80 text-sm">Pantau status dan progres pesanan Anda secara real-time</p>
          </div>

          {/* Table */}
          {riwayat().length === 0 ? (
            <div class="bg-white rounded-xl shadow-md p-8 text-center">
              <div class="text-6xl mb-4">📭</div>
              <h3 class="text-lg font-medium text-gray-800 mb-2">Tidak ada data tracking</h3>
              <p class="text-gray-600 mb-6">Belum ada pesanan yang dapat dilacak.</p>
              <button
                onClick={() => navigate("/riwayat")}
                class="bg-[#6C5E82] text-white px-6 py-3 rounded-lg hover:bg-[#5a4d6b] transition-colors font-medium"
              >
                ← Lihat Riwayat Pesanan
              </button>
            </div>
          ) : (
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
              <div class="ag-theme-alpine" style={{ width: "100%", height: "600px" }}>
                <AgGridSolid
                  rowData={riwayat()}
                  columnDefs={columnDefs}
                  domLayout="normal"
                  suppressCellFocus={true}
                  rowHeight={60}
                  headerHeight={50}
                  animateRows={true}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    flex: 1,
                    minWidth: 100,
                    cellStyle: { display: "flex", alignItems: "center" },
                  }}
                  getRowStyle={(params) => ({
                    backgroundColor: params.rowIndex % 2 === 0 ? "#f9fafb" : "#ffffff",
                  })}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div class="max-w-4xl mx-auto px-4 py-6">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            {data() ? (
              <>
                <div class="text-center mb-8">
                  <h1 class="text-3xl font-bold text-[#6C5E82] mb-2">{data().name}</h1>
                  <p class="text-gray-600">Detail Tracking Pesanan #{params.id}</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <Detail label="Tanggal Sewa" value={formatDateRange(data().date, data().duration)} />
                  <Detail label="Durasi" value={data().duration} />
                  <Detail label="Total Pembayaran" value={formatPrice(data().price)} />
                  <Detail label="Status Saat Ini" value={data().status} color="text-blue-600" />
                </div>
                
                <ProgressBar status={data().status} />
                
                {["Diproses", "Dikirim"].includes(data().status) && (
                  <div class="text-center mb-6">
                    <button
                      onClick={updateStatus}
                      class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-md mr-4"
                    >
                      Ubah status ke {data().status === "Diproses" ? "Dikirim" : "Selesai"}
                    </button>
                    <p class="text-sm text-gray-500 mt-2">
                      Klik untuk memperbarui status pesanan
                    </p>
                  </div>
                )}
                
                <div class="text-center">
                  <button
                    onClick={() => navigate("/riwayat")}
                    class="bg-[#6C5E82] text-white px-6 py-3 rounded-lg hover:bg-[#5a4d6b] transition-colors font-medium shadow-md"
                  >
                    ← Kembali ke Riwayat
                  </button>
                </div>
              </>
            ) : (
              <div class="text-center py-12">
                <div class="text-6xl mb-4">❌</div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">Data tidak ditemukan</h3>
                <p class="text-gray-600 mb-6">Pesanan dengan ID "{params.id}" tidak ditemukan dalam sistem.</p>
                <div class="space-y-3">
                  <p class="text-sm text-gray-500">Kemungkinan penyebab:</p>
                  <ul class="text-sm text-gray-500 space-y-1">
                    <li>• ID pesanan tidak valid</li>
                    <li>• Data telah dihapus dari sistem</li>
                    <li>• Terjadi kesalahan saat memuat data</li>
                  </ul>
                </div>
                <div class="text-center mt-8">
                  <button
                    onClick={() => navigate("/riwayat")}
                    class="bg-[#6C5E82] text-white px-6 py-3 rounded-lg hover:bg-[#5a4d6b] transition-colors font-medium"
                  >
                    ← Kembali ke Riwayat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Show>
  );
}

function Detail(props: { label: string; value: string; color?: string }) {
  return (
    <div class="bg-gray-50 p-4 rounded-lg">
      <p class="text-sm text-gray-500 mb-1">{props.label}</p>
      <p class={`font-semibold text-lg ${props.color || "text-gray-700"}`}>{props.value}</p>
    </div>
  );
}

function ProgressBar(props: { status: string }) {
  const { status } = props;
  return (
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <Step active={["Diproses", "Dikirim", "Selesai"].includes(status)} label="Pesanan Dikonfirmasi" color="bg-yellow-500" />
        <Line active={["Dikirim", "Selesai"].includes(status)} />
        <Step active={["Dikirim", "Selesai"].includes(status)} label="Dalam Perjalanan" color="bg-blue-500" />
        <Line active={status === "Selesai"} />
        <Step active={status === "Selesai"} label="Tiba di Lokasi" color="bg-green-500" />
      </div>
    </div>
  );
}

function Step(props: { active: boolean; label: string; color: string }) {
  return (
    <div class="flex flex-col items-center text-center">
      <div class={`w-6 h-6 rounded-full mb-3 flex items-center justify-center ${props.active ? props.color : "bg-gray-300"}`}>
        {props.active && (
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        )}
      </div>
      <span class="text-xs text-gray-600 font-medium max-w-20">{props.label}</span>
    </div>
  );
}

function Line(props: { active: boolean }) {
  return (
    <div class={`flex-1 h-1 mx-4 rounded-full ${props.active ? "bg-blue-400" : "bg-gray-200"}`}></div>
  );
}