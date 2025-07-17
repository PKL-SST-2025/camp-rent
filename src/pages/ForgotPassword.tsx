import { createSignal } from "solid-js";
import { Mail, ArrowLeft } from "lucide-solid";
import { A } from "@solidjs/router";

export default function ForgotPassword() {
  const [email, setEmail] = createSignal("");
  const [sent, setSent] = createSignal(false);

  const generateToken = () => {
    return Math.random().toString(36).substr(2, 16);
  };

  const handleReset = () => {
    const currentEmail = email();
    if (!currentEmail) {
      alert("Masukkan email terlebih dahulu.");
      return;
    }

    const token = generateToken();
    const resetData = {
      email: currentEmail,
      token: token,
      timestamp: Date.now(),
    };
    localStorage.setItem("resetToken", JSON.stringify(resetData));
    setSent(true);
    console.log("🔐 Token tersimpan:", resetData);
  };

  return (
    <main class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#96AAC5] to-[#FCEBEC] font-sans px-4">
      <div class="bg-white/40 backdrop-blur-lg p-8 rounded-lg w-full max-w-sm shadow-md border border-white/20">
        <h1 class="text-2xl font-bold text-center text-[#3F5B8B] mb-1">Lupa Password?</h1>
        <p class="text-xs text-center text-[#6C5E82] mb-6">
          Masukkan email kamu dan kami akan kirim link reset password
        </p>

        {sent() && (
          <div class="bg-[#E3ECF7] text-[#3F5B8B] text-xs px-3 py-2 rounded mb-4 border border-[#B4C7DC]">
            Link reset password sudah dikirim ke <strong>{email()}</strong>
          </div>
        )}

        {/* Input Email */}
        <label class="block text-xs text-[#2E365A] mb-1 ml-1">Email</label>
        <div class="flex items-center bg-white rounded px-3 mb-3 shadow-sm focus-within:ring-2 focus-within:ring-[#D0797F]">
          <Mail class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="email"
            placeholder="Email terdaftar"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
          />
        </div>

        <p class="text-[10px] text-[#A6A6B0] mb-4 px-1">
          Token hanya berlaku selama 30 menit dan hanya dapat digunakan sekali.
        </p>

        {/* Button */}
        <button
          onClick={handleReset}
          class="w-full bg-[#D0797F] text-white py-2 rounded hover:bg-[#A801A7] transition"
        >
          Kirim Link Reset
        </button>

        <A
          href="/login"
          class="mt-5 text-xs flex items-center justify-center gap-1 text-[#6C5E82] hover:underline"
        >
          <ArrowLeft class="w-4 h-4" />
          Kembali ke Login
        </A>
      </div>
    </main>
  );
}
