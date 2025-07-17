import { A } from "@solidjs/router";
import { PackageCheck, Timer, ShieldCheck } from "lucide-solid";

export default function Landing() {
  return (
    <div class="font-sans text-[#2E365A]">
      {/* Navbar */}
      <header class="flex justify-between items-center p-4 md:px-16 bg-white shadow">
        <h1 class="text-2xl font-bold text-[#6C5E82]">CampRent</h1>
        <nav class="hidden md:flex gap-6 text-sm text-gray-600">
          <A href="/">Home</A>
          <A href="#">Gallery</A>
          <A href="#">About</A>
          <A href="#">Contact</A>
        </nav>
        <div class="flex gap-2">
          <A href="/register" class="border border-[#D0797F] text-[#D0797F] px-4 py-1 rounded-full text-sm hover:bg-[#FCEBEC]">Sign Up</A>
          <A href="/login" class="bg-[#D0797F] text-white px-4 py-1 rounded-full text-sm hover:bg-[#A801A7]">Sign In</A>
        </div>
      </header>

      {/* Hero */}
      <section class="relative bg-cover bg-center h-[500px] flex items-center justify-center" style="background-image: url('../assets/hero-camping.jpg')">
        <div class="bg-black bg-opacity-40 absolute inset-0"></div>
        <div class="relative z-10 text-center text-white px-4">
          <h2 class="text-3xl md:text-5xl font-bold mb-4">Sewa Alat Camping Mudah & Cepat</h2>
          <p class="text-lg md:text-xl mb-6">Mulai petualanganmu hari ini bersama <strong>CampRent</strong></p>
          <A href="/login" class="bg-[#D0797F] px-6 py-3 rounded-full text-white font-semibold hover:bg-[#A801A7]">
            Sewa Sekarang
          </A>
        </div>
      </section>

      {/* Fitur */}
      <section class="py-12 bg-white text-center grid grid-cols-1 md:grid-cols-3 gap-8 px-8 md:px-24">
        <div>
          <PackageCheck class="mx-auto mb-4 h-12 w-12 text-[#3F5B8B]" />
          <h3 class="text-lg font-bold mb-1">Lengkap</h3>
          <p class="text-sm text-gray-500">Tersedia berbagai alat untuk kebutuhan outdoor</p>
        </div>
        <div>
          <Timer class="mx-auto mb-4 h-12 w-12 text-[#3F5B8B]" />
          <h3 class="text-lg font-bold mb-1">Cepat</h3>
          <p class="text-sm text-gray-500">Proses pemesanan dan konfirmasi sangat cepat</p>
        </div>
        <div>
          <ShieldCheck class="mx-auto mb-4 h-12 w-12 text-[#3F5B8B]" />
          <h3 class="text-lg font-bold mb-1">Aman</h3>
          <p class="text-sm text-gray-500">Jaminan keamanan dalam Detransaksi</p>
        </div>
      </section>

      {/* Produk Terpopuler */}
      <section class="bg-[#96AAC5] py-12 px-8 md:px-24">
        <h2 class="text-2xl font-bold mb-6 text-center text-white">Alat Camping Terpopuler</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Tenda 2 orang", price: "Rp.50.000/hari", img: "../assets/tenda.png" },
            { name: "Kompor Lipat", price: "Rp.20.000/hari", img: "../assets/kompor.png" },
            { name: "Nesting", price: "Rp.20.000/hari", img: "../assets/nesting.png" },
            { name: "Headlamp", price: "Rp.15.000/hari", img: "../assets/headlamp.png" },
          ].map((item) => (
            <div class="bg-white rounded-lg shadow p-4 text-center">
              <img src={item.img} alt={item.name} class="mx-auto h-24 mb-2" />
              <h3 class="font-semibold">{item.name}</h3>
              <p class="text-sm text-gray-500">{item.price}</p>
              <button class="mt-2 bg-[#D0797F] text-white px-4 py-1 rounded hover:bg-[#A801A7]">Sewa</button>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Sewa */}
      <section class="bg-[#E3ECF7] py-12 px-8 md:px-24">
        <h2 class="text-2xl font-bold mb-6 text-center">Cara Sewa di CampRent</h2>
        <ol class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {[
            "Cari Alat Camping yang Dibutuhkan - Jelajahi berbagai alat camping yang tersedia dan pilih yang sesuai dengan kebutuhan petualanganmu.",
            "Tentukkan Lama Penyewaan - Pilih durasi penyewaan sesuai rencana perjalananmu mulai dari 1 hari hingga beberapa hari.",
            "Lakukan Checkout & Konfirmasi - Isi detail penyewa, konfirmasi pesanan, dan lakukan proses checkout dengan cepat dan aman.",
            "Nikmati Perjalanan Camping - Alat akan dikirim ke lokasi tujuanmu. Tinggal gunakan dan nikmati pengalaman seru di alam!"
          ].map((text, index) => (
            <li class="bg-white rounded shadow p-4 flex gap-4 items-start">
              <div class="text-xl font-bold text-[#3F5B8B]">{index + 1}.</div>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Testimoni */}
      <section class="bg-white py-12 px-8 md:px-24">
        <h2 class="text-xl font-bold mb-4 text-center">Apa Kata Mereka?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { rating: 5, name: "Rina", comment: "Alat campingnya lengkap dan pengirimannya juga cepat!" },
            { rating: 5, name: "Bayu", comment: "Pelayanan ramah, harga terjangkau. Sangat cocok buat trip bareng teman." },
            { rating: 5, name: "Sita", comment: "Kondisi alat bagus banget dan sangat mudah proses sewanya." },
          ].map((item) => (
            <div class="bg-[#96AAC5] p-4 rounded-lg flex flex-col gap-2">
              <div class="text-yellow-500 text-lg">{"★".repeat(item.rating)}</div>
              <p class="text-[#2E365A] font-semibold">"{item.comment}"</p>
              <p class="text-sm text-gray-600">- {item.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Terakhir */}
      <section class="bg-gradient-to-b from-[#96AAC5] to-[#E3ECF7] py-12 text-center">
        <h3 class="text-xl font-semibold text-[#2E365A] mb-2">Pertama kali mau coba camping?</h3>
        <p class="text-sm mb-4 text-[#2E365A]">Yuk mulai petualangan serumu bersama CampRent!</p>
        <A href="/register" class="bg-[#D0797F] text-white px-6 py-2 rounded-full hover:bg-[#A801A7]">Sewa Sekarang</A>
      </section>
    </div>
  );
}
