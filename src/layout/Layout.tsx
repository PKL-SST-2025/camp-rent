import { createSignal, JSX, Show, For, onMount} from "solid-js";
import { A, useLocation } from "@solidjs/router";
import {
  Home, ShoppingCart, Package, Clock, Menu, Bell, X, Star, ChevronDown, ChevronUp
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
  const [notifList, setNotifList] = createSignal<string[]>([]);



// Ambil notifikasi dari localStorage saat halaman dimuat
onMount(() => {
  const saved = JSON.parse(localStorage.getItem("notifikasi") || "[]");
  setNotifList(saved);
});

  


  const toggleMenu = (id: string) => {
    setOpenMenus((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    
  };
  function showToast(msg: string, icon = "✅") {
  setToastMessage(msg);
  setToastIcon(icon);
  setTimeout(() => setToastMessage(""), 2000);
}
const openEditModal = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
  setEditName(user.name || "");
  setEditEmail(user.email || "");
  setShowEditModal(true);
};

const saveProfile = () => {
  const updatedUser = {
    name: editName(),
    email: editEmail()
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
    link: "/semuaulasan" // <— arahkan langsung ke halaman semua ulasan
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
};


  return (
    <div class="min-h-screen bg-gradient-to-br from-[#CDE8FF] to-[#FFF0DA] p-4">
      <div class="flex flex-col md:flex-row h-[calc(100vh-2rem)] rounded-2xl overflow-hidden shadow-xl">

        {/* Mobile Topbar */}
        <div class="md:hidden flex justify-between items-center text-[#3F3F3F] bg-gradient-to-r from-[#E0D4FD] to-[#CDE8FF] px-4 py-3 rounded-t-xl">
          <span class="font-bold text-lg">CampRent</span>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
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
                      class="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold w-full text-left hover:bg-white/10 justify-between"
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
                            class={`text-sm px-3 py-1 rounded-lg hover:bg-white/20 transition ${location.pathname === sub.link ? "bg-white/20" : ""}`}
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
                    class={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                      isActive ? "bg-white/20" : "hover:bg-white/10"
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
                    class="flex items-center gap-3 px-3 py-2 rounded-lg font-semibold w-full text-left hover:bg-white/10 justify-between"
                    onClick={() => toggleMenu(item.id)}
                  >
                    <div class="flex items-center gap-3">
                      {item.icon}
                      <span class="hidden group-hover:inline">{item.label}</span>
                    </div>
                    {isOpen ? <ChevronUp class="w-4 h-4" /> : <ChevronDown class="w-4 h-4" />}
                  </button>
                  <Show when={isOpen}>
                    <div class="ml-6 flex flex-col gap-1">
                      {item.children.map((sub) => (
                        <A
                          href={sub.link}
                          class={`text-sm px-3 py-1 rounded-lg hover:bg-white/20 transition ${location.pathname === sub.link ? "bg-white/20" : ""}`}
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
                    isActive ? "bg-white/20" : "hover:bg-white/10"
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
            <div class="flex items-center gap-4 relative">
              {/* Search */}
              <div class="hidden sm:flex items-center px-3 py-2 bg-[#FFF0DA] rounded-full shadow-inner">
                <span class="text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Cari..."
                  class="bg-transparent outline-none ml-2 text-sm text-gray-700 w-48"
                />
              </div>

              {/* Notifikasi */}
              <div class="relative">
                <button
                  class="relative w-10 h-10 rounded-lg bg-[#F4A6B8] text-white hover:shadow-lg transition"
                  onClick={() => setShowNotif((prev) => !prev)}
                >
                  <Bell class="mx-auto w-5 h-5" />
                  <Show when={notifCount() > 0}>
                    <span class="absolute -top-1 -right-1 bg-white text-[#F4A6B8] text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                      {notifCount()}
                    </span>
                  </Show>
                </button>
                <Show when={showNotif()}>
  <div class="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg overflow-hidden z-30">
    <div class="flex items-center justify-between px-4 py-2 border-b text-sm text-gray-700">
      <span>Notifikasi</span>
      <button
        class="text-xs text-red-500 hover:underline"
        onClick={clearNotifikasi}
      >
        Hapus Semua
      </button>
    </div>
    <ul class="max-h-60 overflow-y-auto text-sm">
      <Show
        when={notifList().length > 0}
        fallback={<li class="px-4 py-2 text-gray-400">Tidak ada notifikasi</li>}
      >
        <For each={notifList()}>
          {(notif) => (
            <li class="px-4 py-2 border-b last:border-0 hover:bg-gray-100 cursor-pointer">
              {notif}
            </li>
          )}
        </For>
      </Show>
    </ul>
  </div>
</Show>

              </div>

              {/* Profil */}
              <div class="relative">
                <div
                  class="w-10 h-10 bg-[#CDE8FF] rounded-lg flex items-center justify-center text-[#3F3F3F] font-bold cursor-pointer hover:shadow-lg"
                  onClick={() => setShowProfile((prev) => !prev)}
                >
                  A
                </div>
                <Show when={showProfile()}>
  <div class="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-30">
    <div class="text-sm text-gray-700 px-4 py-2 border-b flex items-center gap-2">
      <span class="font-bold">👤 Akun Saya</span>
    </div>
    <ul class="text-sm text-gray-800">
      <li
  class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
  onClick={openEditModal}
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
  </svg>
  <span>Edit Profil</span>
</li>


      <li
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-600"
        onClick={() => {
          localStorage.removeItem("currentUser");
          showToast("Berhasil logout!", "❗");
          setTimeout(() => window.location.href = "/Login", 1500);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m4-4V9a2 2 0 10-4 0v1" />
        </svg>
        <span>Logout</span>
      </li>
    </ul>
  </div>
</Show>

              </div>
            </div>
          </header>

          {/* Page Content */}
          <main class="flex-1 overflow-y-auto p-4 md:p-6 h-full min-h-0">{children}</main>
        </div>
      </div>
      <Show when={toastMessage()}>
  <div class="fixed top-6 right-6 bg-white text-gray-800 px-6 py-3 rounded-lg shadow-lg z-50 border-l-4 border-[#3F5B8B] flex items-center gap-2 animate-fade-in-up">
    <span class="text-lg">{toastIcon()}</span>
    <span class="font-semibold">{toastMessage()}</span>
  </div>
</Show>
<Show when={showEditModal()}>
  <div class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div class="bg-white w-[90%] max-w-md rounded-lg p-6 shadow-xl relative">
      <h2 class="text-lg font-bold mb-4 text-[#3F5B8B]">Edit Profil</h2>
      <label class="text-sm font-medium text-gray-600">Nama:</label>
      <input
        type="text"
        class="w-full border p-2 mb-3 rounded"
        value={editName()}
        onInput={(e) => setEditName(e.currentTarget.value)}
      />

      <label class="text-sm font-medium text-gray-600">Email:</label>
      <input
        type="email"
        class="w-full border p-2 mb-4 rounded"
        value={editEmail()}
        onInput={(e) => setEditEmail(e.currentTarget.value)}
      />

      <div class="flex justify-end gap-2">
        <button onClick={() => setShowEditModal(false)} class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
          Batal
        </button>
        <button onClick={saveProfile} class="px-4 py-2 rounded bg-[#3F5B8B] text-white hover:bg-[#2C4A6C]">
          Simpan
        </button>
      </div>
    </div>
  </div>
</Show>


    </div>
  );
}
