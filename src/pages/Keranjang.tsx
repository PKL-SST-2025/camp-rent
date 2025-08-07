// src/pages/Keranjang.tsx
import { createSignal, onMount } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import { A, useNavigate } from "@solidjs/router";
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
  const [selectedItems, setSelectedItems] = createSignal<number[]>([]);
  const navigate = useNavigate();

  onMount(() => {
    const saved = localStorage.getItem("keranjang");
    if (saved) setItems(JSON.parse(saved));

    // Cek apakah baru selesai checkout (dari URL parameter atau flag)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout_success') === 'true') {
      clearCart();
      // Hapus parameter dari URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
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
      // Hapus dari selected items juga
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedItems().length === items().length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items().map(item => item.id));
    }
  };

  const clearCart = () => {
    setItems([]);
    setSelectedItems([]);
    localStorage.removeItem("keranjang");
  };

  const subtotal = (item: CartItem) => item.quantity * item.price;
  const total = () => items().reduce((acc, item) => acc + subtotal(item), 0);
  
  const selectedTotal = () => {
    return items()
      .filter(item => selectedItems().includes(item.id))
      .reduce((acc, item) => acc + subtotal(item), 0);
  };

  const handleCheckout = () => {
    if (selectedItems().length === 0) {
      alert("Pilih minimal 1 barang untuk checkout!");
      return;
    }

    const selectedCartItems = items().filter(item => 
      selectedItems().includes(item.id)
    );
    
    // Simpan barang yang dipilih untuk checkout
    localStorage.setItem("checkout_items", JSON.stringify(selectedCartItems));
    
    // Navigate ke halaman checkout
    navigate("/checkout");
  };

  const columnDefs = [
    {
      headerName: "",
      width: 50,
      cellRenderer: (params: any) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = selectedItems().includes(params.data.id);
        checkbox.onchange = () => toggleSelectItem(params.data.id);
        checkbox.className = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500";
        return checkbox;
      },
      suppressSorting: true,
    },
    {
      headerName: "Gambar",
      field: "img",
      width: 100,
      cellRenderer: (params: any) => {
        const img = document.createElement("img");
        img.src = params.value;
        img.className = "w-12 h-12 object-contain mx-auto";
        return img;
      },
    },
    { headerName: "Nama", field: "name", flex: 1 },
    {
      headerName: "Harga",
      field: "price",
      width: 150,
      valueFormatter: (params: any) =>
        `Rp.${params.value.toLocaleString("id-ID")}/hari`,
    },
    {
      headerName: "Jumlah Hari",
      field: "quantity",
      width: 120,
      editable: true,
      cellEditor: "agNumberCellEditor",
    },
    {
      headerName: "Subtotal",
      width: 150,
      valueGetter: (params: any) =>
        params.data.price * params.data.quantity,
      valueFormatter: (params: any) =>
        `Rp.${params.value.toLocaleString("id-ID")}`,
    },
    {
      headerName: "",
      width: 80,
      cellRenderer: (params: any) => {
        const btn = document.createElement("button");
        btn.textContent = "🗑️";
        btn.onclick = () => removeItem(params.data.id);
        btn.className = "text-red-600 hover:scale-110 transition p-1";
        btn.title = "Hapus barang";
        return btn;
      },
      suppressSorting: true,
    },
  ];

  return (
    <div class="p-6 max-w-7xl mx-auto space-y-8">
      {items().length > 0 ? (
        <>
          {/* HEADER DENGAN SELECT ALL */}
          <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedItems().length === items().length && items().length > 0}
                onChange={selectAll}
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="font-medium text-gray-700">
                Pilih Semua ({selectedItems().length}/{items().length})
              </span>
            </div>
            
            {selectedItems().length > 0 && (
              <div class="text-sm text-gray-600">
                {selectedItems().length} barang dipilih
              </div>
            )}
          </div>

          {/* TABEL */}
          <div class="ag-theme-alpine" style={{ height: "500px" }}>
            <AgGridSolid
              rowData={items()}
              columnDefs={columnDefs}
              domLayout="normal"
              onCellValueChanged={(e) =>
                handleQuantityChange(e.data.id, parseInt(e.newValue))
              }
              defaultColDef={{ 
                sortable: true, 
                resizable: true,
                suppressSizeToFit: false
              }}
              suppressRowClickSelection={true}
            />
          </div>

          {/* SUMMARY & ACTIONS */}
          <div class="bg-white border rounded-lg p-6 shadow-sm">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              
              {/* LEFT SIDE - Back Link */}
              <A
                href="/produk"
                class="text-sm text-[#3F5B8B] hover:underline hover:text-blue-800 transition"
              >
                ← Kembali belanja
              </A>

              {/* RIGHT SIDE - Totals & Checkout */}
              <div class="flex flex-col sm:flex-row items-center gap-4">
                
                {/* Total Info */}
                <div class="text-center sm:text-right">
                  <div class="text-sm text-gray-600">
                    Total Keranjang: 
                    <span class="font-semibold ml-1">
                      Rp.{total().toLocaleString("id-ID")}
                    </span>
                  </div>
                  
                  {selectedItems().length > 0 && (
                    <div class="text-sm text-blue-600 mt-1">
                      Yang dipilih: 
                      <span class="font-semibold ml-1">
                        Rp.{selectedTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div class="flex gap-2">
                  <button
                    onClick={clearCart}
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition duration-200 text-sm"
                  >
                    Kosongkan
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems().length === 0}
                    class="bg-[#3F5B8B] hover:bg-[#2C4A6C] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg shadow transition duration-200 font-medium"
                  >
                    Checkout ({selectedItems().length})
                  </button>
                </div>

              </div>
            </div>
          </div>

        </>
      ) : (
        <div class="text-center py-12">
          <div class="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 class="text-xl font-medium text-gray-700 mb-2">Keranjang Kosong</h3>
          <p class="text-gray-500 mb-6">Belum ada barang yang ditambahkan ke keranjang</p>
          <A
            href="/produk"
            class="inline-block bg-[#3F5B8B] hover:bg-[#2C4A6C] text-white px-6 py-3 rounded-lg shadow transition duration-200"
          >
            Mulai Belanja
          </A>
        </div>
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
          .ag-theme-alpine .ag-row[aria-selected="true"] {
            background-color: #e3f2fd !important;
          }
          .ag-theme-alpine button {
            color: #dc2626;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
          }
          .ag-theme-alpine .ag-cell input[type="checkbox"] {
            margin: 0;
          }
        `}
      </style>
    </div>
  );
}