import { onMount, onCleanup, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ShoppingCart, Lock, Clock, Eye, BarChart3 } from "lucide-solid";
import AgGridSolid from "ag-grid-solid";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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
    const saved = localStorage.getItem("riwayatSewa");
    const initialData = saved ? JSON.parse(saved) : [];
    
    // Auto-fix data lama yang belum punya id (sama seperti di Riwayat)
    const fixedData = initialData.map((item: any) => ({
      ...item,
      id: item.id ?? generateId()
    }));
    
    localStorage.setItem("riwayatSewa", JSON.stringify(fixedData));
    setRiwayat(fixedData);
    return fixedData;
  };

  onMount(() => {
    const data = loadRiwayatData();

    // Setup Chart
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
  const date = new Date(item.date);
  const monthIndex = date.getMonth();
  if (monthIndex >= 6) {
    chartData[monthIndex - 6].jumlah += 1;
  }
});


    xAxis.data.setAll(chartData);
    series.data.setAll(chartData);
  });

  onCleanup(() => {
    root?.dispose();
  });

  const lastValid = () => riwayat().filter((r) => r.id).at(-1);
  
  // Hitung statistik berdasarkan status
  const getStatusCounts = () => {
    const data = riwayat();
    return {
      diproses: data.filter(r => r.status === "Diproses").length,
      dikirim: data.filter(r => r.status === "Dikirim").length,
      selesai: data.filter(r => r.status === "Selesai").length
    };
  };

  // Handler untuk navigasi ke riwayat
  const goToRiwayat = () => {
    navigate("/riwayat");
  };

  // Handler untuk navigasi ke tracking detail
  const goToTracking = (id: number) => {
    navigate(`/tracking/${id}`);
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

      {/* Tabel Ringkasan - Menampilkan 5 data terakhir */}
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
        
        <div class="ag-theme-alpine overflow-auto" style="height: 300px; width: 100%;">
          <AgGridSolid
            rowData={riwayat().slice(-5).reverse()} // 5 data terakhir, dibalik urutannya
            columnDefs={[
              { headerName: "Nama Barang", field: "name", flex: 1.5 },
              { 
                headerName: "Tanggal", 
                field: "date", 
                flex: 1,
                cellRenderer: (params: any) => {
                  try {
                    const date = new Date(params.value);
                    return date.toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    });
                  } catch {
                    return params.value;
                  }
                }
              },
              { headerName: "Durasi", field: "duration", flex: 0.8 },
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
                      : "bg-green-500";

                  const container = document.createElement("div");
                  const badge = document.createElement("button");
                  badge.className = `px-3 py-1 rounded-full text-white text-xs font-medium ${color} hover:opacity-90 transition duration-150 cursor-pointer`;
                  badge.textContent = status;
                  badge.onclick = () => goToTracking(id);
                  container.appendChild(badge);
                  return container;
                }
              },
            ]}
            defaultColDef={{
              sortable: true,
              filter: false,
              resizable: true,
            }}
            suppressCellFocus={true}
          />
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