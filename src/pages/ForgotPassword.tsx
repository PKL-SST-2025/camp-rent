import { createSignal, createEffect } from "solid-js";
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, KeyRound, Clock, Shield } from "lucide-solid";
import { A } from "@solidjs/router";

type NotificationState = {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
};

export default function ForgotPassword() {
  const [email, setEmail] = createSignal("");
  const [sent, setSent] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [emailError, setEmailError] = createSignal("");
  const [notification, setNotification] = createSignal<NotificationState>({
    show: false,
    message: "",
    type: 'info'
  });
  const [countdown, setCountdown] = createSignal(0);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Show notification with auto-hide
  const showNotification = (message: string, type: NotificationState['type']) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Real-time email validation
  createEffect(() => {
    const emailValue = email();
    if (emailValue.length > 0 && !validateEmail(emailValue)) {
      setEmailError("Format email tidak valid");
    } else {
      setEmailError("");
    }
  });

  // Countdown timer
  createEffect(() => {
    if (countdown() > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown() - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  const generateToken = () => {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  };

  const checkEmailExists = (email: string): boolean => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    return users.some((user: any) => user.email.toLowerCase() === email.toLowerCase());
  };

  const handleReset = async () => {
    setEmailError("");

    // Basic validation
    if (!email().trim()) {
      setEmailError("Email tidak boleh kosong");
      return;
    }

    if (!validateEmail(email())) {
      setEmailError("Format email tidak valid");
      return;
    }

    // Check if email exists
    if (!checkEmailExists(email())) {
      setEmailError("Email tidak terdaftar dalam sistem");
      showNotification("Email tidak ditemukan. Pastikan email sudah terdaftar.", 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const token = generateToken();
      const resetData = {
        email: email().toLowerCase(),
        token: token,
        timestamp: Date.now(),
        expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutes
        used: false
      };

      localStorage.setItem("resetToken", JSON.stringify(resetData));
      setSent(true);
      setCountdown(30); // 30 seconds countdown before can resend
      
      showNotification(`Link reset password berhasil dikirim ke ${email()}`, 'success');
      console.log("🔐 Reset Token Generated:", resetData);

    } catch (error) {
      showNotification("Gagal mengirim email reset. Silakan coba lagi.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown() > 0) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const token = generateToken();
    const resetData = {
      email: email().toLowerCase(),
      token: token,
      timestamp: Date.now(),
      expiresAt: Date.now() + (30 * 60 * 1000),
      used: false
    };

    localStorage.setItem("resetToken", JSON.stringify(resetData));
    setCountdown(30);
    setIsLoading(false);
    
    showNotification("Link reset password baru telah dikirim", 'success');
    console.log("🔐 New Reset Token Generated:", resetData);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading()) {
      if (sent() && countdown() === 0) {
        handleResend();
      } else if (!sent()) {
        handleReset();
      }
    }
  };

  return (
    <div>
      {/* Notification Toast */}
      <div class={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        notification().show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div class={`flex items-center p-4 rounded-lg shadow-lg backdrop-blur-md border max-w-sm ${
          notification().type === 'success' 
            ? 'bg-green-50/90 border-green-200 text-green-800' 
            : notification().type === 'error'
            ? 'bg-red-50/90 border-red-200 text-red-800'
            : 'bg-blue-50/90 border-blue-200 text-blue-800'
        }`}>
          {notification().type === 'success' && <CheckCircle2 class="h-5 w-5 mr-3 flex-shrink-0" />}
          {notification().type === 'error' && <AlertCircle class="h-5 w-5 mr-3 flex-shrink-0" />}
          <span class="text-sm font-medium">{notification().message}</span>
        </div>
      </div>

      <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#96AAC5] via-[#B8C8E0] to-[#FCEBEC] font-sans px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div class="absolute inset-0 opacity-30">
          <div class="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        </div>

        <div class="bg-white/30 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/30 transform hover:scale-[1.01] transition-all duration-300 animate-fade-up relative z-10">
          {/* Header */}
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-[#D0797F] to-[#A801A7] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <KeyRound class="text-white h-8 w-8" />
            </div>
            <h1 class="text-3xl font-bold text-[#2E365A] mb-2">
              Reset Password
            </h1>
            <p class="text-sm text-[#6C5E82] opacity-80">
              {sent() 
                ? "Kami telah mengirim link reset ke email Anda" 
                : "Masukkan email untuk mendapat link reset password"
              }
            </p>
          </div>

          {/* Success State */}
          {sent() && (
            <div class="mb-6 p-4 bg-green-50/70 border border-green-200 rounded-xl animate-fade-in">
              <div class="flex items-start gap-3">
                <CheckCircle2 class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-green-800 mb-1">
                    Email Berhasil Dikirim!
                  </h3>
                  <p class="text-xs text-green-600 mb-2">
                    Link reset password telah dikirim ke: <br />
                    <strong class="font-medium">{email()}</strong>
                  </p>
                  <div class="flex items-center gap-1 text-xs text-green-600">
                    <Clock class="h-3 w-3" />
                    Link berlaku selama 30 menit
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div class="space-y-5">
            {/* Email Input */}
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#2E365A]">
                Email Address
              </label>
              <div class={`relative group ${emailError() ? 'animate-shake' : ''}`}>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class={`h-5 w-5 transition-colors ${emailError() ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#D0797F]'}`} />
                </div>
                <input
                  type="email"
                  class={`w-full pl-10 pr-4 py-3 bg-white/70 border rounded-xl outline-none transition-all duration-200 text-[#2E365A] placeholder-gray-400 ${
                    emailError() 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-white/50 focus:border-[#D0797F] focus:ring-2 focus:ring-[#D0797F]/20 focus:bg-white/90'
                  } ${sent() ? 'bg-gray-50/70' : ''}`}
                  placeholder="nama@email.com"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading() || sent()}
                />
              </div>
              {emailError() && (
                <p class="text-red-500 text-xs flex items-center gap-1 animate-fade-in">
                  <AlertCircle class="h-3 w-3" />
                  {emailError()}
                </p>
              )}
            </div>

            {/* Security Info */}
            {!sent() && (
              <div class="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div class="flex items-start gap-2">
                  <Shield class="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div class="text-xs text-blue-700">
                    <p class="font-medium mb-1">Keamanan Terjamin</p>
                    <ul class="space-y-1 text-blue-600">
                      <li>• Link reset berlaku 30 menit</li>
                      <li>• Hanya dapat digunakan sekali</li>
                      <li>• Email harus sudah terdaftar</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            {!sent() ? (
              <button
                onClick={handleReset}
                disabled={isLoading() || !email().trim()}
                class={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  isLoading() || !email().trim()
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#D0797F] to-[#A801A7] hover:from-[#A801A7] hover:to-[#D0797F] hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl cursor-pointer'
                }`}
              >
                {isLoading() ? (
                  <div class="flex items-center justify-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Mengirim Email...
                  </div>
                ) : (
                  'Kirim Link Reset'
                )}
              </button>
            ) : (
              <div class="space-y-3">
                <button
                  onClick={handleResend}
                  disabled={isLoading() || countdown() > 0}
                  class={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform ${
                    isLoading() || countdown() > 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-white/70 text-[#D0797F] border-2 border-[#D0797F]/30 hover:bg-[#D0797F] hover:text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl cursor-pointer'
                  }`}
                >
                  {isLoading() ? (
                    <div class="flex items-center justify-center gap-2">
                      <div class="w-4 h-4 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
                      Mengirim Ulang...
                    </div>
                  ) : countdown() > 0 ? (
                    `Kirim Ulang (${countdown()}s)`
                  ) : (
                    'Kirim Ulang'
                  )}
                </button>

                <div class="text-center text-xs text-[#6C5E82]">
                  Tidak menerima email? Periksa folder spam atau tunggu {countdown() > 0 ? `${countdown()} detik` : ''} untuk kirim ulang
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div class="pt-4 border-t border-white/20">
              <A
                href="/login"
                class="flex items-center justify-center gap-2 text-sm text-[#6C5E82] hover:text-[#3F5B8B] transition-colors hover:underline group"
              >
                <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Login
              </A>
            </div>
          </div>
        </div>
      </main>

      <style>
        {`
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        .animate-fade-up {
          animation: fade-up 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        `}
      </style>
    </div>
  );
}