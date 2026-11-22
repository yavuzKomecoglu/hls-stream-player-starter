import { readFileSync } from 'node:fs';

function classify(name, url) {
  const episode = /S\d+\s*E\d+|\d+x\d+|Sezon\s*\d+\s*Bölüm\s*\d+/i;
  if (/\/series\//i.test(url) || episode.test(name)) return 'series';
  if (/\/movie\//i.test(url) || /\.(mp4|mkv)(\?|$)/i.test(url)) return 'movie';
  return 'live';
}

function parseM3U(text) {
  const items = [];
  let current = null;

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('#EXTINF:')) {
      current = {
        name: line.split(',').slice(1).join(',').trim(),
        group: line.match(/group-title="([^"]*)"/)?.[1] || ''
      };
    } else if (line && !line.startsWith('#') && current) {
      items.push({ ...current, url: line, type: classify(current.name, line) });
      current = null;
    }
  }
  return items;
}

const file = process.argv[2] || 'sample.m3u';
console.table(parseM3U(readFileSync(file, 'utf8')), ['name', 'group', 'type']);
