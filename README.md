# HLS Stream Player – Başlangıç Kodları

LG webOS TV için kendi HLS oynatıcınızı yazmaya başlamanız için küçük, çalışan örnekler.
Blog yazısı: _[yazının bağlantısı]_

> Bu repo herhangi bir yayın veya playlist içermez. Denemelerinizde örnek akışları
> ya da kullanma hakkınız olan yayınları kullanın.

## İçerik

| Klasör | Ne var? |
|---|---|
| `m3u-parser/` | M3U ayrıştırıcı, dizi/film/canlı sınıflandırıcı, Türkçe duyarsız arama, kategori öneki bulma ve testleri |
| `webos-starter/` | LG TV'ye kurulabilen minimal webOS uygulaması: kumandayla gezinme, Back tuşu, HLS test akışını oynatma |

## 1. M3U ayrıştırıcıyı deneyin

Node.js 18 veya üzeri yeterli, başka bağımlılık yok.

```bash
cd m3u-parser
node parse-m3u.mjs sample.m3u   # playlist'i tablo olarak gösterir
node --test                      # 4 test, hepsi geçmeli
```

## 2. webOS uygulamasını TV'ye kurun

**TV tarafı (bir kere):**

1. [webostv.developer.lge.com](https://webostv.developer.lge.com) üzerinden ücretsiz hesap açın.
2. TV'de LG Content Store'dan **Developer Mode** uygulamasını kurup giriş yapın.
3. **Dev Mode Status**'u açın, TV yeniden başlar.
4. Uygulamayı tekrar açıp **Key Server**'ı açın. IP adresini ve passphrase'i not edin.

**Bilgisayar tarafı (bir kere):**

```bash
npm install -g @webos-tools/cli
ares -V                              # sürüm görünüyorsa kurulum tamam
ares-setup-device                    # add → ad: lgTV, IP: TV'nin IP'si, port: 9922, kullanıcı: prisoner
ares-novacom --device lgTV --getkey  # passphrase'i sorar
ares-device --system-info --device lgTV
```

> SSH kullanıcısı mutlaka `prisoner` olmalı. Başka bir ad `Not supported auth type` hatası verir.

**Paketle, kur, çalıştır:**

```bash
cd webos-starter
ares-package . -o ../out
ares-install -d lgTV ../out/com.example.hlsstreamplayer_1.0.0_all.ipk
ares-launch  -d lgTV com.example.hlsstreamplayer
```

**Hata ayıklama ve kaldırma:**

```bash
ares-inspect -d lgTV --app com.example.hlsstreamplayer --open
ares-install -d lgTV --remove com.example.hlsstreamplayer
```

## Sık karşılaşılan sorunlar

- **Bağlanamıyorum:** Geliştirici Modu oturumu sürelidir. TV'de Developer Mode uygulamasını açıp *Extend Session* deyin.
- **`path does not exist`:** webOS'a `.ipk` kurulur. Yanlışlıkla `.apk` göndermiş olabilirsiniz.
- **Back tuşu uygulamayı kapatıyor:** `appinfo.json` içinde `"disableBackHistoryAPI": true` olmalı. Böylece Back tuşu uygulamaya `keyCode 461` olarak gelir.

## Lisans

MIT
