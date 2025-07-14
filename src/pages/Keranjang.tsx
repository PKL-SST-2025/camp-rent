// src/pages/Keranjang.tsx
import { createSignal, onMount } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import { A } from "@solidjs/router";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  img: string;
  quantity: number;
}

export default function Keranjang() {
  const [items, setItems] = createSignal<CartItem[]>([]);

  onMount(() => {
    const saved = localStorage.getItem("keranjang");
    if (saved) setItems(JSON.parse(saved));
  });

  const handleQuantityChange = (id: number, value: number) => {
    const updated = items().map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, value) } : item
    );
    setItems(updated);
    localStorage.setItem("keranjang", JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    if (confirm("Yakin ingin menghapus barang ini?")) {
      const updated = items().filter((item) => item.id !== id);
      setItems(updated);
      localStorage.setItem("keranjang", JSON.stringify(updated));
    }
  };

  const subtotal = (item: CartItem) => item.quantity * item.price;
  const total = () => items().reduce((acc, item) => acc + subtotal(item), 0);

  const columnDefs = [
    {
      headerName: "Gambar",
      field: "img",
      cellRenderer: (params: any) => {
        const img = document.createElement("img");
        img.src = params.value;
        img.className = "w-12 h-12 object-contain mx-auto";
        return img;
      },
    },
    { headerName: "Nama", field: "name" },
    {
      headerName: "Harga",
      field: "price",
      valueFormatter: (params: any) =>
        `Rp.${params.value.toLocaleString("id-ID")}/hari`,
    },
    {
      headerName: "Jumlah Hari",
      field: "quantity",
      editable: true,
      cellEditor: "agNumberCellEditor",
    },
    {
      headerName: "Subtotal",
      valueGetter: (params: any) =>
        params.data.price * params.data.quantity,
      valueFormatter: (params: any) =>
        `Rp.${params.value.toLocaleString("id-ID")}`,
    },
    {
      headerName: "",
      cellRenderer: (params: any) => {
        const btn = document.createElement("button");
        btn.textContent = "🗑️";
        btn.onclick = () => removeItem(params.data.id);
        btn.className = "text-red-600 hover:scale-110 transition";
        return btn;
      },
    },
  ];

  return (
   <div class="p-6 max-w-6xl mx-auto space-y-8">
  {items().length > 0 ? (
    <>
      {/* TABEL */}
      <div class="ag-theme-alpine" style={{ height: "400px" }}>
        <AgGridSolid
          rowData={items()}
          columnDefs={columnDefs}
          domLayout="autoHeight"
          onCellValueChanged={(e) =>
            handleQuantityChange(e.data.id, parseInt(e.newValue))
          }
          defaultColDef={{ sortable: true, resizable: true }}
        />
      </div>

      {/* TOMBOL DI BAWAH, TERPISAH */}
      <div class="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-center">
  <A
    href="/produk"
    class="text-sm text-[#3F5B8B] hover:underline hover:text-blue-800 transition"
  >
    ← Kembali belanja
  </A>

  <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
    <span class="text-sm font-medium">Total:</span>
    <span class="text-lg font-bold text-green-700">
      Rp.{total().toLocaleString("id-ID")}
    </span>
    <A
      href="/checkout"
      class="bg-[#3F5B8B] hover:bg-[#2C4A6C] text-white px-5 py-2 rounded-lg shadow transition duration-200"
    >
      Checkout
    </A>
  </div>
</div>

    </>
  ) : (
    <div class="text-center text-gray-500 py-6">Keranjang kosong.</div>
  )}

  {/* AG Grid Custom Theme */}
  <style>
    {`
      .ag-theme-alpine .ag-header {
        background-color: #3F5B8B !important;
        color: white;
        font-weight: bold;
      }
      .ag-theme-alpine .ag-cell {
        border-color: #dce6f2 !important;
        background-color: #f5f9ff;
      }
      .ag-theme-alpine .ag-row-hover {
        background-color: #e3ecf7 !important;
      }
      .ag-theme-alpine button {
        color: #dc2626;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
      }
    `}
  </style>
</div>

  );
}
