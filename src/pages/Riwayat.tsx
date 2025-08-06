// Format rentang tanggal
export function formatDateRange(dateString: string, duration: string) {
  try {
    const start = new Date(dateString);
    const durationNum = parseInt(duration?.toString().replace(/\D/g, ""));
    if (isNaN(start.getTime()) || isNaN(durationNum)) return "-";

    const end = new Date(start);
    end.setDate(start.getDate() + durationNum);

    const formatter = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
  } catch {
    return "-";
  }
}

// Format harga dengan Rp
export function formatPrice(price: string) {
  const num = parseInt(price);
  return !isNaN(num) ? `Rp ${num.toLocaleString("id-ID")}` : "Rp 0";
}
