import { createSignal, createEffect } from "solid-js";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-solid";
import { A, useNavigate } from "@solidjs/router";

type User = {
  name: string;
  email: string;
  password: string;
};

type NotificationState = {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
};

export default function Login() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [emailError, setEmailError] = createSignal("");
  const [passwordError, setPasswordError] = createSignal("");
  const [notification, setNotification] = createSignal<NotificationState>({
    show: false,
    message: "",
    type: 'info'
  });
  const navigate = useNavigate();

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
    }, 4000);
  };

  // Real-time email validation (hanya saat user sudah mulai mengetik)
  createEffect(() => {
    const emailValue = email();
    if (emailValue.length > 0 && !validateEmail(emailValue)) {
      setEmailError("Format email tidak valid");
    } else {
      setEmailError("");
    }
  });

  // Real-time password validation (hanya memberitahu, tidak memblokir)
  createEffect(() => {
    const passwordValue = password();
    if (passwordValue.length > 0 && passwordValue.length < 6) {
      setPasswordError("Disarankan password minimal 6 karakter");
    } else {
      setPasswordError("");
    }
  });

  const handleLogin = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Basic validation
    if (!email().trim()) {
      setEmailError("Email tidak boleh kosong");
      return;
    }

    if (!password().trim()) {
      setPasswordError("Password tidak boleh kosong");
      return;
    }

    // Validate email format only if email is provided
    if (!validateEmail(email())) {
      setEmailError("Format email tidak valid");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      const users = JSON.parse(localStorage.getItem("users") || "[]") as User[];
      
      const found = users.find(
        (u) => u.email.toLowerCase() === email().toLowerCase() && u.password === password()
      );

      if (found) {
        localStorage.setItem("currentUser", JSON.stringify(found));
        showNotification(`Selamat datang kembali, ${found.name}!`, 'success');
        
        // Navigate after showing success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        showNotification("Email atau password yang Anda masukkan salah", 'error');
      }
    } catch (error) {
      showNotification("Terjadi kesalahan. Silakan coba lagi.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading()) {
      handleLogin();
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
        
        <div class="bg-white/30 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/30 transform hover:scale-[1.02] transition-all duration-300 animate-fade-up relative z-10">
          {/* Header */}
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-[#D0797F] to-[#A801A7] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Mail class="text-white h-8 w-8" />
            </div>
            <h1 class="text-3xl font-bold text-[#2E365A] mb-2">
              Selamat Datang
            </h1>
            <p class="text-sm text-[#6C5E82] opacity-80">
              Masuk ke akun CampRent Anda
            </p>
          </div>

          {/* Login Form */}
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
                  }`}
                  placeholder="nama@email.com"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading()}
                />
              </div>
              {emailError() && (
                <p class="text-red-500 text-xs flex items-center gap-1 animate-fade-in">
                  <AlertCircle class="h-3 w-3" />
                  {emailError()}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#2E365A]">
                Password
              </label>
              <div class={`relative group ${passwordError() ? 'animate-shake' : ''}`}>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class={`h-5 w-5 transition-colors ${passwordError() ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#D0797F]'}`} />
                </div>
                <input
                  type={showPassword() ? "text" : "password"}
                  class={`w-full pl-10 pr-12 py-3 bg-white/70 border rounded-xl outline-none transition-all duration-200 text-[#2E365A] placeholder-gray-400 ${
                    passwordError() 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-white/50 focus:border-[#D0797F] focus:ring-2 focus:ring-[#D0797F]/20 focus:bg-white/90'
                  }`}
                  placeholder="Masukkan password Anda"
                  value={password()}
                  onInput={(e) => setPassword(e.currentTarget.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading()}
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword())}
                  disabled={isLoading()}
                >
                  {showPassword() ? (
                    <EyeOff class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {passwordError() && (
                <p class="text-red-500 text-xs flex items-center gap-1 animate-fade-in">
                  <AlertCircle class="h-3 w-3" />
                  {passwordError()}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading()}
              class={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                isLoading()
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#D0797F] to-[#A801A7] hover:from-[#A801A7] hover:to-[#D0797F] hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl cursor-pointer'
              }`}
            >
              {isLoading() ? (
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Memproses...
                </div>
              ) : (
                'Masuk'
              )}
            </button>

            {/* Forgot Password */}
            <div class="text-center">
              <A
                href="/forgot-password"
                class="text-sm text-[#6C5E82] hover:text-[#3F5B8B] transition-colors hover:underline"
              >
                Lupa password?
              </A>
            </div>

            {/* Divider */}
            <div class="flex items-center my-6">
              <hr class="flex-grow border-gray-200" />
              <span class="mx-4 text-gray-400 text-sm">atau</span>
              <hr class="flex-grow border-gray-200" />
            </div>

            {/* Register Link */}
            <div class="text-center p-4 bg-white/20 rounded-xl border border-white/30">
              <p class="text-sm text-[#2E365A] mb-2">
                Belum punya akun?
              </p>
              <A
                href="/register"
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#6C5E82] bg-white/50 hover:bg-white/70 rounded-lg transition-all duration-200 hover:scale-105 border border-white/50"
              >
                Daftar Sekarang
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