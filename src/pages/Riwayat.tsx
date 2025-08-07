import { createSignal, createMemo, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import AgGridSolid from "ag-grid-solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Type definitions
interface RiwayatItem {
  id: number;
  name: string;
  date: string;
  duration: string;
  price: string | number;
  status: "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan";
}

interface CellRendererParams {
  value: any;
  data: RiwayatItem;
}

interface StatusCounts {
  total: number;
  diproses: number;
  dikirim: number;
  selesai: number;
  dibatalkan: number;
}

export default function Riwayat() {
  const navigate = useNavigate();

  // Generate simple sequential ID
  function generateId() {
    const existing = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
    const maxId = existing.length > 0 ? Math.max(...existing.map((item: { id: any; }) => item.id || 0)) : 0;
    return maxId + 1;
  }

  // Initialize data from localStorage
  const initializeData = (): RiwayatItem[] => {
    try {
      const saved = localStorage.getItem("riwayatSewa");
      const initialData: any[] = saved ? JSON.parse(saved) : [];
      
      // Convert long IDs to simple sequential IDs
      return initialData.map((item: any, index: number): RiwayatItem => ({
        id: item.id && item.id < 1000 ? item.id : index + 1, // Use simple ID if current ID is too long
        name: item.name || "",
        date: item.date || "",
        duration: item.duration || "",
        price: item.price || 0,
        status: item.status || "Diproses",
      }));
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      return [];
    }
  };

  const [riwayat, setRiwayat] = createSignal<RiwayatItem[]>([]);
  const [filterStatus, setFilterStatus] = createSignal<string>("Semua");
  const [loading, setLoading] = createSignal<boolean>(true);
  const [searchTerm, setSearchTerm] = createSignal<string>("");

  // Load data on mount
  onMount(() => {
    const data = initializeData();
    setRiwayat(data);
    localStorage.setItem("riwayatSewa", JSON.stringify(data));
    setLoading(false);
  });

  // Filter data based on status and search term
  const filteredData = createMemo((): RiwayatItem[] => {
    let data: RiwayatItem[] = riwayat();
    
    // Filter by status
    if (filterStatus() !== "Semua") {
      data = data.filter((item: RiwayatItem) => item.status === filterStatus());
    }
    
    // Filter by search term
    if (searchTerm().trim()) {
      const term = searchTerm().toLowerCase();
      data = data.filter((item: RiwayatItem) => 
        item.name?.toLowerCase().includes(term) ||
        item.status?.toLowerCase().includes(term)
      );
    }
    
    return data;
  });

  // Delete item with confirmation
  const deleteData = (id: number): void => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const updated = riwayat().filter((item: RiwayatItem) => item.id !== id);
        setRiwayat(updated);
        localStorage.setItem("riwayatSewa", JSON.stringify(updated));
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Gagal menghapus data. Silakan coba lagi.");
      }
    }
  };

  // Navigate to tracking page
  const navigateToTracking = (id: number): void => {
    // Store current tracking data to ensure it's available
    const currentItem = riwayat().find(item => item.id === id);
    if (currentItem) {
      // Store individual tracking data
      localStorage.setItem("currentTracking", JSON.stringify(currentItem));
    }
    navigate(`/tracking/${id}`);
  };

  // Format date range helper
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

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Diproses": return "bg-yellow-500 hover:bg-yellow-600";
      case "Dikirim": return "bg-blue-500 hover:bg-blue-600";
      case "Selesai": return "bg-green-500 hover:bg-green-600";
      case "Dibatalkan": return "bg-red-500 hover:bg-red-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // Column definitions
  const columnDefs = [
    { 
      headerName: "ID", 
      field: "id", 
      flex: 0.5, 
      minWidth: 80,
      cellRenderer: (params: CellRendererParams) => {
        const id = params.value || "-";
        const div = document.createElement("div");
        div.className = "font-mono text-sm text-gray-600 text-center";
        div.textContent = `#${id}`;
        return div;
      }
    },
    { 
      headerName: "Nama Barang", 
      field: "name", 
      flex: 1.2, 
      minWidth: 150,
      cellRenderer: (params: CellRendererParams) => {
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
      cellRenderer: (params: CellRendererParams) => {
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
      cellRenderer: (params: CellRendererParams) => {
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
      flex: 0.8,
      minWidth: 140,
      cellRenderer: (params: CellRendererParams) => {
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
      flex: 1,
      minWidth: 140,
      cellRenderer: (params: CellRendererParams) => {
        const status = params.value || "Tidak diketahui";
        const id = params.data?.id;
        const colorClass = getStatusColor(status);

        const container = document.createElement("div");
        container.className = "flex justify-center";
        
        const badge = document.createElement("button");
        badge.className = `px-4 py-1.5 rounded-full text-white text-xs font-medium transition-all duration-200 ${colorClass} shadow-sm`;
        badge.textContent = status;
        badge.onclick = (e: MouseEvent) => {
          e.preventDefault();
          if (id) navigateToTracking(id);
        };
        
        container.appendChild(badge);
        return container;
      },
    },
    {
      headerName: "Aksi",
      field: "id",
      flex: 0.8,
      minWidth: 120,
      cellRenderer: (params: CellRendererParams) => {
        const container = document.createElement("div");
        container.className = "flex justify-center gap-2";
        
        // Track button
        const trackButton = document.createElement("button");
        trackButton.className = "text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1 rounded transition-all duration-200";
        trackButton.innerHTML = `
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
        `;
        trackButton.title = "Lacak pesanan";
        trackButton.onclick = () => navigateToTracking(params.value);
        
        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-all duration-200";
        deleteButton.innerHTML = `
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        `;
        deleteButton.title = "Hapus data";
        deleteButton.onclick = () => deleteData(params.value);
        
        container.appendChild(trackButton);
        container.appendChild(deleteButton);
        return container;
      },
    },
  ];

  // Count items by status
  const statusCounts = createMemo((): StatusCounts => {
    const counts: StatusCounts = { total: 0, diproses: 0, dikirim: 0, selesai: 0, dibatalkan: 0 };
    riwayat().forEach((item: RiwayatItem) => {
      counts.total++;
      const status = item.status?.toLowerCase();
      if (status === "diproses") counts.diproses++;
      else if (status === "dikirim") counts.dikirim++;
      else if (status === "selesai") counts.selesai++;
      else if (status === "dibatalkan") counts.dibatalkan++;
    });
    return counts;
  });

  return (
    <div class="max-w-7xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div class="bg-gradient-to-r from-[#6C5E82] to-[#8B7CB9] text-white p-6 rounded-2xl shadow-lg mb-6">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold mb-2">📋 Riwayat Pemesanan</h1>
            <p class="text-white/80 text-sm">Kelola dan pantau semua riwayat sewa Anda</p>
          </div>
          
          {/* Status Overview */}
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="bg-white/20 px-3 py-2 rounded-lg text-center">
              <div class="font-bold">{statusCounts().total}</div>
              <div>Total</div>
            </div>
            <div class="bg-yellow-500/30 px-3 py-2 rounded-lg text-center">
              <div class="font-bold">{statusCounts().diproses}</div>
              <div>Diproses</div>
            </div>
            <div class="bg-blue-500/30 px-3 py-2 rounded-lg text-center">
              <div class="font-bold">{statusCounts().dikirim}</div>
              <div>Dikirim</div>
            </div>
            <div class="bg-green-500/30 px-3 py-2 rounded-lg text-center">
              <div class="font-bold">{statusCounts().selesai}</div>
              <div>Selesai</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div class="bg-white p-4 rounded-xl shadow-md mb-6">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div class="flex flex-col sm:flex-row gap-3">
            {/* Status Filter */}
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">Filter Status:</label>
              <select
                class="bg-white border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-[#6C5E82] focus:border-transparent"
                onInput={(e) => setFilterStatus(e.currentTarget.value)}
              >
                <option value="Semua">🔍 Semua</option>
                <option value="Diproses">⏳ Diproses</option>
                <option value="Dikirim">🚚 Dikirim</option>
                <option value="Selesai">✅ Selesai</option>
                <option value="Dibatalkan">❌ Dibatalkan</option>
              </select>
            </div>
            
            {/* Search Input */}
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">Cari:</label>
              <input
                type="text"
                placeholder="Nama barang atau status..."
                class="bg-white border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-[#6C5E82] focus:border-transparent"
                onInput={(e) => setSearchTerm(e.currentTarget.value)}
              />
            </div>
          </div>
          
          <div class="text-sm text-gray-600">
            Menampilkan <span class="font-semibold">{filteredData().length}</span> dari <span class="font-semibold">{riwayat().length}</span> data
          </div>
        </div>
      </div>

      {/* Data Table */}
      {loading() ? (
        <div class="bg-white rounded-xl shadow-md p-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C5E82] mx-auto mb-4"></div>
          <p class="text-gray-600">Memuat data...</p>
        </div>
      ) : filteredData().length === 0 ? (
        <div class="bg-white rounded-xl shadow-md p-8 text-center">
          <div class="text-6xl mb-4">📭</div>
          <h3 class="text-lg font-medium text-gray-800 mb-2">Tidak ada data</h3>
          <p class="text-gray-600">
            {riwayat().length === 0 
              ? "Belum ada riwayat pemesanan." 
              : "Tidak ada data yang sesuai dengan filter yang dipilih."
            }
          </p>
        </div>
      ) : (
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="ag-theme-alpine" style={{ width: "100%", height: "600px" }}>
            <AgGridSolid
              rowData={filteredData()}
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

      {/* Footer Info */}
      <div class="mt-6 text-center text-sm text-gray-500">
        💡 Tip: Klik pada status atau tombol lacak untuk melihat detail tracking, atau gunakan filter untuk mencari data tertentu
      </div>
    </div>
  );
}