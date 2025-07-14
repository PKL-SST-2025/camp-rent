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
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#96AAC5] to-[#FCEBEC] font-sans">
      <div class="bg-white/40 backdrop-blur-lg p-8 rounded-lg w-full max-w-sm shadow-md">
        <h2 class="text-2xl font-bold text-center text-[#3F5B8B] mb-2">Reset Password</h2>
        <p class="text-center text-xs text-[#7A7A8B] mb-4">
          Enter your email and we’ll send you a link to reset your password
        </p>

        {sent() && (
          <div class="bg-[#E3ECF7] text-[#3F5B8B] text-xs px-3 py-2 rounded mb-2 border border-[#B4C7DC]">
            A password reset link has been sent to <strong>{email()}</strong>
          </div>
        )}

        {/* Input Email */}
        <div class="flex items-center bg-white rounded px-3 mb-4 shadow-sm focus-within:ring-2 focus-within:ring-[#D0797F]">
          <Mail class="text-gray-400 h-4 w-4 mr-2" />
          <input
            type="email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            placeholder="Enter your email address"
            class="w-full py-2 outline-none bg-transparent text-sm text-[#2E365A]"
          />
        </div>

        <div class="text-[10px] text-[#A6A6B0] mb-4 px-1">
          Reset token only valid for 30 minutes and one-time use
        </div>

        <button
          onClick={handleReset}
          class="w-full bg-[#D0797F] text-white py-2 rounded hover:bg-[#A801A7] transition"
        >
          Send Reset Link
        </button>

        <A
          href="/login"
          class="mt-4 text-xs flex items-center justify-center gap-1 text-[#6C5E82] hover:underline"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Login
        </A>
      </div>
    </div>
  );
}
