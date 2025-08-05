import { createSignal } from "solid-js";
import { Mail, Lock, User } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

type User = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name() || !email() || !password() || !confirmPassword()) {
      alert("Semua field harus diisi!");
      return;
    }

    if (password() !== confirmPassword()) {
      alert("Password tidak cocok!");
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const isUsed = users.some((u) => u.email === email());
    if (isUsed) {
      alert("Email sudah terdaftar!");
      return;
    }

    const newUser: User = {
      name: name(),
      email: email(),
      password: password(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Registrasi berhasil! Anda akan diarahkan ke Dashboard.");
    navigate("/dashboard");
  };

  return (
    <main class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#96AAC5] to-[#FCEBEC] font-sans px-4 fade-in">
      <div class="bg-white/40 backdrop-blur-md p-8 rounded-xl w-full max-w-sm shadow-md border border-white/20 zoom-in">
        <h1 class="text-2xl font-bold text-center text-[#3F5B8B] mb-1 fade-up delay-1">
          Daftar ke CampRent
        </h1>
        <p class="text-xs text-center text-[#6C5E82] mb-6 fade-up delay-2">
          Sewa perlengkapan camping dengan cepat & mudah.
        </p>

        {/* Nama */}
        <label class="block text-xs text-[#2E365A] mb-1 ml-1 slide-in-left delay-1">
          Nama Lengkap
        </label>
        <div class="flex items-center bg-white rounded px-3 mb-4 shadow-sm slide-in-left delay-1 hover-shadow">
          <User class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="text"
            placeholder="Nama lengkap"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </div>

        {/* Email */}
        <label class="block text-xs text-[#2E365A] mb-1 ml-1 slide-in-left delay-2">
          Email
        </label>
        <div class="flex items-center bg-white rounded px-3 mb-4 shadow-sm slide-in-left delay-2 hover-shadow">
          <Mail class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="email"
            placeholder="Email aktif"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
        </div>

        {/* Password */}
        <label class="block text-xs text-[#2E365A] mb-1 ml-1 slide-in-left delay-3">
          Password
        </label>
        <div class="flex items-center bg-white rounded px-3 mb-4 shadow-sm slide-in-left delay-3 hover-shadow">
          <Lock class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="password"
            placeholder="Minimal 6 karakter"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        {/* Konfirmasi Password */}
        <label class="block text-xs text-[#2E365A] mb-1 ml-1 slide-in-left delay-4">
          Konfirmasi Password
        </label>
        <div class="flex items-center bg-white rounded px-3 mb-6 shadow-sm slide-in-left delay-4 hover-shadow">
          <Lock class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="password"
            placeholder="Ulangi password"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
          />
        </div>

        {/* Tombol Daftar */}
        <button
          onClick={handleRegister}
          class="w-full bg-[#D0797F] text-white py-2 rounded-lg font-semibold hover:bg-[#A801A7] transition pulse hover-scale delay-5"
        >
          Daftar Sekarang
        </button>

        {/* Link ke login */}
        <p class="text-xs text-center mt-4 text-[#7A7A8B] fade-up delay-6">
          Sudah punya akun?{" "}
          <a
            href="/login"
            class="text-[#6C5E82] hover:underline font-medium hover-scale"
          >
            Masuk di sini
          </a>
        </p>
      </div>
    </main>
  );
}
