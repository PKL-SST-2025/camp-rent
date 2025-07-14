import { createSignal } from "solid-js";
import { Mail, Lock, User } from "lucide-solid";
import { useNavigate } from "@solidjs/router";

// Tambahkan type User
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

    // Ambil daftar user dari localStorage (atau buat array baru jika belum ada)
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // Cek apakah email sudah dipakai
    const isUsed = users.some((u: User) => u.email === email());
    if (isUsed) {
      alert("Email sudah terdaftar!");
      return;
    }

    // Tambahkan user baru
    const newUser: User = {
      name: name(),
      email: email(),
      password: password(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Simpan session sebagai currentUser
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    alert("Registrasi berhasil! Anda akan diarahkan ke Dashboard.");
    navigate("/dashboard");
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#96AAC5] to-[#FCEBEC] font-sans">
      <div class="bg-white/40 backdrop-blur-lg p-8 rounded-lg w-full max-w-sm shadow-md">
        <h2 class="text-2xl font-bold text-center text-[#3F5B8B] mb-2">Sign Up for CampRent</h2>
        <p class="text-center text-xs text-[#7A7A8B] mb-6">Fast, secure, and easy equipment rental.</p>

        {/* Input Name */}
        <div class="flex items-center bg-white rounded px-3 mb-4 shadow-sm">
          <User class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="text"
            placeholder="Enter your name"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </div>

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
        <div class="flex items-center bg-white rounded px-3 mb-4 shadow-sm">
          <Lock class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="password"
            placeholder="Enter your password"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            onInput={(e) => setPassword(e.currentTarget.value)}
          />
        </div>

        {/* Input Confirm Password */}
        <div class="flex items-center bg-white rounded px-3 mb-6 shadow-sm">
          <Lock class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="password"
            placeholder="Confirm your password"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          class="w-full bg-[#D0797F] text-white py-2 rounded hover:bg-[#A801A7] transition"
          onClick={handleRegister}
        >
          Sign Up
        </button>

        <p class="text-xs text-center mt-4 text-[#7A7A8B]">
          Already have an account?{" "}
          <a href="/login" class="text-[#6C5E82] hover:underline">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}
