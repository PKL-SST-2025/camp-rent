import { createSignal, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";

type FormField = "name" | "email" | "phone" | "address" | "method" | "agreement" | "rentalDate" | "returnDate";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  img: string;
  category: string;
}

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  method: string;
  agreement: boolean;
  rentalDate: string;
  returnDate: string;
}

export default function Checkout() {
  const [formData, setFormData] = createSignal<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    method: "",
    agreement: false,
    rentalDate: "",
    returnDate: "",
  });

  const [items, setItems] = createSignal<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = createSignal(false);
  const [errors, setErrors] = createSignal<string[]>([]);
  const [currentStep, setCurrentStep] = createSignal(1); // 1: Form, 2: Review, 3: Payment
  
  const navigate = useNavigate();

  onMount(() => {
    // Cek apakah ada checkout items dari keranjang dengan sistem select
    const checkoutItems = localStorage.getItem("checkout_items");
    if (checkoutItems) {
      setItems(JSON.parse(checkoutItems));
    } else {
      // Fallback ke keranjang biasa
      const saved = localStorage.getItem("keranjang");
      if (saved) setItems(JSON.parse(saved));
    }

    // Set default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData(prev => ({
      ...prev,
      rentalDate: today.toISOString().split('T')[0],
      returnDate: tomorrow.toISOString().split('T')[0]
    }));
  });

  const subtotal = () =>
    items().reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getShippingCost = () => {
    const method = formData().method;
    if (method === "cod") return 10000;
    if (method === "transfer") return 2500;
    return 0; // ewallet atau kosong
  };

  const getServiceFee = () => {
    // Biaya layanan 2%
    return Math.floor(subtotal() * 0.02);
  };

  const total = () => subtotal() + getShippingCost() + getServiceFee();

  const handleInputChange = (field: FormField, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors().length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    const data = formData();

    if (!data.name.trim()) newErrors.push("Nama lengkap harus diisi");
    if (!data.email.trim()) newErrors.push("Email harus diisi");
    if (!data.phone.trim()) newErrors.push("Nomor HP harus diisi");
    if (!data.address.trim()) newErrors.push("Alamat harus diisi");
    if (!data.method) newErrors.push("Metode pembayaran harus dipilih");
    if (!data.rentalDate) newErrors.push("Tanggal sewa harus diisi");
    if (!data.returnDate) newErrors.push("Tanggal kembali harus diisi");
    if (!data.agreement) newErrors.push("Harap setujui syarat dan ketentuan");

    // Validate dates
    if (data.rentalDate && data.returnDate) {
      const rentalDate = new Date(data.rentalDate);
      const returnDate = new Date(data.returnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (rentalDate < today) {
        newErrors.push("Tanggal sewa tidak boleh sebelum hari ini");
      }

      if (returnDate <= rentalDate) {
        newErrors.push("Tanggal kembali harus setelah tanggal sewa");
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      newErrors.push("Format email tidak valid");
    }

    // Validate phone number
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
    if (data.phone && !phoneRegex.test(data.phone.replace(/\s/g, ''))) {
      newErrors.push("Format nomor HP tidak valid");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const generateOrderId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `REN${timestamp.toString().slice(-8)}${random.toString().padStart(3, '0')}`;
  };

  const processPayment = async (): Promise<boolean> => {
    const method = formData().method;
    
    // Simulasi proses pembayaran berdasarkan metode
    switch (method) {
      case "transfer":
        // Simulasi transfer bank
        await new Promise(resolve => setTimeout(resolve, 2000));
        return Math.random() > 0.1; // 90% success rate
        
      case "ewallet":
        // Simulasi e-wallet
        await new Promise(resolve => setTimeout(resolve, 1500));
        return Math.random() > 0.05; // 95% success rate
        
      case "cod":
        // COD selalu berhasil karena bayar di tempat
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
        
      default:
        return false;
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (items().length === 0) {
      alert("Keranjang kosong! Silakan pilih produk terlebih dahulu.");
      navigate("/produk");
      return;
    }

    if (!validateForm()) {
      setCurrentStep(1); // Kembali ke form jika ada error
      return;
    }

    // Lanjut ke step pembayaran
    if (currentStep() === 2) {
      setCurrentStep(3);
      return;
    }

    // Proses pembayaran
    setIsProcessing(true);

    try {
      // Proses pembayaran
      const paymentSuccess = await processPayment();

      if (!paymentSuccess) {
        throw new Error("Pembayaran gagal diproses");
      }

      const orderId = generateOrderId();
      const orderDate = new Date().toISOString();

      // Data untuk checkout summary
      const checkoutData = {
        orderId,
        orderDate,
        customerInfo: formData(),
        items: items().map((item) => ({
          id: item.id,
          name: item.name,
          days: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          img: item.img,
          category: item.category
        })),
        subtotal: subtotal(),
        shipping: getShippingCost(),
        serviceFee: getServiceFee(),
        total: total(),
        status: "paid",
        paymentMethod: formData().method
      };

      // Simpan ke checkout summary untuk halaman konfirmasi
      localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

      // Simpan ke riwayatSewa untuk Dashboard & Riwayat - STATUS DIPROSES
      const riwayatSewa = JSON.parse(localStorage.getItem("riwayatSewa") || "[]");
      items().forEach((item) => {
        riwayatSewa.push({
          id: orderId + "-" + item.id,
          orderId: orderId,
          name: item.name,
          date: formData().rentalDate,
          returnDate: formData().returnDate,
          duration: `${item.quantity} Hari`,
          price: item.price * item.quantity,
          status: "Diproses", // Changed from "Dikonfirmasi" to "Diproses"
          customerName: formData().name,
          paymentMethod: formData().method,
          img: item.img,
          category: item.category,
          createdAt: orderDate,
          isPaid: true
        });
      });
      localStorage.setItem("riwayatSewa", JSON.stringify(riwayatSewa));

      // Simpan ke order history untuk tracking yang lebih detail
      const orderHistory = JSON.parse(localStorage.getItem("orderHistory") || "[]");
      orderHistory.unshift(checkoutData);
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

      // Simpan ke rentedHistory untuk sistem ulasan
      const rentedHistory = JSON.parse(localStorage.getItem("rentedHistory") || "[]");
      const productIds = items().map((item) => item.id);
      const updatedRentedHistory = [...new Set([...rentedHistory, ...productIds])];
      localStorage.setItem("rentedHistory", JSON.stringify(updatedRentedHistory));

      // Hapus keranjang dan checkout items setelah checkout berhasil
      localStorage.removeItem("keranjang");
      localStorage.removeItem("checkout_items");

      // Success notification
      const notification = {
        id: Date.now(),
        type: "success",
        title: "Pembayaran Berhasil! 🎉",
        message: `Pesanan ${orderId} telah dibayar dan sedang diproses. Admin akan segera mengkonfirmasi pesanan Anda.`,
        timestamp: new Date().toISOString()
      };

      // Simpan notifikasi
      const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      notifications.unshift(notification);
      localStorage.setItem("notifications", JSON.stringify(notifications));

      // Show success and redirect
      alert(`✅ Pembayaran berhasil! Pesanan ${orderId} sedang diproses dan menunggu konfirmasi admin.`);
      
      // Redirect ke riwayat dengan parameter success
      navigate("/riwayat?success=true&orderId=" + orderId);

    } catch (error) {
      console.error("Payment error:", error);
      alert("❌ Pembayaran gagal diproses. Silakan coba lagi atau pilih metode pembayaran lain.");
      setCurrentStep(2); // Kembali ke review
    } finally {
      setIsProcessing(false);
    }
  };

  const nextStep = () => {
    if (currentStep() === 1 && validateForm()) {
      setCurrentStep(2);
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'transfer': return '🏦 Transfer Bank';
      case 'cod': return '🚚 COD - Bayar di Tempat';
      case 'ewallet': return '💳 E-Wallet';
      default: return method;
    }
  };

  const renderPaymentStep = () => (
    <div class="space-y-6">
      <h3 class="text-xl font-semibold text-gray-900 text-center">💳 Pembayaran</h3>
      
      {/* Payment Method Info */}
      <div class="bg-blue-50 rounded-lg p-6 text-center">
        <div class="text-4xl mb-2">
          {formData().method === 'transfer' ? '🏦' : 
           formData().method === 'cod' ? '🚚' : '💳'}
        </div>
        <h4 class="font-semibold text-lg mb-2">
          {getPaymentMethodDisplay(formData().method)}
        </h4>
        <p class="text-2xl font-bold text-[#3F5B8B] mb-4">
          Rp.{total().toLocaleString("id-ID")}
        </p>
        
        {formData().method === 'transfer' && (
          <div class="bg-white rounded p-4 text-left">
            <p class="font-medium mb-2">📋 Instruksi Transfer:</p>
            <div class="text-sm space-y-1">
              <p>• Bank: BCA</p>
              <p>• No. Rekening: 1234567890</p>
              <p>• Atas Nama: PT Rental Indonesia</p>
              <p class="text-red-600 font-medium">• Transfer tepat hingga 3 digit terakhir</p>
            </div>
          </div>
        )}
        
        {formData().method === 'ewallet' && (
          <div class="bg-white rounded p-4 text-left">
            <p class="font-medium mb-2">📱 E-Wallet tersedia:</p>
            <div class="text-sm space-y-1">
              <p>• OVO: 081234567890</p>
              <p>• DANA: 081234567890</p>
              <p>• GoPay: 081234567890</p>
            </div>
          </div>
        )}
        
        {formData().method === 'cod' && (
          <div class="bg-white rounded p-4 text-left">
            <p class="font-medium mb-2">🚚 Cash on Delivery:</p>
            <div class="text-sm space-y-1">
              <p>• Pembayaran saat barang diterima</p>
              <p>• Siapkan uang pas: Rp.{total().toLocaleString("id-ID")}</p>
              <p>• Kurir akan menghubungi 1 jam sebelum datang</p>
            </div>
          </div>
        )}
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition duration-200"
        >
          ← Kembali
        </button>
        <button
          type="submit"
          disabled={isProcessing()}
          class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-medium transition duration-200 disabled:cursor-not-allowed transform hover:scale-[1.02]"
        >
          {isProcessing() ? (
            <span class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {formData().method === 'cod' ? 'Memproses...' : 'Memproses Pembayaran...'}
            </span>
          ) : (
            formData().method === 'cod' ? 
            '✅ Konfirmasi Pesanan COD' : 
            `💳 Bayar Sekarang Rp.${total().toLocaleString("id-ID")}`
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div class="max-w-4xl mx-auto px-4">
        
        {/* Progress Steps */}
        <div class="mb-8">
          <div class="flex items-center justify-center space-x-8">
            <div class={`flex items-center ${currentStep() >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep() >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span class="ml-2 font-medium">Informasi</span>
            </div>
            <div class={`w-16 h-1 rounded ${currentStep() >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div class={`flex items-center ${currentStep() >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep() >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span class="ml-2 font-medium">Review</span>
            </div>
            <div class={`w-16 h-1 rounded ${currentStep() >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div class={`flex items-center ${currentStep() >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div class={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep() >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span class="ml-2 font-medium">Pembayaran</span>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div class="lg:col-span-2">
            <div class="bg-white rounded-2xl shadow-xl p-8">
              
              <h2 class="text-3xl font-bold mb-6 text-center text-[#3F5B8B] flex items-center justify-center gap-2">
                <span>🛍️</span>
                {currentStep() === 3 ? 'Pembayaran' : 'Formulir Checkout'}
              </h2>

              {/* Error Messages */}
              <Show when={errors().length > 0}>
                <div class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 class="font-medium text-red-800 mb-2">❌ Perlu diperbaiki:</h3>
                  <ul class="list-disc list-inside text-sm text-red-700 space-y-1">
                    {errors().map((error) => (
                      <li>{error}</li>
                    ))}
                  </ul>
                </div>
              </Show>

              <form onSubmit={handleSubmit} class="space-y-6">
                
                {/* Step 1: Customer Information */}
                <Show when={currentStep() === 1}>
                  <div class="space-y-6">
                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Nama Lengkap <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#3F5B8B] focus:border-transparent transition duration-200"
                          placeholder="Masukkan nama lengkap"
                          value={formData().name}
                          onInput={(e) => handleInputChange("name", e.currentTarget.value)}
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Email <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#3F5B8B] focus:border-transparent transition duration-200"
                          placeholder="email@contoh.com"
                          value={formData().email}
                          onInput={(e) => handleInputChange("email", e.currentTarget.value)}
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          No. HP <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#3F5B8B] focus:border-transparent transition duration-200"
                          placeholder="08xxxxxxxxxx"
                          value={formData().phone}
                          onInput={(e) => handleInputChange("phone", e.currentTarget.value)}
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Metode Pembayaran <span class="text-red-500">*</span>
                        </label>
                        <select
                          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#3F5B8B] focus:border-transparent transition duration-200"
                          value={formData().method}
                          onInput={(e) => handleInputChange("method", e.currentTarget.value)}
                        >
                          <option value="">Pilih metode pembayaran</option>
                          <option value="transfer">🏦 Transfer Bank (+Rp2.500)</option>
                          <option value="cod">🚚 COD - Bayar di Tempat (+Rp10.000)</option>
                          <option value="ewallet">💳 E-Wallet (Gratis)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Alamat Lengkap <span class="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#3F5B8B] focus:border-transparent transition duration-200"
                        placeholder="Alamat lengkap untuk pengiriman barang"
                        value={formData().address}
                        onInput={(e) => handleInputChange("address", e.currentTarget.value)}
                      />
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Mulai Sewa <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#3F5B8B] focus:border-transparent transition duration-200"
                          min={new Date().toISOString().split('T')[0]}
                          value={formData().rentalDate}
                          onInput={(e) => handleInputChange("rentalDate", e.currentTarget.value)}
                        />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Tanggal Kembali <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#3F5B8B] focus:border-transparent transition duration-200"
                          min={formData().rentalDate || new Date().toISOString().split('T')[0]}
                          value={formData().returnDate}
                          onInput={(e) => handleInputChange("returnDate", e.currentTarget.value)}
                        />
                      </div>
                    </div>

                    <div class="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                      <input
                        type="checkbox"
                        class="mt-1"
                        checked={formData().agreement}
                        onInput={(e) => handleInputChange("agreement", e.currentTarget.checked)}
                      />
                      <label class="text-sm text-gray-700">
                        Saya menyetujui{" "}
                        <a href="#" class="text-[#3F5B8B] underline font-medium">
                          syarat dan ketentuan
                        </a>{" "}
                        yang berlaku serta bertanggung jawab atas barang yang disewa.
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      class="w-full bg-[#3F5B8B] hover:bg-[#334670] text-white py-3 px-6 rounded-lg font-medium transition duration-200 transform hover:scale-[1.02]"
                    >
                      Lanjut ke Review →
                    </button>
                  </div>
                </Show>

                {/* Step 2: Review Order */}
                <Show when={currentStep() === 2}>
                  <div class="space-y-6">
                    <h3 class="text-xl font-semibold text-gray-900">📋 Review Pesanan Anda</h3>
                    
                    {/* Customer Info Review */}
                    <div class="bg-gray-50 rounded-lg p-4">
                      <h4 class="font-medium text-gray-900 mb-2">👤 Informasi Pemesan</h4>
                      <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <p><strong>Nama:</strong> {formData().name}</p>
                        <p><strong>Email:</strong> {formData().email}</p>
                        <p><strong>HP:</strong> {formData().phone}</p>
                        <p><strong>Pembayaran:</strong> {getPaymentMethodDisplay(formData().method)}</p>
                        <p class="md:col-span-2"><strong>Alamat:</strong> {formData().address}</p>
                        <p><strong>Periode:</strong> {formData().rentalDate} s/d {formData().returnDate}</p>
                      </div>
                    </div>

                    <div class="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition duration-200"
                      >
                        ← Edit Informasi
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 transform hover:scale-[1.02]"
                      >
                        Lanjut ke Pembayaran →
                      </button>
                    </div>
                  </div>
                </Show>

                {/* Step 3: Payment */}
                <Show when={currentStep() === 3}>
                  {renderPaymentStep()}
                </Show>
              </form>

            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div class="lg:col-span-1">
            <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🛒 Ringkasan Pesanan
              </h3>
              
              {/* Items List */}
              <div class="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items().map((item) => (
                  <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={item.img} 
                      alt={item.name}
                      class="w-12 h-12 object-contain rounded"
                    />
                    <div class="flex-1 min-w-0">
                      <h4 class="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p class="text-xs text-gray-500">
                        {item.quantity} hari × Rp.{item.price.toLocaleString("id-ID")}
                      </p>
                      <p class="text-sm font-medium text-[#3F5B8B]">
                        Rp.{(item.quantity * item.price).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div class="space-y-2 text-sm border-t pt-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal:</span>
                  <span>Rp.{subtotal().toLocaleString("id-ID")}</span>
                </div>
                
                <Show when={getShippingCost() > 0}>
                  <div class="flex justify-between">
                    <span class="text-gray-600">
                      {formData().method === 'cod' ? 'Ongkir:' : 'Admin:'}
                    </span>
                    <span>Rp.{getShippingCost().toLocaleString("id-ID")}</span>
                  </div>
                </Show>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">Biaya Layanan:</span>
                  <span>Rp.{getServiceFee().toLocaleString("id-ID")}</span>
                </div>
                
                <hr class="border-gray-200" />
                
                <div class="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span class="text-[#3F5B8B]">Rp.{total().toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Promo Section */}
              <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p class="text-xs text-green-700">
                  🎉 <strong>Bonus:</strong> Gratis asuransi kerusakan untuk sewa di atas 3 hari!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}