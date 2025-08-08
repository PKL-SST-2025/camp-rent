import { createSignal, createEffect } from "solid-js";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, UserCheck } from "lucide-solid";
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

type ValidationErrors = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [errors, setErrors] = createSignal<ValidationErrors>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [notification, setNotification] = createSignal<NotificationState>({
    show: false,
    message: "",
    type: 'info'
  });
  
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  // Show notification with auto-hide
  const showNotification = (message: string, type: NotificationState['type']) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Real-time validation
  createEffect(() => {
    const nameValue = name();
    const currentErrors = errors();
    
    if (nameValue.length > 0) {
      if (!validateName(nameValue)) {
        setErrors({ ...currentErrors, name: "Nama harus minimal 2 karakter dan hanya huruf" });
      } else {
        setErrors({ ...currentErrors, name: "" });
      }
    } else {
      setErrors({ ...currentErrors, name: "" });
    }
  });

  createEffect(() => {
    const emailValue = email();
    const currentErrors = errors();
    
    if (emailValue.length > 0) {
      if (!validateEmail(emailValue)) {
        setErrors({ ...currentErrors, email: "Format email tidak valid" });
      } else {
        setErrors({ ...currentErrors, email: "" });
      }
    } else {
      setErrors({ ...currentErrors, email: "" });
    }
  });

  createEffect(() => {
    const passwordValue = password();
    const currentErrors = errors();
    
    if (passwordValue.length > 0) {
      if (!validatePassword(passwordValue)) {
        setErrors({ ...currentErrors, password: "Password minimal 6 karakter" });
      } else {
        setErrors({ ...currentErrors, password: "" });
      }
    } else {
      setErrors({ ...currentErrors, password: "" });
    }
  });

  createEffect(() => {
    const confirmPasswordValue = confirmPassword();
    const passwordValue = password();
    const currentErrors = errors();
    
    if (confirmPasswordValue.length > 0) {
      if (confirmPasswordValue !== passwordValue) {
        setErrors({ ...currentErrors, confirmPassword: "Password tidak cocok" });
      } else {
        setErrors({ ...currentErrors, confirmPassword: "" });
      }
    } else {
      setErrors({ ...currentErrors, confirmPassword: "" });
    }
  });

  const handleRegister = async () => {
    // Reset all errors
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });

    // Validation
    let hasError = false;
    const newErrors: ValidationErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    };

    if (!name().trim()) {
      newErrors.name = "Nama lengkap harus diisi";
      hasError = true;
    } else if (!validateName(name())) {
      newErrors.name = "Nama harus minimal 2 karakter dan hanya huruf";
      hasError = true;
    }

    if (!email().trim()) {
      newErrors.email = "Email harus diisi";
      hasError = true;
    } else if (!validateEmail(email())) {
      newErrors.email = "Format email tidak valid";
      hasError = true;
    }

    if (!password().trim()) {
      newErrors.password = "Password harus diisi";
      hasError = true;
    } else if (!validatePassword(password())) {
      newErrors.password = "Password minimal 6 karakter";
      hasError = true;
    }

    if (!confirmPassword().trim()) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi";
      hasError = true;
    } else if (password() !== confirmPassword()) {
      newErrors.confirmPassword = "Password tidak cocok";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      showNotification("Mohon lengkapi semua field dengan benar", 'error');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if email already exists
      const isUsed = users.some((u) => u.email.toLowerCase() === email().toLowerCase());
      if (isUsed) {
        setErrors({ ...errors(), email: "Email sudah terdaftar" });
        showNotification("Email sudah digunakan. Silakan gunakan email lain.", 'error');
        return;
      }

      const newUser: User = {
        name: name().trim(),
        email: email().toLowerCase(),
        password: password(),
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      showNotification(`Selamat datang di CampRent, ${newUser.name}!`, 'success');
      
      // Navigate after success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {
      showNotification("Terjadi kesalahan. Silakan coba lagi.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading()) {
      handleRegister();
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    const currentErrors = errors();
    return name().trim() && 
           email().trim() && 
           password().trim() && 
           confirmPassword().trim() &&
           !currentErrors.name && 
           !currentErrors.email && 
           !currentErrors.password && 
           !currentErrors.confirmPassword;
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

      <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#96AAC5] via-[#B8C8E0] to-[#FCEBEC] font-sans px-4 py-8 relative overflow-hidden">
        {/* Background decoration */}
        <div class="absolute inset-0 opacity-30">
          <div class="w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        </div>
        
        <div class="bg-white/30 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md shadow-2xl border border-white/30 transform hover:scale-[1.01] transition-all duration-300 animate-fade-up relative z-10">
          {/* Header */}
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-[#D0797F] to-[#A801A7] rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <UserCheck class="text-white h-8 w-8" />
            </div>
            <h1 class="text-3xl font-bold text-[#2E365A] mb-2">
              Bergabung dengan CampRent
            </h1>
            <p class="text-sm text-[#6C5E82] opacity-80">
              Daftar akun baru untuk mulai menyewa
            </p>
          </div>

          {/* Registration Form */}
          <div class="space-y-4">
            {/* Name Input */}
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#2E365A]">
                Nama Lengkap
              </label>
              <div class={`relative group ${errors().name ? 'animate-shake' : ''}`}>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User class={`h-5 w-5 transition-colors ${errors().name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#D0797F]'}`} />
                </div>
                <input
                  type="text"
                  class={`w-full pl-10 pr-4 py-3 bg-white/70 border rounded-xl outline-none transition-all duration-200 text-[#2E365A] placeholder-gray-400 ${
                    errors().name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-white/50 focus:border-[#D0797F] focus:ring-2 focus:ring-[#D0797F]/20 focus:bg-white/90'
                  }`}
                  placeholder="Masukkan nama lengkap"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading()}
                />
              </div>
              {errors().name && (
                <p class="text-red-500 text-xs flex items-center gap-1 animate-fade-in">
                  <AlertCircle class="h-3 w-3" />
                  {errors().name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#2E365A]">
                Email Address
              </label>
              <div class={`relative group ${errors().email ? 'animate-shake' : ''}`}>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class={`h-5 w-5 transition-colors ${errors().email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#D0797F]'}`} />
                </div>
                <input
                  type="email"
                  class={`w-full pl-10 pr-4 py-3 bg-white/70 border rounded-xl outline-none transition-all duration-200 text-[#2E365A] placeholder-gray-400 ${
                    errors().email 
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
              {errors().email && (
                <p class="text-red-500 text-xs flex items-center gap-1 animate-fade-in">
                  <AlertCircle class="h-3 w-3" />
                  {errors().email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#2E365A]">
                Password
              </label>
              <div class={`relative group ${errors().password ? 'animate-shake' : ''}`}>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class={`h-5 w-5 transition-colors ${errors().password ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#D0797F]'}`} />
                </div>
                <input
                  type={showPassword() ? "text" : "password"}
                  class={`w-full pl-10 pr-12 py-3 bg-white/70 border rounded-xl outline-none transition-all duration-200 text-[#2E365A] placeholder-gray-400 ${
                    errors().password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-white/50 focus:border-[#D0797F] focus:ring-2 focus:ring-[#D0797F]/20 focus:bg-white/90'
                  }`}
                  placeholder="Minimal 6 karakter"
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
              {errors().password && (
                <p class="text-red-500 text-xs flex items-center gap-1 animate-fade-in">
                  <AlertCircle class="h-3 w-3" />
                  {errors().password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div class="space-y-2">
              <label class="block text-sm font-medium text-[#2E365A]">
                Konfirmasi Password
              </label>
              <div class={`relative group ${errors().confirmPassword ? 'animate-shake' : ''}`}>
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock class={`h-5 w-5 transition-colors ${errors().confirmPassword ? 'text-red-400' : 'text-gray-400 group-focus-within:text-[#D0797F]'}`} />
                </div>
                <input
                  type={showConfirmPassword() ? "text" : "password"}
                  class={`w-full pl-10 pr-12 py-3 bg-white/70 border rounded-xl outline-none transition-all duration-200 text-[#2E365A] placeholder-gray-400 ${
                    errors().confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-white/50 focus:border-[#D0797F] focus:ring-2 focus:ring-[#D0797F]/20 focus:bg-white/90'
                  }`}
                  placeholder="Ulangi password"
                  value={confirmPassword()}
                  onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading()}
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                  disabled={isLoading()}
                >
                  {showConfirmPassword() ? (
                    <EyeOff class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye class="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors().confirmPassword && (
                <p class="text-red-500 text-xs flex items-center gap-1 animate-fade-in">
                  <AlertCircle class="h-3 w-3" />
                  {errors().confirmPassword}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isLoading()}
              class={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform mt-6 ${
                isLoading()
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : isFormValid()
                  ? 'bg-gradient-to-r from-[#D0797F] to-[#A801A7] hover:from-[#A801A7] hover:to-[#D0797F] hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl cursor-pointer'
                  : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-pointer hover:from-[#D0797F] hover:to-[#A801A7] hover:scale-[1.02]'
              }`}
            >
              {isLoading() ? (
                <div class="flex items-center justify-center gap-2">
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Mendaftarkan Akun...
                </div>
              ) : (
                'Daftar Sekarang'
              )}
            </button>

            {/* Divider */}
            <div class="flex items-center my-6">
              <hr class="flex-grow border-gray-200" />
              <span class="mx-4 text-gray-400 text-sm">atau</span>
              <hr class="flex-grow border-gray-200" />
            </div>

            {/* Login Link */}
            <div class="text-center p-4 bg-white/20 rounded-xl border border-white/30">
              <p class="text-sm text-[#2E365A] mb-2">
                Sudah punya akun?
              </p>
              <A
                href="/login"
                class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-[#6C5E82] bg-white/50 hover:bg-white/70 rounded-lg transition-all duration-200 hover:scale-105 border border-white/50"
              >
                Masuk ke Akun
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