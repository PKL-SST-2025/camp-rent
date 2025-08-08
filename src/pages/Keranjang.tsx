// src/pages/Keranjang.tsx
import { createSignal, onMount } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import { A, useNavigate } from "@solidjs/router";
import { Trash2, ShoppingCart, ArrowLeft, Package, Check } from "lucide-solid";
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
      width: 60,
      minWidth: 50,
      maxWidth: 80,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex justify-center items-center h-full";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = selectedItems().includes(params.data.id);
        checkbox.onchange = () => toggleSelectItem(params.data.id);
        checkbox.className = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer";
        
        container.appendChild(checkbox);
        return container;
      },
      suppressSorting: true,
    },
    {
      headerName: "Gambar",
      field: "img",
      width: 120,
      minWidth: 80,
      maxWidth: 150,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex justify-center items-center h-full p-2";
        
        const img = document.createElement("img");
        img.src = params.value;
        img.className = "w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg bg-gray-50 p-1";
        img.loading = "lazy";
        
        container.appendChild(img);
        return container;
      },
      suppressSorting: true,
    },
    { 
      headerName: "Nama Produk", 
      field: "name", 
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex flex-col justify-center h-full py-2";
        
        const name = document.createElement("div");
        name.textContent = params.value;
        name.className = "font-semibold text-gray-800 text-sm sm:text-base line-clamp-2";
        
        const category = document.createElement("div");
        category.textContent = params.data.category.charAt(0).toUpperCase() + params.data.category.slice(1);
        category.className = "text-xs text-gray-500 mt-1 capitalize";
        
        container.appendChild(name);
        container.appendChild(category);
        return container;
      }
    },
    {
      headerName: "Harga/Hari",
      field: "price",
      width: 140,
      minWidth: 120,
      maxWidth: 160,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex flex-col justify-center items-center h-full text-center";
        
        const price = document.createElement("div");
        price.textContent = `Rp${params.value.toLocaleString("id-ID")}`;
        price.className = "font-bold text-blue-600 text-sm sm:text-base";
        
        const perDay = document.createElement("div");
        perDay.textContent = "/hari";
        perDay.className = "text-xs text-gray-500";
        
        container.appendChild(price);
        container.appendChild(perDay);
        return container;
      },
    },
    {
      headerName: "Durasi",
      field: "quantity",
      width: 120,
      minWidth: 100,
      maxWidth: 140,
      editable: true,
      cellEditor: "agNumberCellEditor",
      cellEditorParams: {
        min: 1,
        max: 30,
        step: 1
      },
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex flex-col justify-center items-center h-full text-center";
        
        const quantity = document.createElement("div");
        quantity.textContent = `${params.value}`;
        quantity.className = "font-bold text-lg text-gray-800";
        
        const days = document.createElement("div");
        days.textContent = params.value === 1 ? "hari" : "hari";
        days.className = "text-xs text-gray-500";
        
        container.appendChild(quantity);
        container.appendChild(days);
        return container;
      },
    },
    {
      headerName: "Subtotal",
      width: 140,
      minWidth: 120,
      maxWidth: 160,
      valueGetter: (params: any) =>
        params.data.price * params.data.quantity,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex flex-col justify-center items-center h-full text-center";
        
        const subtotal = document.createElement("div");
        const value = params.data.price * params.data.quantity;
        subtotal.textContent = `Rp${value.toLocaleString("id-ID")}`;
        subtotal.className = "font-bold text-green-600 text-sm sm:text-base";
        
        const total = document.createElement("div");
        total.textContent = "Total";
        total.className = "text-xs text-gray-500";
        
        container.appendChild(subtotal);
        container.appendChild(total);
        return container;
      },
    },
    {
      headerName: "Aksi",
      width: 80,
      minWidth: 70,
      maxWidth: 100,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex justify-center items-center h-full";
        
        const btn = document.createElement("button");
        btn.innerHTML = `
          <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        `;
        btn.onclick = () => removeItem(params.data.id);
        btn.className = "text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300";
        btn.title = "Hapus barang";
        
        container.appendChild(btn);
        return container;
      },
      suppressSorting: true,
    },
  ];

  return (
    <div class="p-3 sm:p-6 max-w-7xl mx-auto space-y-6 sm:space-y-8 min-h-screen bg-gray-50">
      {items().length > 0 ? (
        <>
          {/* HEADER */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="bg-blue-100 p-2 rounded-lg">
                  <ShoppingCart class="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h1 class="text-xl sm:text-2xl font-bold text-gray-800"></h1>
                  <p class="text-sm text-gray-600">{items().length} produk dalam keranjang</p>
                </div>
              </div>
            </div>
          </div>

          {/* SELECT ALL SECTION */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div class="flex items-center justify-between flex-wrap gap-3">
              <div class="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems().length === items().length && items().length > 0}
                  onChange={selectAll}
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <span class="font-medium text-gray-700 text-sm sm:text-base">
                  Pilih Semua ({selectedItems().length}/{items().length})
                </span>
              </div>
              
              {selectedItems().length > 0 && (
                <div class="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                  <Check class="w-4 h-4 text-blue-600" />
                  <span class="text-sm text-blue-700 font-medium">
                    {selectedItems().length} barang dipilih
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* TABLE SECTION */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
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
                  suppressSizeToFit: false,
                  cellStyle: { display: 'flex', alignItems: 'center' }
                }}
                suppressRowClickSelection={true}
                rowHeight={80}
                headerHeight={50}
                enableRangeSelection={false}
                enableCellTextSelection={false}
              />
            </div>
          </div>

          {/* SUMMARY & ACTIONS */}
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <div class="flex flex-col space-y-4">
              
              {/* Back Link */}
              <div class="flex justify-start">
                <A
                  href="/produk"
                  class="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  <ArrowLeft class="w-4 h-4" />
                  Kembali belanja
                </A>
              </div>

              {/* Totals & Actions */}
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-4 border-t border-gray-200">
                
                {/* Total Info */}
                <div class="space-y-2">
                  <div class="flex items-center justify-between sm:justify-start sm:gap-4">
                    <span class="text-sm text-gray-600">Total Keranjang:</span>
                    <span class="font-bold text-lg text-gray-800">
                      Rp{total().toLocaleString("id-ID")}
                    </span>
                  </div>
                  
                  {selectedItems().length > 0 && (
                    <div class="flex items-center justify-between sm:justify-start sm:gap-4">
                      <span class="text-sm text-blue-600">Yang dipilih:</span>
                      <span class="font-bold text-lg text-blue-600">
                        Rp{selectedTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div class="flex flex-col sm:flex-row gap-3 sm:gap-2">
                  <button
                    onClick={clearCart}
                    class="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 text-sm font-medium"
                  >
                    <Trash2 class="w-4 h-4" />
                    Kosongkan
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems().length === 0}
                    class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 font-medium text-sm sm:text-base"
                  >
                    <Package class="w-4 h-4" />
                    Checkout ({selectedItems().length})
                  </button>
                </div>

              </div>
            </div>
          </div>

        </>
      ) : (
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12">
          <div class="text-center">
            <div class="bg-gray-100 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart class="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-gray-700 mb-2">Keranjang Kosong</h3>
            <p class="text-gray-500 mb-6 text-sm sm:text-base">Belum ada barang yang ditambahkan ke keranjang</p>
            <A
              href="/produk"
              class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 font-medium"
            >
              <ShoppingCart class="w-4 h-4" />
              Mulai Belanja
            </A>
          </div>
        </div>
      )}

      {/* CUSTOM STYLES */}
      <style>
        {`
          .ag-theme-alpine {
            --ag-header-height: 50px;
            --ag-row-height: 80px;
            --ag-border-color: #e5e7eb;
            --ag-header-background-color: #3b82f6;
            --ag-header-foreground-color: white;
            --ag-odd-row-background-color: #f8fafc;
            --ag-row-hover-color: #e0f2fe;
            --ag-selected-row-background-color: #dbeafe;
            font-family: inherit;
          }
          
          .ag-theme-alpine .ag-header {
            font-weight: 600;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .ag-theme-alpine .ag-header-cell {
            padding: 0 8px;
          }
          
          .ag-theme-alpine .ag-cell {
            border-right: 1px solid #f1f5f9;
            display: flex;
            align-items: center;
            padding: 0 8px;
          }
          
          .ag-theme-alpine .ag-row {
            border-bottom: 1px solid #f1f5f9;
          }
          
          .ag-theme-alpine .ag-row:hover {
            background-color: var(--ag-row-hover-color);
          }
          
          .ag-theme-alpine .ag-cell-focus {
            border: 2px solid #3b82f6 !important;
          }
          
          .ag-theme-alpine .ag-cell.ag-cell-inline-editing {
            background-color: #fff7ed;
            border: 2px solid #fb923c;
          }
          
          .ag-theme-alpine .ag-numeric-cell {
            text-align: center;
          }
          
          @media (max-width: 640px) {
            .ag-theme-alpine {
              --ag-header-height: 45px;
              --ag-row-height: 70px;
            }
            
            .ag-theme-alpine .ag-header-cell {
              padding: 0 4px;
              font-size: 0.875rem;
            }
            
            .ag-theme-alpine .ag-cell {
              padding: 0 4px;
            }
          }
        `}
      </style>
    </div>
  );
}