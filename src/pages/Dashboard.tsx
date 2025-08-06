import { onMount, onCleanup, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ShoppingCart, Lock, Clock, Eye, BarChart3 } from "lucide-solid";

// Hapus AgGrid sementara untuk menghindari error
// import AgGridSolid from "ag-grid-solid";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

type RiwayatItem = {
  id?: number;
  name: string;
  date: string;
  duration: string;
  price: string;
  status: string;
  statusColor?: string;
};

export default function DashboardInventaris() {
  const navigate = useNavigate();
  let root: am5.Root;
  const [riwayat, setRiwayat] = createSignal<RiwayatItem[]>([]);

  // Fungsi untuk generate ID jika belum ada
  function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // Fungsi untuk load dan fix data
  const loadRiwayatData = () => {
    try {
      console.log("Loading riwayat data from localStorage...");
      const saved = localStorage.getItem("riwayatSewa");
      console.log("Raw localStorage data:", saved);
      
      const initialData = saved ? JSON.parse(saved) : [];
      console.log("Parsed initial data:", initialData);
      
      // Auto-fix data lama yang belum punya id
      const fixedData = initialData.map((item: any) => ({
        ...item,
        id: item.id ?? generateId()
      }));
      
      console.log("Fixed data with IDs:", fixedData);
      localStorage.setItem("riwayatSewa", JSON.stringify(fixedData));
      setRiwayat(fixedData);
      return fixedData;
    } catch (error) {
      console.error("Error loading data:", error);
      return [];
    }
  };

  onMount(() => {
    console.log("Dashboard mounted, loading data...");
    const data = loadRiwayatData();
    console.log("Loaded data:", data);

    // Setup Chart
    try {
      root = am5.Root.new("chartdiv");

      const myTheme = am5.Theme.new(root);
      myTheme.rule("Label", []).setAll({ fill: am5.color(0x3F5B8B), fontSize: 14 });
      myTheme.rule("Grid", []).setAll({ stroke: am5.color(0xE3ECF7) });
      myTheme.rule("AxisLabel", []).setAll({ fill: am5.color(0x6C5E82), fontSize: 12 });

      root.setThemes([am5themes_Animated.new(root), myTheme]);

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          layout: root.verticalLayout,
        })
      );

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "bulan",
          renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 }),
        })
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );

      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Penyewaan",
          xAxis,
          yAxis,
          valueYField: "jumlah",
          categoryXField: "bulan",
        })
      );

      series.columns.template.setAll({
        fill: am5.color(0x3F5B8B),
        stroke: am5.color(0x3F5B8B),
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
      });

      const months = ["Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      const chartData = months.map((bulan) => ({ bulan, jumlah: 0 }));

      data.forEach((item: RiwayatItem) => {
        try {
          const date = new Date(item.date);
          const monthIndex = date.getMonth();
          if (monthIndex >= 6 && monthIndex <= 11) {
            chartData[monthIndex - 6].jumlah += 1;
          }
        } catch (error) {
          console.error("Error parsing date:", item.date);
        }
      });

      xAxis.data.setAll(chartData);
      series.data.setAll(chartData);
    } catch (error) {
      console.error("Error setting up chart:", error);
    }
  });

  onCleanup(() => {
    if (root) {
      root.dispose();
    }
  });

  // Hitung statistik berdasarkan status
  const getStatusCounts = () => {
    const data = riwayat();
    console.log("Calculating status counts for data:", data);
    
    const counts = {
      diproses: data.filter(r => r.status === "Diproses").length,
      dikirim: data.filter(r => r.status === "Dikirim").length,
      selesai: data.filter(r => r.status === "Selesai").length
    };
    
    console.log("Status counts:", counts);
    console.log("All statuses:", data.map(r => r.status));
    
    return counts;
  };

  // Handler untuk navigasi ke riwayat
  const goToRiwayat = () => {
    navigate("/riwayat");
  };

  // Handler untuk navigasi ke tracking detail
  const goToTracking = (id: number) => {
    navigate(`/tracking/${id}`);
  };

  // Format date untuk display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diproses": return "bg-yellow-400";
      case "Dikirim": return "bg-blue-400";
      case "Selesai": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const statusCounts = getStatusCounts();

  return (
    <>
      {/* Header dengan Tombol Navigasi */}
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-[#3F5B8B]">Dashboard Inventaris</h1>
        <button
          onClick={goToRiwayat}
          class="bg-[#6C5E82] hover:bg-[#5A4D73] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
        >
          <Eye size={16} />
          Lihat Riwayat Lengkap
        </button>
      </div>

      {/* Debug Info & Test Data Button */}
      <div class="mb-4 p-4 bg-blue-50 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <p class="text-sm text-blue-800">Debug: Total data di localStorage: {riwayat().length}</p>
          <button
            onClick={() => {
              // Test data untuk debugging
              const testData = [
                {
                  id: generateId(),
                  name: "Tenda Camping",
                  date: "2024-12-01",
                  duration: "3 hari",
                  price: "150000",
                  status: "Diproses"
                },
                {
                  id: generateId(),
                  name: "Sleeping Bag",
                  date: "2024-11-15", 
                  duration: "2 hari",
                  price: "75000",
                  status: "Selesai"
                },
                {
                  id: generateId(),
                  name: "Backpack",
                  date: "2024-12-05", 
                  duration: "5 hari",
                  price: "100000",
                  status: "Dikirim"
                }
              ];
              localStorage.setItem("riwayatSewa", JSON.stringify(testData));
              setRiwayat(testData);
              console.log("Test data added:", testData);
            }}
            class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Add Test Data
          </button>
        </div>
        {riwayat().length > 0 && (
          <p class="text-xs text-blue-600">Sample data: {JSON.stringify(riwayat()[0])}</p>
        )}
      </div>

      {/* Statistik Cards */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        {[
          {
            icon: <ShoppingCart class="mx-auto mb-3 text-[#D0797F]" size={32} />,
            title: "Total Sewa",
            value: riwayat().length,
            subtitle: "Semua pesanan",
          },
          {
            icon: <Clock class="mx-auto mb-3 text-[#F4B942]" size={32} />,
            title: "Diproses",
            value: statusCounts.diproses,
            subtitle: `${statusCounts.diproses} pesanan`,
          },
          {
            icon: <Lock class="mx-auto mb-3 text-[#3B7DA6]" size={32} />,
            title: "Dikirim",
            value: statusCounts.dikirim,
            subtitle: `${statusCounts.dikirim} pesanan`,
          },
          {
            icon: <BarChart3 class="mx-auto mb-3 text-[#4ADE80]" size={32} />,
            title: "Selesai",
            value: statusCounts.selesai,
            subtitle: `${statusCounts.selesai} pesanan`,
          },
        ].map(({ icon, title, value, subtitle }) => (
          <div class="bg-white shadow rounded-lg p-5 text-center hover:shadow-xl transition duration-300 transform hover:scale-105">
            {icon}
            <p class="text-sm text-[#7A7A8B]">{title}</p>
            <p class="text-2xl font-bold text-[#2E365A]">{value}</p>
            <p class="text-xs text-[#A0A0A0]">{subtitle}</p>
          </div>
        ))}
      </div>

      {/* Grafik Chart */}
      <div class="bg-white shadow rounded-lg p-6 mb-6 animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-[#3F5B8B]">Grafik Penyewaan Bulanan</h3>
          <span class="text-sm text-[#7A7A8B]">Juli - Desember 2024</span>
        </div>
        <div id="chartdiv" class="w-full" style={{ height: "300px" }} />
      </div>

      {/* Tabel Ringkasan - Native Table instead of AgGrid */}
      <div class="bg-white shadow rounded-lg p-6 animate-fade-in">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-[#3F5B8B]">Pesanan Terbaru</h3>
          <button
            onClick={goToRiwayat}
            class="text-[#6C5E82] hover:text-[#5A4D73] text-sm font-medium flex items-center gap-1"
          >
            Lihat Semua <Eye size={14} />
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full table-auto">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Nama Barang</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Tanggal</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Durasi</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Harga</th>
                <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {riwayat().length === 0 ? (
                <tr>
                  <td colSpan={5} class="px-4 py-8 text-center text-gray-500">
                    Belum ada data pesanan
                  </td>
                </tr>
              ) : (
                riwayat().slice(-5).reverse().map((item, index) => (
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                    <td class="px-4 py-2 text-sm text-gray-600">{formatDate(item.date)}</td>
                    <td class="px-4 py-2 text-sm text-gray-600">{item.duration}</td>
                    <td class="px-4 py-2 text-sm text-gray-600">Rp {parseInt(item.price || '0').toLocaleString('id-ID')}</td>
                    <td class="px-4 py-2">
                      <button
                        onClick={() => item.id && goToTracking(item.id)}
                        class={`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusColor(item.status)} hover:opacity-90 transition duration-150 cursor-pointer`}
                      >
                        {item.status}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS Animasi */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-in-out;
          }
        `}
      </style>
    </>
  );
}