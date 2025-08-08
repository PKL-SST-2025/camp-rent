import { onMount, onCleanup, createSignal, createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ShoppingCart, Lock, Clock, Eye, BarChart3, TrendingUp, Package } from "lucide-solid";
import { formatDateRange, formatPrice } from "./formatters";

// Alternative: Custom responsive table instead of AG Grid
// Remove AG Grid imports since they're causing issues

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
  const [isLoaded, setIsLoaded] = createSignal(false);

  // Generate ID unik
  function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // Load data dari localStorage & perbaiki ID
  const loadRiwayatData = () => {
    try {
      const saved = localStorage.getItem("riwayatSewa");
      const initialData = saved ? JSON.parse(saved) : [];
      const fixedData = initialData.map((item: any) => ({
        ...item,
        id: item.id ?? generateId(),
      }));
      localStorage.setItem("riwayatSewa", JSON.stringify(fixedData));
      setRiwayat(fixedData);
      return fixedData;
    } catch {
      return [];
    }
  };

  // Helper format tanggal
  const formatDateRange = (dateString: string, duration: string) => {
    if (!dateString) return "-";
    try {
      const start = new Date(dateString);
      const durationNum = parseInt(duration?.toString().replace(/\D/g, "")) || 0;

      if (isNaN(start.getTime())) return "-";

      const end = new Date(start);
      end.setDate(start.getDate() + durationNum);

      const formatter = new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      return durationNum > 0
        ? `${formatter.format(start)} - ${formatter.format(end)}`
        : formatter.format(start);
    } catch {
      return "-";
    }
  };

  // Helper format harga
  const formatPrice = (price: string | number) => {
    const num = parseInt(price as string);
    if (isNaN(num) || num <= 0) return "Rp 0";
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  // Chart setup
  onMount(() => {
    const data = loadRiwayatData();
    setTimeout(() => setIsLoaded(true), 100);

    root = am5.Root.new("chartdiv");

    const myTheme = am5.Theme.new(root);
    myTheme.rule("Label", []).setAll({ 
      fill: am5.color(0x3F5B8B), 
      fontSize: 14,
      fontWeight: "500"
    });
    myTheme.rule("Grid", []).setAll({ 
      stroke: am5.color(0xE3ECF7),
      strokeDasharray: [2, 4]
    });
    myTheme.rule("AxisLabel", []).setAll({ 
      fill: am5.color(0x6C5E82), 
      fontSize: 12,
      fontWeight: "400"
    });

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
        renderer: am5xy.AxisRendererX.new(root, { 
          minGridDistance: 30,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9
        }),
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
      cornerRadiusTL: 8,
      cornerRadiusTR: 8,
      strokeWidth: 2
    });

    series.columns.template.states.create("hover", {
      fill: am5.color(0x4A6FA5),
      scale: 1.05
    });

    const months = ["Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const chartData = months.map((bulan) => ({ bulan, jumlah: 0 }));

    data.forEach((item: RiwayatItem) => {
      if (!item.date) return;
      const date = new Date(item.date);
      if (isNaN(date.getTime())) return;
      const monthIndex = date.getMonth();
      if (monthIndex >= 6 && monthIndex <= 11) {
        chartData[monthIndex - 6].jumlah += 1;
      }
    });

    xAxis.data.setAll(chartData);
    series.data.setAll(chartData);

    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none"
    }));
  });

  onCleanup(() => {
    if (root) root.dispose();
  });

  // Status count reactive
  const statusCounts = createMemo(() => {
    const data = riwayat();
    return {
      diproses: data.filter((r) => r.status === "Diproses").length,
      dikirim: data.filter((r) => r.status === "Dikirim").length,
      selesai: data.filter((r) => r.status === "Selesai").length,
    };
  });

  const goToRiwayat = () => navigate("/riwayat");
  const goToTracking = (id: number) => navigate(`/tracking/${id}`);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diproses":
        return "bg-gradient-to-r from-yellow-400 to-orange-400";
      case "Dikirim":
        return "bg-gradient-to-r from-blue-400 to-blue-500";
      case "Selesai":
        return "bg-gradient-to-r from-green-400 to-emerald-500";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  // Calculate growth percentage (mock data for demo)
  const getGrowthPercentage = () => {
    return Math.floor(Math.random() * 20) + 5;
  };

  // Custom responsive table component
  const TableRow = (props: { item: RiwayatItem; index: number }) => {
    const { item, index } = props;
    return (
      <div class={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 animate-slide-up group cursor-pointer hover:border-blue-200`}
           style={{ "animation-delay": `${1500 + index * 100}ms` }}
           onClick={() => item.id && goToTracking(item.id)}>
        <div class="flex justify-between items-start mb-3">
          <h4 class="font-semibold text-gray-900 text-sm group-hover:text-[#3F5B8B] transition-colors duration-300 line-clamp-1">
            {item.name || "-"}
          </h4>
          <span class={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(item.status)} hover:shadow-lg transition-all duration-300`}>
            {item.status || "-"}
          </span>
        </div>
        <div class="space-y-2 text-xs text-gray-600">
          <div class="flex justify-between">
            <span class="text-gray-500">Tanggal:</span>
            <span class="font-medium">{formatDateRange(item.date, item.duration)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Durasi:</span>
            <span class="bg-gray-100 px-2 py-1 rounded-full font-medium">{item.duration || "-"}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Harga:</span>
            <span class="font-bold text-[#3F5B8B]">{formatPrice(item.price)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-3 sm:p-6">
      {/* Background Pattern */}
      <div class="fixed inset-0 opacity-5 pointer-events-none">
        <div class="absolute inset-0" style={{
          "background-image": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto">
        {/* Header - responsive */}
        <div class={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 transform transition-all duration-1000 ${
          isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] opacity-0'
        }`}>
          <button
            onClick={goToRiwayat}
            class="bg-gradient-to-r from-[#6C5E82] to-[#5A4D73] hover:from-[#5A4D73] hover:to-[#4A3D63] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group text-sm sm:text-base"
          >
            <Eye size={16} class="sm:w-[18px] sm:h-[18px] group-hover:rotate-12 transition-transform duration-300" />
            <span class="font-medium">Lihat Riwayat Lengkap</span>
          </button>
        </div>

        {/* Responsive Layout */}
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Stats and Chart */}
          <div class="xl:col-span-2 space-y-6 sm:space-y-8">
            {/* Enhanced Statistik Cards with better responsive grid */}
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[
                {
                  icon: ShoppingCart,
                  title: "Total Sewa",
                  value: riwayat().length,
                  subtitle: "Semua pesanan",
                  color: "from-pink-400 to-red-400",
                  bgColor: "bg-gradient-to-br from-pink-50 to-red-50",
                  iconBg: "bg-gradient-to-br from-pink-400 to-red-400"
                },
                {
                  icon: Clock,
                  title: "Diproses",
                  value: statusCounts().diproses,
                  subtitle: `${statusCounts().diproses} pesanan`,
                  color: "from-yellow-400 to-orange-400",
                  bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50",
                  iconBg: "bg-gradient-to-br from-yellow-400 to-orange-400"
                },
                {
                  icon: Lock,
                  title: "Dikirim",
                  value: statusCounts().dikirim,
                  subtitle: `${statusCounts().dikirim} pesanan`,
                  color: "from-blue-400 to-indigo-400",
                  bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
                  iconBg: "bg-gradient-to-br from-blue-400 to-indigo-400"
                },
                {
                  icon: BarChart3,
                  title: "Selesai",
                  value: statusCounts().selesai,
                  subtitle: `${statusCounts().selesai} pesanan`,
                  color: "from-green-400 to-emerald-400",
                  bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
                  iconBg: "bg-gradient-to-br from-green-400 to-emerald-400"
                },
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    class={`${item.bgColor} backdrop-blur-sm border border-white/20 shadow-xl rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 group cursor-pointer animate-slide-up`}
                    style={{ "animation-delay": `${index * 150}ms` }}
                  >
                    <div class={`w-10 h-10 sm:w-16 sm:h-16 ${item.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <div class="text-white">
                        <IconComponent size={window.innerWidth < 640 ? 20 : 32} />
                      </div>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 font-medium mb-1">{item.title}</p>
                    <div class="flex items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <p class={`text-lg sm:text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent animate-number`}>
                        {item.value}
                      </p>
                      <div class="flex items-center text-green-500 text-xs">
                        <TrendingUp size={10} class="sm:w-3 sm:h-3" />
                        <span class="ml-1">{getGrowthPercentage()}%</span>
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 hidden sm:block">{item.subtitle}</p>
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl sm:rounded-2xl transform skew-x-12 translate-x-full group-hover:translate-x-[-100%]"></div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Chart - responsive */}
            <div class={`bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-8 transform transition-all duration-1000 hover:shadow-3xl animate-fade-up ${
              isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ "animation-delay": "600ms" }}>
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#3F5B8B] to-[#6C5E82] rounded-lg sm:rounded-xl flex items-center justify-center">
                    <BarChart3 class="text-white" size={window.innerWidth < 640 ? 16 : 20} />
                  </div>
                  <div>
                    <h3 class="text-lg sm:text-2xl font-bold text-[#3F5B8B] mb-1">Grafik Penyewaan</h3>
                    <p class="text-xs sm:text-sm text-gray-600">Tren 6 bulan terakhir</p>
                  </div>
                </div>
                <div class="bg-gray-50 px-3 py-1 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl">
                  <span class="text-xs sm:text-sm text-[#7A7A8B] font-medium">
                    Juli - Desember {riwayat().length > 0 
                      ? new Date(riwayat()[0].date).getFullYear() 
                      : new Date().getFullYear()}
                  </span>
                </div>
              </div>
              <div id="chartdiv" class="w-full rounded-xl sm:rounded-2xl overflow-hidden" style={{ height: window.innerWidth < 640 ? "250px" : "350px" }} />
            </div>
          </div>

          {/* Right Column - AG Grid Table */}
          <div class={`xl:col-span-1 bg-white/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 transform transition-all duration-1000 animate-fade-up ${
            isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`} style={{ "animation-delay": "900ms" }}>
            <div class="flex justify-between items-center mb-4 sm:mb-6">
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#3F5B8B] to-[#6C5E82] rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Package class="text-white" size={window.innerWidth < 640 ? 16 : 20} />
                </div>
                <div>
                  <h3 class="text-lg sm:text-xl font-bold text-[#3F5B8B] mb-1">Pesanan Terbaru</h3>
                  <p class="text-xs sm:text-sm text-gray-600">10 pesanan terakhir</p>
                </div>
              </div>
            </div>

            <div class="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
              {riwayat().length === 0 ? (
                <div class="flex flex-col items-center gap-4 py-8 sm:py-12">
                  <div class="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package class="text-gray-400" size={window.innerWidth < 640 ? 24 : 32} />
                  </div>
                  <p class="text-gray-500 font-medium text-sm sm:text-base">Belum ada data pesanan</p>
                  <p class="text-gray-400 text-xs sm:text-sm text-center">Pesanan akan muncul di sini setelah dibuat</p>
                </div>
              ) : (
                <>
                  {riwayat()
                    .slice()
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 10)
                    .map((item, index) => (
                      <TableRow item={item} index={index} />
                    ))}
                  {riwayat().length > 10 && (
                    <div class="text-center pt-4">
                      <button
                        onClick={goToRiwayat}
                        class="text-[#6C5E82] hover:text-[#5A4D73] text-sm font-medium flex items-center gap-2 mx-auto bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-all duration-300 group"
                      >
                        <span>Lihat {riwayat().length - 10} pesanan lainnya</span>
                        <Eye size={14} class="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style>
        {`
          @keyframes slide-up {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes slide-down {
            from { 
              opacity: 0; 
              transform: translateY(-20px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes fade-up {
            from { 
              opacity: 0; 
              transform: translateY(40px) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          
          @keyframes number {
            from { 
              opacity: 0; 
              transform: scale(0.5); 
            }
            to { 
              opacity: 1; 
              transform: scale(1); 
            }
          }
          
          .animate-slide-up {
            animation: slide-up 0.8s ease-out both;
          }
          
          .animate-slide-down {
            animation: slide-down 0.6s ease-out both;
          }
          
          .animate-fade-up {
            animation: fade-up 1s ease-out both;
          }
          
          .animate-number {
            animation: number 0.8s ease-out both;
          }
          
          /* Custom responsive table cards */
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #3F5B8B, #6C5E82);
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #2E4A73, #5A4D73);
          }
          
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #3F5B8B, #6C5E82);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #2E4A73, #5A4D73);
          }
        `}
      </style>
    </div>
  );
}