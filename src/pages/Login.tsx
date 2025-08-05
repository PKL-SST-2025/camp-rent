import { createSignal } from "solid-js";
import { Mail, Lock } from "lucide-solid";
import { A, useNavigate } from "@solidjs/router";

type User = {
  name: string;
  email: string;
  password: string;
};

export default function Login() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];

    const found = users.find(
      (u) => u.email === email() && u.password === password()
    );

    if (found) {
      localStorage.setItem("currentUser", JSON.stringify(found));
      alert("Login berhasil!");
      navigate("/dashboard");
    } else {
      alert("Email atau password salah!");
    }
  };

  return (
    <main class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#96AAC5] to-[#FCEBEC] font-sans px-4 fade-in">
      <div class="bg-white/40 backdrop-blur-md p-8 rounded-xl w-full max-w-sm shadow-md border border-white/20 zoom-in">
        {/* Title */}
        <h1 class="text-2xl font-bold text-center text-[#3F5B8B] mb-1 fade-up delay-1">
          Masuk ke CampRent
        </h1>
        <p class="text-xs text-center text-[#6C5E82] mb-6 fade-up delay-2">
          Sewa perlengkapan camping dengan mudah dan cepat.
        </p>

        {/* Input Email */}
        <label class="block text-xs text-[#2E365A] mb-1 ml-1 slide-in-left delay-1">
          Email
        </label>
        <div class="flex items-center bg-white rounded px-3 mb-4 shadow-sm slide-in-left delay-1 hover-shadow">
          <Mail class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="email"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            placeholder="example@mail.com"
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
        </div>

        {/* Input Password */}
        <label class="block text-xs text-[#2E365A] mb-1 ml-1 slide-in-left delay-2">
          Password
        </label>
        <div class="flex items-center bg-white rounded px-3 mb-6 shadow-sm slide-in-left delay-2 hover-shadow">
          <Lock class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="password"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            placeholder="Masukkan password"
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        {/* Tombol Login */}
        <button
          onClick={handleLogin}
          class="w-full bg-[#D0797F] text-white py-2 rounded-lg font-semibold hover:bg-[#A801A7] transition pulse hover-scale delay-3"
        >
          Login
        </button>

        {/* Link Tambahan */}
        <A
          href="/forgot-password"
          class="block text-center text-xs text-[#3F5B8B] mt-3 hover:underline fade-up delay-3"
        >
          Lupa Password?
        </A>

        {/* Divider */}
        <div class="flex items-center my-4 fade-in delay-4">
          <hr class="flex-grow border-[#D3D3D3]" />
          <span class="mx-2 text-[#A6A6B0] text-xs">atau</span>
          <hr class="flex-grow border-[#D3D3D3]" />
        </div>

        {/* Link ke Register */}
        <p class="text-xs text-center text-[#7A7A8B] fade-up delay-4">
          Belum punya akun?{" "}
          <A
            href="/register"
            class="text-[#6C5E82] hover:underline font-medium hover-scale"
          >
            Daftar di sini
          </A>
        </p>
      </div>
    </main>
  );
}
