// src/pages/Keranjang.tsx
import { createSignal, onMount } from "solid-js";
import { render } from "solid-js/web";
import AgGridSolid from "ag-grid-solid";
import { A } from "@solidjs/router";
import { Trash2 } from "lucide-solid";
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

  const checkout = () => {
    // Simpan data checkout
    localStorage.setItem("checkoutData", JSON.stringify(items()));
    // Hapus keranjang setelah checkout
    localStorage.removeItem("keranjang");
    setItems([]);
    alert("Checkout berhasil! Keranjang dikosongkan.");
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
        btn.className =
          "text-red-600 hover:scale-110 transition flex items-center justify-center";

        // Render icon Trash2 ke dalam button
        const iconContainer = document.createElement("span");
        render(() => <Trash2 size={18} />, iconContainer);
        btn.appendChild(iconContainer);

        btn.onclick = () => removeItem(params.data.id);
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

          {/* TOMBOL DI BAWAH */}
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
              <button
                onClick={checkout}
                class="bg-[#3F5B8B] hover:bg-[#2C4A6C] text-white px-5 py-2 rounded-lg shadow transition duration-200"
              >
                Checkout
              </button>
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
        `}
      </style>
    </div>
  );
}
