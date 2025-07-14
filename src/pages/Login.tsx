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
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]") as User[];

    const foundUser = storedUsers.find(
      (u) => u.email === email() && u.password === password()
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      alert("Login berhasil!");
      navigate("/dashboard");
    } else {
      alert("Email atau password salah!");
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#96AAC5] to-[#FCEBEC] font-sans">
      <div class="bg-white/40 backdrop-blur-lg p-8 rounded-lg w-full max-w-sm shadow-md">
        <h2 class="text-2xl font-bold text-center text-[#3F5B8B] mb-2">Sign in to CampRent</h2>
        <p class="text-center text-xs text-[#7A7A8B] mb-6">Rent camping gear. Fast, easy, and trusted.</p>

        {/* Input Email */}
        <div class="flex items-center bg-white rounded px-3 mb-4 shadow-sm">
          <Mail class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="email"
            placeholder="Enter your email address"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            onInput={(e) => setEmail(e.currentTarget.value)}
          />
        </div>

        {/* Input Password */}
        <div class="flex items-center bg-white rounded px-3 mb-6 shadow-sm">
          <Lock class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="password"
            placeholder="Set a strong password"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        {/* Login Button */}
        <button
          class="w-full bg-[#D0797F] text-white py-2 rounded hover:bg-[#A801A7] transition"
          onClick={handleLogin}
        >
          Login
        </button>

        <A
          href="/forgot-password"
          class="text-xs text-center text-[#6C5E82] block hover:underline mb-2"
        >
          Forgot Password?
        </A>

        <div class="flex items-center my-4">
          <hr class="flex-grow border-[#D3D3D3]" />
          <span class="mx-2 text-[#A6A6B0] text-xs">or</span>
          <hr class="flex-grow border-[#D3D3D3]" />
        </div>

        <p class="text-xs text-center text-[#7A7A8B]">
          Belum punya akun?{" "}
          <a href="/register" class="text-[#6C5E82] hover:underline">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
