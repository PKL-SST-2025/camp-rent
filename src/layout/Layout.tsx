import { createSignal, JSX, Show, For, onMount, createEffect} from "solid-js";
import { A, useLocation } from "@solidjs/router";
import {
  Home, ShoppingCart, Package, Clock, Menu, Bell, X, Star, ChevronDown, ChevronUp, 
  User, Settings, LogOut, Edit3, Shield, HelpCircle, Phone, Mail, MessageSquare,
  Lock, Palette, Globe, Volume2, Eye, Smartphone, Monitor, Moon, Sun,
  BookOpen, FileText, MessageCircle, AlertCircle
} from "lucide-solid";

type LayoutProps = {
  children: JSX.Element;
};

// Global notification system
declare global {
  interface Window {
    addNotification?: (message: string, type?: string) => void;
  }
}

if (typeof window !== 'undefined') {
  window.addNotification = window.addNotification || ((message: string, type: string = 'info') => {
    const event = new CustomEvent('newNotification', { 
      detail: { message, type, timestamp: new Date().toISOString() } 
    });
    window.dispatchEvent(event);
  });
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const notifCount = () => notifList().length;
  const [showNotif, setShowNotif] = createSignal(false);
  const [showProfile, setShowProfile] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [showHelp, setShowHelp] = createSignal(false);
  const [openMenus, setOpenMenus] = createSignal<string[]>([]);
  const [toastMessage, setToastMessage] = createSignal("");
  const [toastIcon, setToastIcon] = createSignal("");
  const [showEditModal, setShowEditModal] = createSignal(false);
  const [editName, setEditName] = createSignal("");
  const [editEmail, setEditEmail] = createSignal("");
  const [editPhone, setEditPhone] = createSignal("");
  const [notifList, setNotifList] = createSignal<{message: string, type: string, timestamp: string, id: string}[]>([]);
  
  // Settings state
  const [darkMode, setDarkMode] = createSignal(false);
  const [notifications, setNotifications] = createSignal(true);
  const [soundEnabled, setSoundEnabled] = createSignal(true);
  const [language, setLanguage] = createSignal('id');
  
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
    
    // Load settings
    const savedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    setDarkMode(savedSettings.darkMode || false);
    setNotifications(savedSettings.notifications !== false);
    setSoundEnabled(savedSettings.soundEnabled !== false);
    setLanguage(savedSettings.language || 'id');
    
    // Tambah beberapa notifikasi contoh jika kosong
    if (saved.length === 0) {
      const defaultNotifs = [
        {
          message: "🎉 Selamat datang di CampRent!",
          type: "welcome",
          timestamp: new Date().toISOString(),
          id: "welcome-1"
        },
        {
          message: "📦 Sistem telah diperbarui dengan fitur baru",
          type: "system",
          timestamp: new Date().toISOString(),
          id: "system-1"
        }
      ];
      setNotifList(defaultNotifs);
      localStorage.setItem("notifikasi", JSON.stringify(defaultNotifs));
    }

    // Listen for global notifications
    const handleNewNotification = (event: Event) => {
      const customEvent = event as CustomEvent<{message: string, type: string, timestamp: string}>;
      const { message, type, timestamp } = customEvent.detail;
      const newNotif = {
        message,
        type,
        timestamp,
        id: `notif-${Date.now()}-${Math.random()}`
      };
      
      const updated = [newNotif, ...notifList()];
      setNotifList(updated);
      localStorage.setItem("notifikasi", JSON.stringify(updated));
      
      if (soundEnabled() && notifications()) {
        // Play notification sound (if available)
        try {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSMFl');
          audio.volume = 0.1;
          audio.play().catch(() => {});
        } catch (e) {}
      }
    };

    window.addEventListener('newNotification', handleNewNotification);
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification);
    };
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
    
    // Add notification
    if (typeof window !== 'undefined' && window.addNotification) {
      window.addNotification("Profil Anda telah berhasil diperbarui", "profile");
    }
  };

  const saveSettings = () => {
    const settings = {
      darkMode: darkMode(),
      notifications: notifications(),
      soundEnabled: soundEnabled(),
      language: language()
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setShowSettings(false);
    showToast("Pengaturan berhasil disimpan!", "⚙️");
    
    // Add notification
    if (typeof window !== 'undefined' && window.addNotification) {
      window.addNotification("Pengaturan sistem telah disimpan", "settings");
    }
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

  const clearNotifikasi = () => {
    setNotifList([]);
    localStorage.removeItem("notifikasi");
    showToast("Semua notifikasi dihapus", "🗑️");
  };

  const markAsRead = (id: string) => {
    const updated = notifList().filter((notif) => notif.id !== id);
    setNotifList(updated);
    localStorage.setItem("notifikasi", JSON.stringify(updated));
    showToast("Notifikasi dibaca", "👁️");
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'product': return '🛍️';
      case 'cart': return '🛒';
      case 'checkout': return '💳';
      case 'order': return '📦';
      case 'tracking': return '🚚';
      case 'review': return '⭐';
      case 'system': return '⚙️';
      case 'welcome': return '🎉';
      case 'profile': return '👤';
      case 'settings': return '⚙️';
      default: return '🔔';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} jam yang lalu`;
    return date.toLocaleDateString('id-ID');
  };

  // Close dropdowns when clicking outside
  createEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showNotif() || showProfile() || showSettings() || showHelp()) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setShowNotif(false);
          setShowProfile(false);
          setShowSettings(false);
          setShowHelp(false);
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
                          {(notif) => (
                            <div class="px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
                              <div class="flex items-start justify-between gap-3">
                                <div class="flex gap-2 flex-1">
                                  <span class="text-lg flex-shrink-0 mt-0.5">{getNotifIcon(notif.type)}</span>
                                  <div class="flex-1">
                                    <p class="text-sm text-gray-700 leading-relaxed">{notif.message}</p>
                                    <div class="text-xs text-gray-400 mt-1">
                                      {formatTime(notif.timestamp)}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  class="text-xs text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap flex-shrink-0"
                                  onClick={() => markAsRead(notif.id)}
                                >
                                  Tandai Dibaca
                                </button>
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
                        onClick={() => setShowSettings(true)}
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
                        onClick={() => setShowHelp(true)}
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

      {/* Settings Modal */}
      <Show when={showSettings()}>
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative animate-scale-in max-h-[90vh] overflow-hidden">
            <div class="bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white p-6 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Settings class="w-6 h-6" />
                  <div>
                    <h2 class="text-xl font-bold">Pengaturan</h2>
                    <p class="text-sm opacity-90">Kelola preferensi aplikasi Anda</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div class="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Appearance Settings */}
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Palette class="w-5 h-5 text-purple-600" />
                  Tampilan
                </h3>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    {darkMode() ? <Moon class="w-5 h-5 text-indigo-600" /> : <Sun class="w-5 h-5 text-yellow-600" />}
                    <div>
                      <div class="font-medium">Mode Gelap</div>
                      <div class="text-sm text-gray-500">Aktifkan tema gelap untuk mata yang lebih nyaman</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode())}
                    class={`w-12 h-6 rounded-full transition-colors relative ${darkMode() ? 'bg-indigo-600' : 'bg-gray-300'}`}
                  >
                    <div class={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${darkMode() ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3 mb-3">
                    <Globe class="w-5 h-5 text-blue-600" />
                    <div>
                      <div class="font-medium">Bahasa</div>
                      <div class="text-sm text-gray-500">Pilih bahasa interface</div>
                    </div>
                  </div>
                  <select
                    value={language()}
                    onChange={(e) => setLanguage(e.currentTarget.value)}
                    class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                    <option value="ms">Bahasa Malaysia</option>
                  </select>
                </div>
              </div>

              {/* Notification Settings */}
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Bell class="w-5 h-5 text-red-600" />
                  Notifikasi
                </h3>
                
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <Bell class="w-5 h-5 text-red-600" />
                    <div>
                      <div class="font-medium">Notifikasi Push</div>
                      <div class="text-sm text-gray-500">Terima notifikasi untuk aktivitas penting</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications())}
                    class={`w-12 h-6 rounded-full transition-colors relative ${notifications() ? 'bg-red-600' : 'bg-gray-300'}`}
                  >
                    <div class={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${notifications() ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <Volume2 class="w-5 h-5 text-green-600" />
                    <div>
                      <div class="font-medium">Suara Notifikasi</div>
                      <div class="text-sm text-gray-500">Putar suara saat menerima notifikasi</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled())}
                    class={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled() ? 'bg-green-600' : 'bg-gray-300'}`}
                  >
                    <div class={`w-5 h-5 bg-white rounded-full transition-transform absolute top-0.5 ${soundEnabled() ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Privacy & Security */}
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Shield class="w-5 h-5 text-orange-600" />
                  Privasi & Keamanan
                </h3>
                
                <div class="space-y-2">
                  <button class="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <div class="flex items-center gap-3">
                      <Lock class="w-5 h-5 text-orange-600" />
                      <div>
                        <div class="font-medium">Ubah Password</div>
                        <div class="text-sm text-gray-500">Update password untuk keamanan akun</div>
                      </div>
                    </div>
                  </button>
                  
                  <button class="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                    <div class="flex items-center gap-3">
                      <Eye class="w-5 h-5 text-orange-600" />
                      <div>
                        <div class="font-medium">Privasi Data</div>
                        <div class="text-sm text-gray-500">Kelola bagaimana data Anda digunakan</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Device Settings */}
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Smartphone class="w-5 h-5 text-cyan-600" />
                  Perangkat
                </h3>
                
                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3 mb-2">
                    <Monitor class="w-5 h-5 text-cyan-600" />
                    <div class="font-medium">Perangkat Terdaftar</div>
                  </div>
                  <div class="text-sm text-gray-600">
                    Browser saat ini - Chrome di Windows
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Terakhir aktif: Hari ini, {currentTime()}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3 p-6 pt-0 border-t border-gray-100">
              <button 
                onClick={() => setShowSettings(false)} 
                class="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 font-semibold transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={saveSettings} 
                class="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] text-white font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]"
              >
                Simpan Pengaturan
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Help Modal */}
      <Show when={showHelp()}>
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative animate-scale-in max-h-[90vh] overflow-hidden">
            <div class="bg-gradient-to-r from-[#9C27B0] to-[#6A1B9A] text-white p-6 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <HelpCircle class="w-6 h-6" />
                  <div>
                    <h2 class="text-xl font-bold">Pusat Bantuan</h2>
                    <p class="text-sm opacity-90">Temukan jawaban untuk pertanyaan Anda</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowHelp(false)}
                  class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div class="p-6 overflow-y-auto max-h-[75vh]">
              <div class="grid md:grid-cols-2 gap-6">
                {/* FAQ Section */}
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <BookOpen class="w-5 h-5 text-blue-600" />
                    Pertanyaan Umum (FAQ)
                  </h3>
                  
                  <div class="space-y-3">
                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                      <button class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div class="font-medium text-gray-800">Bagaimana cara menyewa peralatan camping?</div>
                      </button>
                      <div class="p-4 text-sm text-gray-600 bg-white">
                        Pilih produk yang diinginkan, tentukan tanggal sewa, masukkan ke keranjang, dan lakukan checkout. Tim kami akan mengkonfirmasi pesanan Anda.
                      </div>
                    </div>
                    
                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                      <button class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div class="font-medium text-gray-800">Bagaimana sistem pembayaran?</div>
                      </button>
                      <div class="p-4 text-sm text-gray-600 bg-white">
                        Kami menerima pembayaran melalui transfer bank, e-wallet, dan kartu kredit. Pembayaran DP 50% saat booking, sisanya saat pengambilan barang.
                      </div>
                    </div>
                    
                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                      <button class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div class="font-medium text-gray-800">Bagaimana jika barang rusak/hilang?</div>
                      </button>
                      <div class="p-4 text-sm text-gray-600 bg-white">
                        Kerusakan ringan sudah tercover dalam biaya sewa. Untuk kerusakan berat/kehilangan, akan dikenakan biaya sesuai dengan nilai barang.
                      </div>
                    </div>
                    
                    <div class="border border-gray-200 rounded-lg overflow-hidden">
                      <button class="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div class="font-medium text-gray-800">Apakah bisa delivery dan pickup?</div>
                      </button>
                      <div class="p-4 text-sm text-gray-600 bg-white">
                        Ya, kami menyediakan layanan antar-jemput dengan biaya tambahan sesuai jarak. Atau Anda bisa ambil langsung di toko kami.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact & Support */}
                <div class="space-y-4">
                  <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MessageCircle class="w-5 h-5 text-green-600" />
                    Kontak & Dukungan
                  </h3>
                  
                  <div class="space-y-3">
                    <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div class="flex items-center gap-3">
                        <Phone class="w-5 h-5 text-green-600" />
                        <div>
                          <div class="font-medium text-green-800">Telepon</div>
                          <div class="text-sm text-green-600">+62 812-3456-7890</div>
                          <div class="text-xs text-green-500">Senin - Minggu: 08:00 - 21:00</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div class="flex items-center gap-3">
                        <Mail class="w-5 h-5 text-blue-600" />
                        <div>
                          <div class="font-medium text-blue-800">Email</div>
                          <div class="text-sm text-blue-600">support@camprent.com</div>
                          <div class="text-xs text-blue-500">Respon dalam 24 jam</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div class="flex items-center gap-3">
                        <MessageSquare class="w-5 h-5 text-purple-600" />
                        <div>
                          <div class="font-medium text-purple-800">Live Chat</div>
                          <div class="text-sm text-purple-600">Chat langsung dengan CS</div>
                          <div class="text-xs text-purple-500">Online 24/7</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div class="mt-6 space-y-3">
                    <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                      <AlertCircle class="w-4 h-4 text-orange-600" />
                      Aksi Cepat
                    </h4>
                    
                    <div class="grid gap-2">
                      <button 
                        onClick={() => {
                          setShowHelp(false);
                          showToast("Menghubungkan ke live chat...", "💬");
                        }}
                        class="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        🔗 Hubungkan ke Live Chat
                      </button>
                      
                      <button 
                        onClick={() => {
                          setShowHelp(false);
                          showToast("Membuka panduan lengkap...", "📖");
                        }}
                        class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        📖 Buka Panduan Lengkap
                      </button>
                      
                      <button 
                        onClick={() => {
                          setShowHelp(false);
                          showToast("Mengirim laporan masalah...", "🐛");
                        }}
                        class="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        🐛 Laporkan Masalah
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Knowledge Base */}
              <div class="mt-8 pt-6 border-t border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <FileText class="w-5 h-5 text-indigo-600" />
                  Panduan & Tutorial
                </h3>
                
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div class="text-indigo-600 font-medium mb-2">🏕️ Panduan Pemula</div>
                    <div class="text-sm text-gray-600">Tips memilih peralatan camping yang tepat untuk pemula</div>
                  </div>
                  
                  <div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div class="text-green-600 font-medium mb-2">💳 Cara Pembayaran</div>
                    <div class="text-sm text-gray-600">Langkah-langkah melakukan pembayaran dengan mudah</div>
                  </div>
                  
                  <div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div class="text-orange-600 font-medium mb-2">📋 Syarat & Ketentuan</div>
                    <div class="text-sm text-gray-600">Ketentuan sewa dan kebijakan CampRent</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 p-6 pt-0 border-t border-gray-100">
              <button 
                onClick={() => setShowHelp(false)} 
                class="px-6 py-3 rounded-lg bg-gradient-to-r from-[#9C27B0] to-[#6A1B9A] text-white font-semibold hover:shadow-lg transition-all transform hover:scale-[1.02]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}