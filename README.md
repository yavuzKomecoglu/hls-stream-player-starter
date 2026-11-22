# HLS Stream Player Starter

Blog yazısındaki örneklerin çalıştırılabilir hâlleri. Her klasör tek başına denenebilir, harici bağımlılık yoktur.

| Klasör | Ne var | Nasıl çalışır |
|---|---|---|
| `m3u-parser/` | M3U ayrıştırma ve live / movie / series sınıflandırma (Node.js) | `node parse-m3u.mjs` |
| `webos-starter/` | LG TV'ye yüklenebilen, kumandayla çalışan küçük HLS oynatıcı | `ares-package app -o out` |
| `macos-starter/` | SwiftUI + AVPlayer ile playlist listesi ve oynatıcı | `swift run` |
| `samples/` | Örnek playlist (`sample.m3u`) | |

Playlist'lerdeki adresler `example.com` ve Mux'ın herkese açık test akışıdır (`https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`). Gerçekten oynayan tek öğe bu test akışıdır. Depo herhangi bir yayın veya playlist içermez; denemelerinizde örnek akışları ya da kullanma hakkınız olan yayınları kullanın.

## m3u-parser

Node.js 18 veya üstü yeterli.

```sh
cd m3u-parser
node parse-m3u.mjs                        # varsayılan: sample.m3u
node parse-m3u.mjs ../samples/sample.m3u  # başka bir dosya
```

Her `#EXTINF` satırından ad ve `group-title` okunur, sonraki satır adres kabul edilir. Sonuç `name / group / type` tablosu olarak basılır. Sınıflandırma kuralları:

- **series:** adres `/series/` içeriyor ya da ad `S01E02`, `1x05`, `Sezon 2 Bölüm 7` kalıplarından birine uyuyor
- **movie:** adres `/movie/` içeriyor ya da `.mp4` / `.mkv` ile bitiyor
- **live:** geri kalan her şey

## webos-starter

Uygulama dosyaları `webos-starter/app/` altında: `appinfo.json`, `index.html`, `icon.png`. Tek ekranda iki buton ve bir `<video>` var; webOS HLS'i yerel olarak oynattığı için ek kütüphane gerekmez.

| Tuş | İşlev |
|---|---|
| ← / → | Butonlar arasında gezinme |
| OK | Seçili butonu çalıştırır (Başlat / Durdur) |
| Back | Oynatmayı durdurur |

**TV tarafı (bir kere):**

1. [webostv.developer.lge.com](https://webostv.developer.lge.com) üzerinden ücretsiz hesap açın.
2. TV'de LG Content Store'dan **Developer Mode** uygulamasını kurup giriş yapın.
3. **Dev Mode Status**'u açın, TV yeniden başlar.
4. Uygulamayı tekrar açıp **Key Server**'ı açın. IP adresini ve passphrase'i not edin.

**Bilgisayar tarafı (bir kere):**

```sh
npm install -g @webos-tools/cli
ares-setup-device                    # add → ad: lgTV, IP: TV'nin IP'si, port: 9922, kullanıcı: prisoner
ares-novacom --device lgTV --getkey  # passphrase'i sorar
ares-device --system-info --device lgTV
```

**Paketle, kur, çalıştır:**

```sh
cd webos-starter
ares-package app -o out
ares-install -d lgTV out/com.example.hlsplayer_1.0.0_all.ipk
ares-launch -d lgTV com.example.hlsplayer
```

**Hata ayıklama ve kaldırma:**

```sh
ares-inspect -d lgTV --app com.example.hlsplayer --open
ares-install -d lgTV --remove com.example.hlsplayer
```

**Sık karşılaşılan sorunlar:**

- **Bağlanamıyorum:** Developer Mode oturumu sürelidir. TV'de Developer Mode uygulamasını açıp *Extend Session* deyin.
- **`Not supported auth type`:** SSH kullanıcısı `prisoner` olmalı.
- **Back tuşu uygulamayı kapatıyor:** `appinfo.json` içinde `"disableBackHistoryAPI": true` olmalı. Böylece Back tuşu uygulamaya `keyCode 461` olarak gelir.

## macos-starter

macOS 14+ ve Xcode komut satırı araçları (Swift 5.9+) gerekir.

```sh
cd macos-starter
swift run
```

Playlist, paketin içine gömülü `Sources/HLSPlayerStarter/sample.m3u` dosyasından okunur. Soldaki listeden bir öğe seçince sağdaki `VideoPlayer`'da oynatılır. Xcode'da açmak için `open Package.swift`.

## Lisans

MIT. Ayrıntılar için [LICENSE](LICENSE).
