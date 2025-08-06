// 📌 Format rentang tanggal (mulai + durasi sewa)
export function formatDateRange(dateString: string, duration: string) {
  if (!dateString) return "-";
  try {
    const start = new Date(dateString);
    const durationNum = parseInt(duration?.toString().replace(/\D/g, "")) || 0;

    if (isNaN(start.getTime())) return "-";

    const end = new Date(start);
    end.setDate(start.getDate() + durationNum);

    const formatter = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return durationNum > 0
      ? `${formatter.format(start)} - ${formatter.format(end)}`
      : formatter.format(start);
  } catch {
    return "-";
  }
}

// 📌 Format harga menjadi Rp dengan pemisah ribuan
export function formatPrice(price: string | number) {
  const num = parseInt(price as string);
  if (isNaN(num) || num <= 0) return "Rp 0";
  return `Rp ${num.toLocaleString("id-ID")}`;
}
