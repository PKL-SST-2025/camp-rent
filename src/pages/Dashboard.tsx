import { onMount, onCleanup, createSignal } from "solid-js";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ShoppingCart, Lock, Clock } from "lucide-solid";
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
  let root: am5.Root;
  const [riwayat, setRiwayat] = createSignal<RiwayatItem[]>([]);

  onMount(() => {
    const data: RiwayatItem[] = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
    setRiwayat(data);

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

    data.forEach((item) => {
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

  return (
    <>
      {/* Statistik Cards */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 animate-fade-in">
        {[
          {
            icon: <ShoppingCart class="mx-auto mb-3 text-[#D0797F]" size={32} />,
            title: "Total Sewa",
            value: riwayat().length,
          },
          {
            icon: <Lock class="mx-auto mb-3 text-[#6C5E82]" size={32} />,
            title: "Barang Disewa",
            value: lastValid()?.name || "—",
          },
          {
            icon: <Clock class="mx-auto mb-3 text-[#3B7DA6]" size={32} />,
            title: "Status Terakhir",
            value: lastValid()?.status || "—",
          },
        ].map(({ icon, title, value }) => (
          <div class="bg-white shadow rounded-lg p-5 text-center hover:shadow-xl transition duration-300 transform hover:scale-105">
            {icon}
            <p class="text-sm text-[#7A7A8B]">{title}</p>
            <p class="text-2xl font-bold text-[#2E365A]">{value}</p>
          </div>
        ))}
      </div>

      {/* Grafik Chart */}
      <div class="bg-white shadow rounded-lg p-6 mb-6 animate-fade-in">
        <h3 class="text-xl font-semibold mb-4 text-[#3F5B8B]">Grafik Penyewaan Bulanan</h3>
        <div id="chartdiv" class="w-full" style={{ height: "300px" }} />
      </div>

      {/* Tabel AG Grid */}
      <div class="bg-white shadow rounded-lg p-6 animate-fade-in">
        <h3 class="text-xl font-semibold mb-4 text-[#3F5B8B]">Status Penyewaan</h3>
        <div class="ag-theme-alpine overflow-auto" style="height: 300px; width: 100%;">
          <AgGridSolid
            rowData={riwayat()}
            columnDefs={[
              { headerName: "Nama Barang", field: "name", flex: 1 },
              { headerName: "Tanggal Mulai", field: "date", flex: 1 },
              { headerName: "Durasi (hari)", field: "duration", flex: 1 },
              { headerName: "Status", field: "status", flex: 1 },
            ]}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
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
