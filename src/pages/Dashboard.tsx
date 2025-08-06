import { onMount, onCleanup, createSignal, createMemo } from "solid-js";
import { useNavigate } from "@solidjs/router";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ShoppingCart, Lock, Clock, Eye, BarChart3 } from "lucide-solid";

type RiwayatItem = {
  id?: number;
  name: string;
  date: string;
  duration: string;
  price: string;
  status: string;
  statusColor?: string;
};

// ✅ Format tanggal & harga langsung di sini
function formatDateRange(dateString: string, duration: string) {
  try {
    const start = new Date(dateString);
    const durationNum = parseInt(duration?.toString().replace(/\D/g, ""));
    if (isNaN(start.getTime()) || isNaN(durationNum)) return "-";

    const end = new Date(start);
    end.setDate(start.getDate() + durationNum);

    const formatter = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
  } catch {
    return "-";
  }
}

function formatPrice(price: string | number) {
  const num = parseInt(price as string);
  return !isNaN(num) ? `Rp ${num.toLocaleString("id-ID")}` : "Rp 0";
}

export default function DashboardInventaris() {
  const navigate = useNavigate();
  let root: am5.Root;
  const [riwayat, setRiwayat] = createSignal<RiwayatItem[]>([]);

  function generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  const loadRiwayatData = () => {
    try {
      const saved = localStorage.getItem("riwayatSewa");
      const initialData = saved ? JSON.parse(saved) : [];
      const fixedData = initialData.map((item: any) => ({
        ...item,
        id: item.id ?? generateId()
      }));
      localStorage.setItem("riwayatSewa", JSON.stringify(fixedData));
      setRiwayat(fixedData);
      return fixedData;
    } catch {
      return [];
    }
  };

  onMount(() => {
    const data = loadRiwayatData();
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
        const date = new Date(item.date);
        const monthIndex = date.getMonth();
        if (monthIndex >= 6 && monthIndex <= 11) {
          chartData[monthIndex - 6].jumlah += 1;
        }
      });

      xAxis.data.setAll(chartData);
      series.data.setAll(chartData);
    } catch {}
  });

  onCleanup(() => {
    if (root) root.dispose();
  });

  const statusCounts = createMemo(() => {
    const data = riwayat();
    return {
      diproses: data.filter(r => r.status === "Diproses").length,
      dikirim: data.filter(r => r.status === "Dikirim").length,
      selesai: data.filter(r => r.status === "Selesai").length
    };
  });

  const goToRiwayat = () => navigate("/riwayat");
  const goToTracking = (id: number) => navigate(`/tracking/${id}`);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Diproses": return "bg-yellow-400";
      case "Dikirim": return "bg-blue-400";
      case "Selesai": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <>
      {/* Tabel Ringkasan */}
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
                riwayat()
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((item) => (
                    <tr class="hover:bg-gray-50">
                      <td class="px-4 py-2 text-sm text-gray-900">{item.name}</td>
                      <td class="px-4 py-2 text-sm text-gray-600">
                        {formatDateRange(item.date, item.duration)}
                      </td>
                      <td class="px-4 py-2 text-sm text-gray-600">{item.duration}</td>
                      <td class="px-4 py-2 text-sm text-gray-600">
                        {formatPrice(item.price)}
                      </td>
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
    </>
  );
}
