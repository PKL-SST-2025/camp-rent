import { useParams, useNavigate } from "@solidjs/router";
import { createSignal, onMount, For, createMemo } from "solid-js";
import { Star, ArrowLeft, MessageSquare, User, Calendar, Award, TrendingUp } from "lucide-solid";

// Tipe Produk & Ulasan
type Product = {
  id: number;
  name: string;
  img: string;
};

type Ulasan = {
  productId: number;
  rating: number;
  comment: string;
  date: string;
  user: string;
  productName: string;
};

// Dummy Data Produk
const dummyProducts: Product[] = [
  { id: 1, name: "Tenda Dome", img: "/tenda.png" },
  { id: 2, name: "Kompor Lipat", img: "/kompor.png" },
  { id: 3, name: "Lampu Camping", img: "/lampu.png" },
  { id: 4, name: "Carrier 60L", img: "/carrier.png" },
  { id: 5, name: "Sleeping Bag", img: "/sleepbag.png" },
  { id: 6, name: "Headlamp LED", img: "/headlamp.png" },
  { id: 7, name: "Flysheet", img: "/flysheet.png" },
  { id: 8, name: "Gas Kaleng", img: "/gas.png" },
  { id: 9, name: "Cooking Set", img: "/cookset.png" },
  { id: 10, name: "Matras", img: "/matras.png" },
];

export default function Ulasan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = Number(id);
  const product = dummyProducts.find((p) => p.id === productId);

  const [ulasanList, setUlasanList] = createSignal<Ulasan[]>([]);
  const [rating, setRating] = createSignal(5);
  const [comment, setComment] = createSignal("");
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [hoveredStar, setHoveredStar] = createSignal(0);
  const [showSuccess, setShowSuccess] = createSignal(false);

  // Function to load reviews from localStorage
  const loadReviews = () => {
    try {
      const allReviews = JSON.parse(localStorage.getItem("ulasanProduk") || "[]");
      console.log("All reviews from localStorage:", allReviews);
      console.log("Current productId:", productId, "Type:", typeof productId);
      
      const productReviews = allReviews.filter((u: any) => {
        console.log("Review item:", u);
        console.log("Comparing:", u.productId, "(type:", typeof u.productId, ") with", productId, "(type:", typeof productId, ")");
        
        // Validasi data ulasan
        if (!u || typeof u !== 'object') {
          console.log("Invalid review object:", u);
          return false;
        }
        
        return Number(u.productId) === Number(productId);
      }).filter((u: any) => u.comment && u.comment.trim() !== ""); // Filter ulasan dengan komentar valid
      
      console.log("Filtered reviews for product", productId, ":", productReviews);
      setUlasanList(productReviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
      setUlasanList([]);
    }
  };

  // Ambil ulasan dari localStorage saat mount
  onMount(() => {
    console.log("Component mounted for product ID:", productId);
    loadReviews();
    setTimeout(() => setIsLoaded(true), 200);
  });

  // Hitung statistik ulasan
  const reviewStats = createMemo(() => {
    const reviews = ulasanList();
    if (reviews.length === 0) return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };

    const total = reviews.length;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / total;
    
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });

    return { average, total, distribution };
  });

  const handleSubmit = async () => {
    const trimmedComment = comment().trim();
    if (trimmedComment === "") {
      alert("Komentar tidak boleh kosong.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulasi loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const email = currentUser.email || currentUser.username || "Anonymous";
      
      console.log("Current user data:", currentUser);
      console.log("Email/username:", email);

      const newUlasan: Ulasan = {
        productId: Number(productId), // Pastikan ini adalah number
        rating: rating(),
        comment: trimmedComment,
        date: new Date().toISOString(),
        user: email,
        productName: product?.name || "Produk",
      };

      console.log("Creating new review:", newUlasan);
      console.log("ProductId type check:", typeof newUlasan.productId, newUlasan.productId);

      // Get existing reviews and add new one
      const allReviews = JSON.parse(localStorage.getItem("ulasanProduk") || "[]");
      const updatedReviews = [...allReviews, newUlasan];
      
      // Save to localStorage
      localStorage.setItem("ulasanProduk", JSON.stringify(updatedReviews));
      
      console.log("All reviews after save:", updatedReviews);

      // Reload reviews to ensure they display
      loadReviews();
      
      // Reset form
      setComment("");
      setRating(5);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = (props: { rating: number; interactive?: boolean; size?: string }) => {
    const { rating: currentRating, interactive = false, size = "text-2xl" } = props;
    
    return (
      <div class="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredStar(star)}
            onMouseLeave={() => interactive && setHoveredStar(0)}
            disabled={!interactive}
            class={`${size} transition-all duration-200 ${
              interactive ? 'cursor-pointer hover:scale-110 transform' : 'cursor-default'
            } ${
              star <= (interactive && hoveredStar() > 0 ? hoveredStar() : currentRating) 
                ? "text-yellow-400" 
                : "text-gray-300"
            }`}
          >
            <Star 
              size={size === "text-2xl" ? 24 : size === "text-lg" ? 20 : 16} 
              class={`${star <= (interactive && hoveredStar() > 0 ? hoveredStar() : currentRating) ? "fill-current" : ""} transition-all duration-200`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    return date.toLocaleDateString("id-ID", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    });
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      {/* Background Pattern */}
      <div class="fixed inset-0 opacity-5 pointer-events-none">
        <div class="absolute inset-0" style={{
          "background-image": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Success Notification */}
      {showSuccess() && (
        <div class="fixed top-4 right-4 z-50 animate-slide-in">
          <div class="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Award class="text-white" size={16} />
            </div>
            <div>
              <p class="font-semibold">Ulasan Berhasil Dikirim!</p>
              <p class="text-sm opacity-90">Terima kasih atas feedback Anda</p>
            </div>
          </div>
        </div>
      )}

      <div class="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div class={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 transform transition-all duration-1000 ${
          isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] opacity-0'
        }`}>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-[#3F5B8B] to-[#6C5E82] rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare class="text-white" size={24} />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#3F5B8B] to-[#6C5E82] bg-clip-text text-transparent">
                Ulasan Produk
              </h1>
              <p class="text-gray-600 text-sm">Bagikan pengalaman Anda dengan produk ini</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/produk")}
            class="bg-white/80 backdrop-blur-sm hover:bg-white text-[#3F5B8B] border border-[#3F5B8B]/20 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group text-sm sm:text-base"
          >
            <ArrowLeft size={16} class="group-hover:-translate-x-1 transition-transform duration-300" />
            <span class="font-medium">Kembali</span>
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Product Info & Stats */}
          <div class="lg:col-span-1 space-y-6">
            {/* Info Produk */}
            {product && (
              <div class={`bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 transform transition-all duration-1000 animate-slide-up hover:shadow-2xl ${
                isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`} style={{ "animation-delay": "200ms" }}>
                <div class="flex flex-col sm:flex-row items-center gap-4">
                  <div class="relative group">
                    <div class="absolute inset-0 bg-gradient-to-br from-[#3F5B8B]/20 to-[#6C5E82]/20 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                    <img 
                      src={product.img} 
                      alt={product.name} 
                      class="relative h-20 w-20 sm:h-24 sm:w-24 object-contain bg-white rounded-2xl p-3 shadow-lg group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div class="text-center sm:text-left flex-1">
                    <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
                    <p class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
                      ID: {product.id}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Review Statistics */}
            <div class={`bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 transform transition-all duration-1000 animate-slide-up ${
              isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ "animation-delay": "400ms" }}>
              <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award class="text-[#3F5B8B]" size={20} />
                Statistik Ulasan
              </h3>
              
              <div class="space-y-4">
                {/* Average Rating */}
                <div class="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div class="text-3xl font-bold text-[#3F5B8B] mb-1">
                    {reviewStats().total > 0 ? reviewStats().average.toFixed(1) : "0.0"}
                  </div>
                  <StarRating rating={Math.round(reviewStats().average)} size="text-lg" />
                  <p class="text-sm text-gray-600 mt-2">
                    Berdasarkan {reviewStats().total} ulasan
                  </p>
                </div>

                {/* Rating Distribution */}
                {reviewStats().total > 0 && (
                  <div class="space-y-2">
                    <p class="text-sm font-medium text-gray-700 mb-2">Distribusi Rating:</p>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviewStats().distribution[star - 1];
                      const percentage = (count / reviewStats().total) * 100;
                      return (
                        <div class="flex items-center gap-2 text-sm">
                          <span class="w-8 text-right">{star}★</span>
                          <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              class="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-1000 animate-expand"
                              style={{ width: `${percentage}%`, "animation-delay": `${star * 100}ms` }}
                            ></div>
                          </div>
                          <span class="w-8 text-gray-600">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Review Form & List */}
          <div class="lg:col-span-2 space-y-6">
            {/* Form Ulasan */}
            <div class={`bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 transform transition-all duration-1000 animate-slide-up ${
              isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ "animation-delay": "600ms" }}>
              <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Star class="text-[#3F5B8B]" size={20} />
                Tulis Ulasan Anda
              </h3>

              <div class="space-y-6">
                {/* Rating */}
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3">
                    Berikan Rating:
                  </label>
                  <div class="flex items-center gap-4">
                    <StarRating rating={rating()} interactive={true} />
                    <div class="bg-gray-100 px-3 py-1 rounded-full">
                      <span class="text-sm font-medium text-[#3F5B8B]">
                        {rating()}/5 {rating() === 5 ? "Excellent!" : rating() >= 4 ? "Good" : rating() >= 3 ? "Fair" : rating() >= 2 ? "Poor" : "Terrible"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3">
                    Komentar:
                  </label>
                  <div class="relative">
                    <textarea
                      value={comment()}
                      onInput={(e) => setComment(e.currentTarget.value)}
                      class="w-full border-2 border-gray-200 focus:border-[#3F5B8B] focus:ring-4 focus:ring-[#3F5B8B]/10 p-4 rounded-xl transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm"
                      rows="4"
                      placeholder="Ceritakan pengalaman Anda dengan produk ini..."
                      disabled={isSubmitting()}
                    ></textarea>
                    <div class="absolute bottom-3 right-3 text-xs text-gray-400">
                      {comment().length}/500
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting() || comment().trim() === ""}
                  class="w-full bg-gradient-to-r from-[#3F5B8B] to-[#6C5E82] hover:from-[#2C4A6C] hover:to-[#5A4D73] text-white py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold flex items-center justify-center gap-3 group"
                >
                  {isSubmitting() ? (
                    <>
                      <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Mengirim Ulasan...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare size={18} class="group-hover:rotate-12 transition-transform duration-300" />
                      <span>Kirim Ulasan</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Daftar Ulasan */}
            <div class={`bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl p-6 transform transition-all duration-1000 animate-slide-up ${
              isLoaded() ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ "animation-delay": "800ms" }}>
              <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <User class="text-[#3F5B8B]" size={20} />
                  Ulasan Pengguna
                </div>
                <span class="text-sm bg-[#3F5B8B]/10 text-[#3F5B8B] px-3 py-1 rounded-full">
                  {ulasanList().length} ulasan
                </span>
              </h3>

              <div class="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                <For each={ulasanList().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}>
                  {(ulasan, index) => (
                    <div class={`bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 animate-slide-up group`}
                         style={{ "animation-delay": `${1000 + index() * 100}ms` }}>
                      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-gradient-to-br from-[#3F5B8B] to-[#6C5E82] rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {(ulasan.user && ulasan.user.length > 0) ? ulasan.user.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div>
                            <p class="font-semibold text-gray-800 text-sm">{ulasan.user || "Anonymous"}</p>
                            <StarRating rating={ulasan.rating || 0} size="text-sm" />
                          </div>
                        </div>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>{formatDate(ulasan.date)}</span>
                        </div>
                      </div>
                      
                      <p class="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                        {ulasan.comment || "Tidak ada komentar"}
                      </p>
                      
                      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-xl transform skew-x-12 translate-x-full group-hover:translate-x-[-100%] pointer-events-none"></div>
                    </div>
                  )}
                </For>
                
                {ulasanList().length === 0 && (
                  <div class="text-center py-12">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare class="text-gray-400" size={32} />
                    </div>
                    <p class="text-gray-500 font-medium mb-2">Belum ada ulasan</p>
                    <p class="text-gray-400 text-sm">Jadilah yang pertama memberikan ulasan!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style>
        {`
          @keyframes slide-up {
            from { 
              opacity: 0; 
              transform: translateY(30px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          
          @keyframes slide-in {
            from { 
              opacity: 0; 
              transform: translateX(100%); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0); 
            }
          }
          
          @keyframes expand {
            from { 
              width: 0; 
            }
            to { 
              width: var(--target-width); 
            }
          }
          
          .animate-slide-up {
            animation: slide-up 0.8s ease-out both;
          }
          
          .animate-slide-in {
            animation: slide-in 0.5s ease-out both;
          }
          
          .animate-expand {
            animation: expand 1s ease-out both;
          }
          
          /* Custom scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(45deg, #3F5B8B, #6C5E82);
            border-radius: 10px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(45deg, #2E4A73, #5A4D73);
          }
          
          /* Glassmorphism effect */
          .glass {
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            background-color: rgba(255, 255, 255, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.125);
          }
          
          /* Loading spinner */
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          
          /* Hover effects */
          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .hover-lift:hover {
            transform: translateY(-4px) scale(1.01);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
    </div>
  );
}