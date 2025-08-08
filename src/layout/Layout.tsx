import { createSignal, JSX, Show, For, onMount, createEffect} from "solid-js";
import { A, useLocation } from "@solidjs/router";
import {
  Home, ShoppingCart, Package, Clock, Menu, Bell, X, Star, ChevronDown, ChevronUp, 
  User, Settings, LogOut, Edit3, Shield, HelpCircle
} from "lucide-solid";

type LayoutProps = {
  children: JSX.Element;
};

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const notifCount = () => notifList().length;
  const [showNotif, setShowNotif] = createSignal(false);
  const [showProfile, setShowProfile] = createSignal(false);
  const [openMenus, setOpenMenus] = createSignal<string[]>([]);
  const [toastMessage, setToastMessage] = createSignal("");
  const [toastIcon, setToastIcon] = createSignal("");
  const [showEditModal, setShowEditModal] = createSignal(false);
  const [editName, setEditName] = createSignal("");
  const [editEmail, setEditEmail] = createSignal("");
  const [editPhone, setEditPhone] = createSignal("");
  const [notifList, setNotifList] = createSignal<string[]>([]);
  
  // State untuk jam dan tanggal real-time
  const [currentTime, setCurrentTime] = createSignal("");
  const [currentDate, setCurrentDate] = createSignal("");

  // Update jam dan tanggal setiap detik
  onMount(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const dateString = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    // Update immediately
    updateDateTime();
    
    // Update every second
    const interval = setInterval(updateDateTime, 1000);
    
    // Cleanup
    return () => clearInterval(interval);
  });

  // Ambil notifikasi dari localStorage saat halaman dimuat
  onMount(() => {
    const saved = JSON.parse(localStorage.getItem("notifikasi") || "[]");
    setNotifList(saved);
    
    // Tambah beberapa notifikasi contoh jika kosong
    if (saved.length === 0) {
      const defaultNotifs = [
        "🎉 Selamat datang di CampRent!",
        "📦 Pesanan Anda sedang diproses",
        "⏰ Jangan lupa cek keranjang Anda"
      ];
      setNotifList(defaultNotifs);
      localStorage.setItem("notifikasi", JSON.stringify(defaultNotifs));
    }
  });

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  function showToast(msg: string, icon = "✅") {
    setToastMessage(msg);
    setToastIcon(icon);
    setTimeout(() => setToastMessage(""), 3000);
  }

  const openEditModal = () => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setEditName(user.name || "");
    setEditEmail(user.email || "");
    setEditPhone(user.phone || "");
    setShowEditModal(true);
  };

  const saveProfile = () => {
    const updatedUser = {
      name: editName(),
      email: editEmail(),
      phone: editPhone()
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setShowEditModal(false);
    showToast("Profil berhasil diperbarui!", "✅");
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home class="w-5 h-5" />,
      link: "/dashboard"
    },
    {
      id: "produk",
      label: "Produk",
      icon: <ShoppingCart class="w-5 h-5" />,
      children: [
        { label: "Daftar Produk", link: "/produk" },
        { label: "Detail Produk", link: "/produk/detail/1" },
      ]
    },
    {
      id: "keranjang",
      label: "Keranjang",
      icon: <Package class="w-5 h-5" />,
      children: [
        { label: "Keranjang", link: "/keranjang" },
        { label: "Checkout", link: "/checkout" },
      ]
    },
    {
      id: "riwayat",
      label: "Riwayat",
      icon: <Clock class="w-5 h-5" />,
      children: [
        { label: "Riwayat", link: "/riwayat" },
        { label: "Tracking", link: "/tracking/1" },
      ]
    },
    {
      id: "ulasan",
      label: "Ulasan",
      icon: <Star class="w-5 h-5" />,
      link: "/semuaulasan"
    },
  ];

  const addNotifikasi = (pesan: string) => {
    const updated = [pesan, ...notifList()];
    setNotifList(updated);
    localStorage.setItem("notifikasi", JSON.stringify(updated));
  };

  const clearNotifikasi = () => {
    setNotifList([]);
    localStorage.removeItem("notifikasi");
    showToast("Semua notifikasi dihapus", "🗑️");
  };

  const markAsRead = (index: number) => {
    const updated = notifList().filter((_, i) => i !== index);
    setNotifList(updated);
    localStorage.setItem("notifikasi", JSON.stringify(updated));
    showToast("Notifikasi dibaca", "👁️");
  };

  // Close dropdowns when clicking outside
  createEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showNotif() || showProfile()) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setShowNotif(false);
          setShowProfile(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-[#CDE8FF] to-[#FFF0DA] p-4">
      <div class="flex flex-col md:flex-row h-[calc(100vh-2rem)] rounded-2xl overflow-hidden shadow-xl">

        {/* Mobile Topbar */}
        <div class="md:hidden flex justify-between items-center text-[#3F3F3F] bg-gradient-to-r from-[#E0D4FD] to-[#CDE8FF] px-4 py-3 rounded-t-xl">
          <span class="font-bold text-lg">CampRent</span>
          <div class="flex items-center gap-2">
            <div class="text-xs text-center">
              <div class="font-semibold">{currentTime()}</div>
              <div class="text-[10px] opacity-75">{currentDate().split(',')[0]}</div>
            </div>
            <button onClick={() => setSidebarOpen(true)}>
              <Menu />
            </button>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <Show when={sidebarOpen()}>
          <div class="fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
          <aside class="fixed top-0 left-0 w-64 h-full bg-gradient-to-b from-[#E0D4FD] to-[#CDE8FF] text-[#3F3F3F] z-50 shadow-lg p-4 overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
              <span class="text-xl font-bold">CampRent</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X />
              </button>
            </div>
            <nav class="flex flex-col gap-y-4 mt-10">
              {navItems.map((item) => {
                const isActive = location.pathname === item.link;
                const isOpen = openMenus().includes(item.id);
                return item.children ? (
                  <div class="flex flex-col gap-1">
                    <button
                      type="button"
                      class="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold w-full text-left hover:bg-white/10 justify-between transition-all"
                      onClick={() => toggleMenu(item.id)}
                    >
                      <div class="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {isOpen ? <ChevronUp class="w-4 h-4" /> : <ChevronDown class="w-4 h-4" />}
                    </button>
                    <Show when={isOpen}>
                      <div class="ml-8 flex flex-col gap-1">
                        {item.children.map((sub) => (
                          <A
                            href={sub.link}
                            onClick={() => setSidebarOpen(false)}
                            class={`text-sm px-3 py-1 rounded-lg hover:bg-white/20 transition-all ${location.pathname === sub.link ? "bg-white/20 font-medium" : ""}`}
                          >
                            {sub.label}
                          </A>
                        ))}
                      </div>
                    </Show>
                  </div>
                ) : (
                  <A
                    href={item.link}
                    onClick={() => setSidebarOpen(false)}
                    class={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                      isActive ? "bg-white/20 font-medium" : "hover:bg-white/10"
                    }`}
                  >
                    <span class={`w-1 h-5 bg-[#F4A6B8] rounded ${isActive ? "opacity-100" : "opacity-0"}`} />
                    {item.icon}
                    <span>{item.label}</span>
                  </A>
                );
              })}
            </nav>
          </aside>
        </Show>

        {/* Desktop Sidebar */}
        <aside class="hidden md:flex md:flex-col bg-gradient-to-b from-[#E0D4FD] to-[#CDE8FF] text-[#3F3F3F] w-20 hover:w-64 transition-all duration-300 p-4 gap-4 group">
          <div class="text-xl font-bold bg-[#F4A6B8] rounded-lg px-3 py-1 text-white hidden group-hover:block">
            CampRent
          </div>
          <div class="text-xl font-bold bg-[#F4A6B8] rounded-lg p-2 text-white block group-hover:hidden">
            CR
          </div>
          <nav class="flex-1 flex flex-col gap-y-4 mt-10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.link;
              const isOpen = openMenus().includes(item.id);
              return item.children ? (
                <div class="flex flex-col gap-1">
                  <button
                    type="button"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold w-full text-left hover:bg-white/10 justify-between transition-all"
                    onClick={() => toggleMenu(item.id)}
                  >
                    <div class="flex items-center gap-3">
                      {item.icon}
                      <span class="hidden group-hover:inline">{item.label}</span>
                    </div>
                    <span class="hidden group-hover:inline">
                      {isOpen ? <ChevronUp class="w-4 h-4" /> : <ChevronDown class="w-4 h-4" />}
                    </span>
                  </button>
                  <Show when={isOpen}>
                    <div class="ml-6 flex flex-col gap-1">
                      {item.children.map((sub) => (
                        <A
                          href={sub.link}
                          class={`text-sm px-3 py-1 rounded-lg hover:bg-white/20 transition-all ${location.pathname === sub.link ? "bg-white/20 font-medium" : ""}`}
                        >
                          {sub.label}
                        </A>
                      ))}
                    </div>
                  </Show>
                </div>
              ) : (
                <A
                  href={item.link}
                  class={`relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive ? "bg-white/20 font-medium" : "hover:bg-white/10"
                  }`}
                >
                  <span class={`absolute left-0 top-2 bottom-2 w-1 bg-[#F4A6B8] rounded ${isActive ? "opacity-100" : "opacity-0"}`} />
                  {item.icon}
                  <span class="hidden group-hover:inline">{item.label}</span>
                </A>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div class="flex-1 flex flex-col bg-white/90 backdrop-blur rounded-r-2xl h-full min-h-0">
          <header class="h-20 flex justify-between items-center px-6 border-b border-black/10 relative">
            <div>
              <h1 class="text-xl font-semibold text-[#3F3F3F] capitalize">
                {location.pathname.replace("/", "") || "Dashboard"}
              </h1>
              <p class="text-sm text-gray-500">Selamat datang kembali 👋</p>
            </div>
            <div class="flex items-center gap-6 relative">
              {/* Real-time Clock & Date */}
              <div class="hidden md:flex flex-col items-center px-4 py-2 bg-gradient-to-r from-[#E0D4FD] to-[#CDE8FF] rounded-lg shadow-inner">
                <div class="text-lg font-bold text-[#3F3F3F] tabular-nums">
                  {currentTime()}
                </div>
                <div class="text-xs text-gray-600 text-center leading-tight">
                  {currentDate()}
                </div>
              </div>

              {/* Enhanced Notifications */}
              <div class="relative" data-dropdown>
                <button
                  class="relative w-12 h-12 rounded-xl bg-gradient-to-r from-[#F4A6B8] to-[#E91E63] text-white hover:shadow-lg transition-all transform hover:scale-105"
                  onClick={() => setShowNotif((prev) => !prev)}
                >
                  <Bell class="mx-auto w-5 h-5" />
                  <Show when={notifCount() > 0}>
                    <span class="absolute -top-1 -right-1 bg-white text-[#F4A6B8] text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                      {notifCount()}
                    </span>
                  </Show>
                </button>
                
                <Show when={showNotif()}>
                  <div class="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-xl overflow-hidden z-30 border border-gray-100">
                    <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#F4A6B8] to-[#E91E63] text-white">
                      <div class="flex items-center gap-2">
                        <Bell class="w-4 h-4" />
                        <span class="font-semibold">Notifikasi</span>
                        <span class="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                          {notifCount()}
                        </span>
                      </div>
                      <button
                        class="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition"
                        onClick={clearNotifikasi}
                      >
                        Hapus Semua
                      </button>
                    </div>
                    <div class="max-h-64 overflow-y-auto">
                      <Show
                        when={notifList().length > 0}
                        fallback={
                          <div class="px-4 py-8 text-center text-gray-400">
                            <Bell class="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Tidak ada notifikasi</p>
                          </div>
                        }
                      >
                        <For each={notifList()}>
                          {(notif, index) => (
                            <div class="px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
                              <div class="flex items-start justify-between gap-3">
                                <p class="text-sm text-gray-700 flex-1 leading-relaxed">{notif}</p>
                                <button
                                  class="text-xs text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                                  onClick={() => markAsRead(index())}
                                >
                                  Tandai Dibaca
                                </button>
                              </div>
                              <div class="text-xs text-gray-400 mt-1">
                                Baru saja
                              </div>
                            </div>
                          )}
                        </For>
                      </Show>
                    </div>
                  </div>
                </Show>
              </div>

              {/* Enhanced Profile */}
              <div class="relative" data-dropdown>
                <div
                  class="w-12 h-12 bg-gradient-to-r from-[#CDE8FF] to-[#2196F3] rounded-xl flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg transition-all transform hover:scale-105"
                  onClick={() => setShowProfile((prev) => !prev)}
                >
                  <User class="w-6 h-6" />
                </div>
                
                <Show when={showProfile()}>
                  <div class="absolute right-0 mt-3 w-72 bg-white shadow-2xl rounded-xl overflow-hidden z-30 border border-gray-100">
                    <div class="px-4 py-4 bg-gradient-to-r from-[#CDE8FF] to-[#2196F3] text-white">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <User class="w-6 h-6" />
                        </div>
                        <div>
                          <h3 class="font-semibold">
                            {JSON.parse(localStorage.getItem("currentUser") || "{}").name || "Admin User"}
                          </h3>
                          <p class="text-sm opacity-90">
                            {JSON.parse(localStorage.getItem("currentUser") || "{}").email || "admin@camprent.com"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div class="py-2">
                      <button
                        class="w-full px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors"
                        onClick={openEditModal}
                      >
                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Edit3 class="w-4 h-4 text-blue-600" />
                        </div>
                        <div class="text-left">
                          <div class="font-medium text-sm">Edit Profil</div>
                          <div class="text-xs text-gray-500">Ubah data pribadi Anda</div>
                        </div>
                      </button>
                      
                      <button
                        class="w-full px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors"
                        onClick={() => showToast("Fitur dalam pengembangan", "⚙️")}
                      >
                        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <Settings class="w-4 h-4 text-green-600" />
                        </div>
                        <div class="text-left">
                          <div class="font-medium text-sm">Pengaturan</div>
                          <div class="text-xs text-gray-500">Kelola preferensi akun</div>
                        </div>
                      </button>
                      
                      <button
                        class="w-full px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors"
                        onClick={() => showToast("Fitur bantuan akan segera hadir", "💬")}
                      >
                        <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <HelpCircle class="w-4 h-4 text-purple-600" />
                        </div>
                        <div class="text-left">
                          <div class="font-medium text-sm">Bantuan</div>
                          <div class="text-xs text-gray-500">Pusat bantuan dan FAQ</div>
                        </div>
                      </button>
                      
                      <div class="border-t border-gray-100 mt-2">
                        <button
                          class="w-full px-4 py-3 hover:bg-red-50 cursor-pointer flex items-center gap-3 text-red-600 transition-colors"
                          onClick={() => {
                            localStorage.removeItem("currentUser");
                            showToast("Berhasil logout!", "👋");
                            setTimeout(() => window.location.href = "/Login", 1500);
                          }}
                        >
                          <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <LogOut class="w-4 h-4 text-red-600" />
                          </div>
                          <div class="text-left">
                            <div class="font-medium text-sm">Logout</div>
                            <div class="text-xs text-red-400">Keluar dari akun</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main class="flex-1 overflow-y-auto p-4 md:p-6 h-full min-h-0">{children}</main>
        </div>
      </div>

      {/* Enhanced Toast */}
      <Show when={toastMessage()}>
        <div class="fixed top-6 right-6 bg-white text-gray-800 px-6 py-4 rounded-xl shadow-2xl z-50 border-l-4 border-[#F4A6B8] flex items-center gap-3 animate-slide-in-right min-w-[300px]">
          <div class="w-8 h-8 bg-[#F4A6B8] rounded-lg flex items-center justify-center text-white">
            <span class="text-sm">{toastIcon()}</span>
          </div>
          <div>
            <div class="font-semibold text-sm">{toastMessage()}</div>
            <div class="text-xs text-gray-500">Notifikasi sistem</div>
          </div>
        </div>
      </Show>

      {/* Enhanced Edit Modal */}
      <Show when={showEditModal()}>
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl relative animate-scale-in">
            <div class="bg-gradient-to-r from-[#CDE8FF] to-[#2196F3] text-white p-6 rounded-t-2xl">
              <h2 class="text-xl font-bold flex items-center gap-2">
                <Edit3 class="w-5 h-5" />
                Edit Profil
              </h2>
              <p class="text-sm opacity-90 mt-1">Perbarui informasi pribadi Anda</p>
            </div>
            
            <div class="p-6 space-y-4">
              <div>
                <label class="text-sm font-semibold text-gray-700 block mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  class="w-full border-2 border-gray-200 focus:border-[#2196F3] p-3 rounded-lg transition-colors outline-none"
                  placeholder="Masukkan nama lengkap"
                  value={editName()}
                  onInput={(e) => setEditName(e.currentTarget.value)}
                />
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-700 block mb-2">Email</label>
                <input
                  type="email"
                  class="w-full border-2 border-gray-200 focus:border-[#2196F3] p-3 rounded-lg transition-colors outline-none"
                  placeholder="Masukkan email"
                  value={editEmail()}
                  onInput={(e) => setEditEmail(e.currentTarget.value)}
                />
              </div>

              <div>
                <label class="text-sm font-semibold text-gray-700 block mb-2">No. Telepon</label>
                <input
                  type="tel"
                  class="w-full border-2 border-gray-200 focus:border-[#2196F3] p-3 rounded-lg transition-colors outline-none"
                  placeholder="Masukkan nomor telepon"
                  value={editPhone()}
                  onInput={(e) => setEditPhone(e.currentTarget.value)}
                />
              </div>
            </div>

            <div class="flex gap-3 p-6 pt-0">
              <button 
                onClick={() => setShowEditModal(false)} 
                class="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 font-semibold transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={saveProfile} 
                class="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </Show>


    </div>
  );
}