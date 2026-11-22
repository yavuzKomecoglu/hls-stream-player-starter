// Türkçe karakter ve süslü karakter duyarsız arama anahtarı.
// "sehir" yazınca "Şehir Işıkları ʰᵈ" bulunsun diye.
export function searchKey(text) {
  return text
    .normalize('NFKD')               // "ʰᵈ" → "hd", "Ş" → "S" + birleşik işaret
    .replace(/[̀-ͯ]/g, '') // birleşik işaretleri at
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .toLowerCase();
}

// Kategori adındaki dil önekini bulur: "TR | Aksiyon", "[EN] Drama", "DE: Komödie".
export function prefixOf(category) {
  const m = category.match(/^\s*\[?([A-Z]{2,3})\]?\s*[|:\-]\s*|^\s*\[([A-Z]{2,3})\]\s*/);
  return m ? m[1] || m[2] : null;
}
