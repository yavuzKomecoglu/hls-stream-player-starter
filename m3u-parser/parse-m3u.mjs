// Basit bir M3U ayrıştırıcısı ve içerik sınıflandırıcısı.
// Kullanım: node parse-m3u.mjs sample.m3u
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// S01E02, S01 E02, 1x02 ve "Sezon 1 Bölüm 2" kalıplarını yakalar.
const EPISODE = /\bS(\d{1,2})\s*E(\d{1,3})\b|\b(\d{1,2})x(\d{1,3})\b|Sezon\s*(\d+)\s*Bölüm\s*(\d+)/i;

export function classify(name, url) {
  if (/\/series\//.test(url) || EPISODE.test(name)) return 'series';
  if (/\/movie\//.test(url) || /\.(mp4|mkv|avi)(\?|$)/i.test(url)) return 'movie';
  return 'live';
}

export function parseM3U(text) {
  const items = [];
  let current = null;
  let userAgent = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      const attr = (key) => (line.match(new RegExp(`${key}="([^"]*)"`)) || [])[1] || '';
      current = {
        name: line.slice(line.lastIndexOf(',') + 1).trim(),
        group: attr('group-title'),
        logo: attr('tvg-logo'),
      };
    } else if (line.startsWith('#EXTVLCOPT:http-user-agent=')) {
      userAgent = line.split('=').slice(1).join('=');
    } else if (!line.startsWith('#') && current) {
      items.push({ ...current, url: line, type: classify(current.name, line), userAgent });
      current = null;
      userAgent = null;
    }
  }
  return items;
}

// Doğrudan çalıştırıldığında tabloyu yazdır (test dosyası import ettiğinde değil).
if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv[2]) {
  console.table(
    parseM3U(readFileSync(process.argv[2], 'utf8')).map(({ name, group, type }) => ({ name, group, type }))
  );
}
