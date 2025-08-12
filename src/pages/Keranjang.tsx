import { createSignal, onMount } from "solid-js";
import AgGridSolid from "ag-grid-solid";
import { A, useNavigate } from "@solidjs/router";
import { 
  Trash2, 
  ShoppingCart, 
  ArrowLeft, 
  Package, 
  Plus,
  Minus,
  AlertCircle,
  Gift,
  Calendar,
  Tag,
  CheckCircle2
} from "lucide-solid";
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

interface ConfirmDialogState {
  show: boolean;
  type: 'clear' | 'remove';
  itemId?: number;
  itemName?: string;
}

export default function Keranjang() {
  const [items, setItems] = createSignal<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = createSignal<number[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = createSignal<ConfirmDialogState>({ 
    show: false, 
    type: 'clear' 
  });
  
  const navigate = useNavigate();

  onMount(() => {
    loadCartItems();
    handleCheckoutRedirect();
  });

  const loadCartItems = () => {
    try {
      const saved = localStorage.getItem("keranjang");
      if (saved) {
        const parsedItems = JSON.parse(saved);
        setItems(parsedItems);
        setSelectedItems(parsedItems.map((item: CartItem) => item.id));
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
      setItems([]);
      setSelectedItems([]);
    }
  };

  const handleCheckoutRedirect = () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('checkout_success') === 'true') {
        clearCartItems();
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (error) {
      console.error("Error handling checkout redirect:", error);
    }
  };

  const saveCartToStorage = (updatedItems: CartItem[]) => {
    try {
      if (updatedItems.length === 0) {
        localStorage.removeItem("keranjang");
      } else {
        localStorage.setItem("keranjang", JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.error("Error saving cart to storage:", error);
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    console.log(`Updating quantity for item ${id}: ${newQuantity}`);
    const clampedQuantity = Math.max(1, Math.min(30, newQuantity));
    const updated = items().map((item) =>
      item.id === id ? { ...item, quantity: clampedQuantity } : item
    );
    setItems(updated);
    saveCartToStorage(updated);
  };

  const incrementQuantity = (id: number) => {
    console.log(`Incrementing quantity for item ${id}`);
    const item = items().find(item => item.id === id);
    if (item && item.quantity < 30) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const decrementQuantity = (id: number) => {
    console.log(`Decrementing quantity for item ${id}`);
    const item = items().find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  // SIMPLIFIED removeItem - langsung hapus tanpa dialog untuk test
  const removeItemDirect = (id: number) => {
    console.log(`DIRECT REMOVE: Removing item with ID: ${id}`);
    const updated = items().filter((item) => item.id !== id);
    console.log(`Before remove: ${items().length} items`);
    console.log(`After remove: ${updated.length} items`);
    setItems(updated);
    saveCartToStorage(updated);
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    
    // Force refresh
    setTimeout(() => {
      loadCartItems();
    }, 100);
  };

  // Original removeItem with dialog
  const removeItem = (id: number) => {
    console.log(`DIALOG REMOVE: Showing dialog for item ${id}`);
    const item = items().find(item => item.id === id);
    if (item) {
      setShowConfirmDialog({
        show: true,
        type: 'remove',
        itemId: id,
        itemName: item.name
      });
    }
  };

  const confirmRemoveItem = () => {
    const dialog = showConfirmDialog();
    console.log(`CONFIRM REMOVE: Dialog state:`, dialog);
    if (dialog.itemId) {
      const updated = items().filter((item) => item.id !== dialog.itemId);
      console.log(`Removing item ${dialog.itemId}, items before: ${items().length}, after: ${updated.length}`);
      setItems(updated);
      saveCartToStorage(updated);
      setSelectedItems(prev => prev.filter(id => id !== dialog.itemId));
      
      // Force refresh
      setTimeout(() => {
        loadCartItems();
      }, 100);
    }
    closeDialog();
  };

  // Enhanced clearCartItems function
  const clearCartItems = () => {
    console.log("=== CLEAR CART ITEMS CALLED ===");
    console.log("Items before clear:", items().length);
    
    // Method 1: Set empty arrays
    setItems([]);
    setSelectedItems([]);
    console.log("State cleared, items now:", items().length);
    
    // Method 2: Clear localStorage
    try {
      localStorage.removeItem("keranjang");
      console.log("LocalStorage 'keranjang' removed");
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
    
    // Method 3: Force UI update
    setTimeout(() => {
      console.log("Force checking items after timeout:", items().length);
      if (items().length > 0) {
        console.log("Items still exist, forcing reload...");
        loadCartItems();
      }
    }, 50);
    
    // Method 4: Double check localStorage
    setTimeout(() => {
      const checkStorage = localStorage.getItem("keranjang");
      console.log("LocalStorage check after clear:", checkStorage);
      if (checkStorage) {
        console.log("WARNING: LocalStorage still has data, removing again...");
        localStorage.removeItem("keranjang");
      }
    }, 100);
  };

  // Enhanced clearCart function with more debugging
  const clearCart = () => {
    console.log("=== CLEAR CART FUNCTION CALLED ===");
    console.log("Items length:", items().length);
    console.log("Current items:", items());
    
    if (items().length === 0) {
      console.log("Cart is already empty, returning");
      return;
    }
    
    console.log("Setting dialog to show");
    const newDialogState = { 
      show: true, 
      type: 'clear' as const
    };
    console.log("New dialog state:", newDialogState);
    
    setShowConfirmDialog(newDialogState);
    
    // Double check if dialog is set
    setTimeout(() => {
      console.log("Dialog state after setting:", showConfirmDialog());
    }, 50);
  };

  // Enhanced confirmClearCart function
  const confirmClearCart = () => {
    console.log("=== CONFIRM CLEAR CART CALLED ===");
    console.log("Items before clear:", items().length);
    
    // Multiple ways to clear - try all of them
    console.log("Method 1: Direct state reset");
    setItems([]);
    setSelectedItems([]);
    
    console.log("Method 2: LocalStorage removal");
    try {
      localStorage.removeItem("keranjang");
      console.log("LocalStorage cleared");
    } catch (error) {
      console.error("LocalStorage clear error:", error);
    }
    
    console.log("Method 3: Force reload from storage");
    setTimeout(() => {
      loadCartItems();
      console.log("Items after reload:", items().length);
    }, 100);
    
    closeDialog();
  };

  const closeDialog = () => {
    setShowConfirmDialog({ show: false, type: 'clear' });
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

  // Calculations
  const subtotal = (item: CartItem) => item.quantity * item.price;
  const cartTotal = () => items().reduce((acc, item) => acc + subtotal(item), 0);
  const selectedTotal = () => {
    return items()
      .filter(item => selectedItems().includes(item.id))
      .reduce((acc, item) => acc + subtotal(item), 0);
  };
  const selectedCount = () => selectedItems().length;

  const handleCheckout = () => {
    if (selectedCount() === 0) {
      alert("Pilih minimal 1 barang untuk checkout!");
      return;
    }

    const selectedCartItems = items().filter(item => 
      selectedItems().includes(item.id)
    );
    
    try {
      localStorage.setItem("checkout_items", JSON.stringify(selectedCartItems));
      navigate("/checkout");
    } catch (error) {
      console.error("Error saving checkout items:", error);
      alert("Terjadi kesalahan saat memproses checkout. Silakan coba lagi.");
    }
  };

  // AG-Grid Column Definitions with FIXED delete button
  const columnDefs: any[] = [
    {
      headerName: "",
      width: 50,
      minWidth: 40,
      maxWidth: 60,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex justify-center items-center h-full";
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = selectedItems().includes(params.data?.id);
        checkbox.addEventListener('change', () => {
          toggleSelectItem(params.data?.id);
        });
        checkbox.className = "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer";
        
        container.appendChild(checkbox);
        return container;
      },
      sortable: false,
      pinned: 'left',
    },
    {
      headerName: "Produk",
      field: "name",
      flex: 2,
      minWidth: 250,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex items-center gap-3 h-full py-2";
        
        const imgContainer = document.createElement("div");
        imgContainer.className = "flex-shrink-0";
        
        const img = document.createElement("img");
        img.src = params.data?.img || '';
        img.className = "w-12 h-12 object-contain rounded-lg bg-gray-50 p-1 border";
        img.loading = "lazy";
        img.alt = params.data?.name || '';
        img.onerror = () => {
          img.src = '/api/placeholder/48/48';
        };
        
        const infoContainer = document.createElement("div");
        infoContainer.className = "flex-1 min-w-0";
        
        const name = document.createElement("div");
        name.textContent = params.data?.name || '';
        name.className = "font-semibold text-gray-800 text-sm line-clamp-2 mb-1";
        
        const category = document.createElement("div");
        const categoryName = params.data?.category || '';
        category.innerHTML = `
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
          </span>
        `;
        
        imgContainer.appendChild(img);
        infoContainer.appendChild(name);
        infoContainer.appendChild(category);
        container.appendChild(imgContainer);
        container.appendChild(infoContainer);
        
        return container;
      }
    },
    {
      headerName: "Harga/Hari",
      field: "price",
      width: 130,
      minWidth: 120,
      maxWidth: 150,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex flex-col justify-center items-center h-full text-center";
        
        const price = document.createElement("div");
        price.textContent = `Rp${(params.value || 0).toLocaleString("id-ID")}`;
        price.className = "font-bold text-blue-600 text-sm";
        
        const perDay = document.createElement("div");
        perDay.textContent = "/hari";
        perDay.className = "text-xs text-gray-500";
        
        container.appendChild(price);
        container.appendChild(perDay);
        return container;
      },
    },
    {
      headerName: "Durasi Sewa",
      field: "quantity",
      width: 140,
      minWidth: 130,
      maxWidth: 160,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex items-center justify-center gap-2 h-full";
        
        // Decrease button
        const decreaseBtn = document.createElement("button");
        decreaseBtn.innerHTML = `<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>`;
        decreaseBtn.className = "p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
        decreaseBtn.disabled = (params.value || 0) <= 1;
        decreaseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (params.data?.id) {
            decrementQuantity(params.data.id);
          }
        });
        
        // Quantity display
        const quantityDisplay = document.createElement("div");
        quantityDisplay.className = "flex flex-col items-center";
        
        const quantity = document.createElement("div");
        quantity.textContent = `${params.value || 0}`;
        quantity.className = "font-bold text-gray-800 min-w-[20px] text-center";
        
        const days = document.createElement("div");
        days.textContent = "hari";
        days.className = "text-xs text-gray-500";
        
        // Increase button
        const increaseBtn = document.createElement("button");
        increaseBtn.innerHTML = `<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`;
        increaseBtn.className = "p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
        increaseBtn.disabled = (params.value || 0) >= 30;
        increaseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (params.data?.id) {
            incrementQuantity(params.data.id);
          }
        });
        
        quantityDisplay.appendChild(quantity);
        quantityDisplay.appendChild(days);
        
        container.appendChild(decreaseBtn);
        container.appendChild(quantityDisplay);
        container.appendChild(increaseBtn);
        
        return container;
      },
      sortable: false,
    },
    {
      headerName: "Subtotal",
      width: 130,
      minWidth: 120,
      maxWidth: 150,
      valueGetter: (params: any) => (params.data?.price || 0) * (params.data?.quantity || 0),
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex flex-col justify-center items-center h-full text-center";
        
        const subtotal = document.createElement("div");
        const value = (params.data?.price || 0) * (params.data?.quantity || 0);
        subtotal.textContent = `Rp${value.toLocaleString("id-ID")}`;
        subtotal.className = "font-bold text-green-600 text-sm";
        
        container.appendChild(subtotal);
        return container;
      },
    },
    {
      headerName: "Aksi",
      width: 100,
      minWidth: 90,
      maxWidth: 120,
      cellRenderer: (params: any) => {
        const container = document.createElement("div");
        container.className = "flex justify-center items-center gap-2 h-full";
        
        // DIRECT DELETE BUTTON - no dialog (for testing)
        const directBtn = document.createElement("button");
        directBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;
        directBtn.className = "text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-300";
        directBtn.title = "Hapus langsung";
        directBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          console.log(`DIRECT DELETE CLICKED: ${params.data?.id}`);
          if (params.data?.id) {
            removeItemDirect(params.data.id);
          }
        });
        
        // DIALOG DELETE BUTTON
        const dialogBtn = document.createElement("button");
        dialogBtn.innerHTML = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>`;
        dialogBtn.className = "text-orange-500 hover:text-orange-700 hover:bg-orange-50 p-1.5 rounded-lg transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-300";
        dialogBtn.title = "Hapus dengan dialog";
        dialogBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          console.log(`DIALOG DELETE CLICKED: ${params.data?.id}`);
          if (params.data?.id) {
            removeItem(params.data.id);
          }
        });
        
        container.appendChild(directBtn);
        container.appendChild(dialogBtn);
        return container;
      },
      sortable: false,
      pinned: 'right',
    },
  ];

  // Confirmation Dialog Component
  const ConfirmDialog = () => {
    const dialog = showConfirmDialog();
    
    if (!dialog.show) return null;

    return (
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        style="z-index: 9999;"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeDialog();
          }
        }}
      >
        <div 
          class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="bg-red-100 p-2 rounded-full">
              <AlertCircle class="w-5 h-5 text-red-600" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900">
              {dialog.type === 'clear' ? 'Kosongkan Keranjang?' : 'Hapus Barang?'}
            </h3>
          </div>
          
          <p class="text-gray-600 mb-6">
            {dialog.type === 'clear' 
              ? 'Semua barang akan dihapus dari keranjang. Tindakan ini tidak dapat dibatalkan.'
              : `Yakin ingin menghapus "${dialog.itemName}" dari keranjang?`
            }
          </p>
          
          <div class="flex gap-3">
            <button
              onClick={closeDialog}
              type="button"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-lg font-medium transition duration-200"
            >
              Batal
            </button>
            <button
              onClick={dialog.type === 'clear' ? confirmClearCart : confirmRemoveItem}
              type="button"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition duration-200"
            >
              {dialog.type === 'clear' ? 'Kosongkan' : 'Hapus'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Empty Cart Component
  const EmptyCart = () => (
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
      <div class="text-center">
        <div class="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart class="w-12 h-12 text-blue-500" />
        </div>
        <h3 class="text-2xl font-bold text-gray-700 mb-3">Keranjang Kosong</h3>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">
          Belum ada produk yang ditambahkan ke keranjang. Yuk mulai sewa peralatan yang Anda butuhkan!
        </p>
        <A
          href="/produk"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium"
        >
          <ShoppingCart class="w-5 h-5" />
          Mulai Belanja
        </A>
      </div>
    </div>
  );



  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6">
      <div class="max-w-7xl mx-auto px-4 space-y-6">
        
        {items().length > 0 ? (
          <>

            {/* HEADER */}
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                    <ShoppingCart class="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 class="text-2xl font-bold text-gray-800">Keranjang Belanja</h1>
                    <p class="text-gray-600 flex items-center gap-2">
                      <Package class="w-4 h-4" />
                      {items().length} produk dalam keranjang
                    </p>
                  </div>
                </div>
                
                <A
                  href="/produk"
                  class="hidden sm:inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <ArrowLeft class="w-4 h-4" />
                  Lanjut Belanja
                </A>
              </div>
            </div>

            {/* SELECT ALL SECTION */}
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCount() === items().length && items().length > 0}
                    onChange={selectAll}
                    class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                  <span class="font-semibold text-gray-800">
                    Pilih Semua Produk
                  </span>
                  <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedCount()}/{items().length}
                  </span>
                </div>
                
                {selectedCount() > 0 && (
                  <div class="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl border border-green-200">
                    <CheckCircle2 class="w-4 h-4 text-green-600" />
                    <span class="text-green-800 font-medium">
                      {selectedCount()} produk dipilih
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* TABLE SECTION */}
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div class="ag-theme-alpine" style={{ height: "600px", width: "100%" }}>
                <AgGridSolid
                  rowData={items()}
                  columnDefs={columnDefs}
                  domLayout="normal"
                  defaultColDef={{ 
                    sortable: true, 
                    resizable: true,
                    suppressSizeToFit: false,
                    cellStyle: { display: 'flex', alignItems: 'center' }
                  }}
                  suppressRowClickSelection={true}
                  rowHeight={80}
                  headerHeight={55}
                  enableRangeSelection={false}
                  enableCellTextSelection={false}
                  animateRows={true}
                />
              </div>
            </div>

            {/* SUMMARY & ACTIONS */}
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              
              {/* Mobile Back Link */}
              <div class="sm:hidden mb-4">
                <A
                  href="/produk"
                  class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  <ArrowLeft class="w-4 h-4" />
                  Lanjut belanja
                </A>
              </div>

              {/* Promo Banner */}
              <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                <div class="flex items-center gap-3">
                  <Gift class="w-5 h-5 text-green-600" />
                  <div class="flex-1">
                    <p class="text-green-800 font-medium text-sm">
                      🎉 Gratis asuransi kerusakan untuk sewa di atas 3 hari!
                    </p>
                  </div>
                </div>
              </div>

              {/* Totals & Actions */}
              <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 pt-6 border-t border-gray-200">
                
                {/* Total Info */}
                <div class="space-y-3">
                  <div class="flex items-center justify-between lg:justify-start lg:gap-8">
                    <span class="text-gray-600 flex items-center gap-2">
                      <Tag class="w-4 h-4" />
                      Total Keranjang:
                    </span>
                    <span class="font-bold text-xl text-gray-800">
                      Rp{cartTotal().toLocaleString("id-ID")}
                    </span>
                  </div>
                  
                  {selectedCount() > 0 && (
                    <div class="flex items-center justify-between lg:justify-start lg:gap-8">
                      <span class="text-blue-600 font-medium flex items-center gap-2">
                        <CheckCircle2 class="w-4 h-4" />
                        Barang dipilih:
                      </span>
                      <span class="font-bold text-xl text-blue-600">
                        Rp{selectedTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  
                  <div class="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar class="w-4 h-4" />
                    Estimasi durasi sewa berdasarkan hari yang dipilih
                  </div>
                </div>

                {/* Action Buttons */}
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCheckout}
                    disabled={selectedCount() === 0}
                    class="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium text-lg disabled:transform-none"
                  >
                    <Package class="w-5 h-5" />
                    Checkout ({selectedCount()}) - Rp{selectedTotal().toLocaleString("id-ID")}
                  </button>
                </div>

              </div>
            </div>

          </>
        ) : (
          <EmptyCart />
        )}

        <ConfirmDialog />

        {/* CUSTOM STYLES */}
        <style>
          {`
            .ag-theme-alpine {
              --ag-header-height: 55px;
              --ag-row-height: 80px;
              --ag-border-color: #e5e7eb;
              --ag-header-background-color: #1e40af;
              --ag-header-foreground-color: white;
              --ag-odd-row-background-color: #f8fafc;
              --ag-row-hover-color: #e0f2fe;
              --ag-selected-row-background-color: #dbeafe;
              --ag-font-family: inherit;
              --ag-font-size: 14px;
              border-radius: 0;
            }
            
            .ag-theme-alpine .ag-header {
              font-weight: 600;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .ag-theme-alpine .ag-header-cell {
              padding: 0 12px;
            }
            
            .ag-theme-alpine .ag-cell {
              border-right: 1px solid #f1f5f9;
              display: flex;
              align-items: center;
              padding: 0 12px;
            }
            
            .ag-theme-alpine .ag-row {
              border-bottom: 1px solid #f1f5f9;
            }
            
            .ag-theme-alpine .ag-row:hover {
              background-color: var(--ag-row-hover-color);
              transform: translateY(-1px);
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .ag-theme-alpine .ag-cell-focus {
              border: 2px solid #3b82f6 !important;
            }
            
            .ag-theme-alpine .ag-cell.ag-cell-inline-editing {
              background-color: #fff7ed;
              border: 2px solid #fb923c;
            }
            
            .ag-theme-alpine .ag-pinned-left-cols-container,
            .ag-theme-alpine .ag-pinned-right-cols-container {
              background-color: #f9fafb;
            }
            
            @media (max-width: 768px) {
              .ag-theme-alpine {
                --ag-header-height: 50px;
                --ag-row-height: 70px;
                --ag-font-size: 13px;
              }
              
              .ag-theme-alpine .ag-header-cell,
              .ag-theme-alpine .ag-cell {
                padding: 0 6px;
              }
            }
            
            .line-clamp-2 {
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          `}
        </style>
      </div>
    </div>
  );
}