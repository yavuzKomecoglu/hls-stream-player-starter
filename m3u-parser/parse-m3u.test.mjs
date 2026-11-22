// Çalıştırmak için: node --test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { classify, parseM3U } from './parse-m3u.mjs';
import { searchKey, prefixOf } from './search.mjs';

test('dizi bölümleri film sanılmamalı', () => {
  assert.equal(classify('Örnek Dizi S01 E02', 'https://example.com/vod/1.mp4'), 'series');
  assert.equal(classify('Another Show 1x05', 'https://example.com/vod/2.mp4'), 'series');
  assert.equal(classify('Başka Dizi Sezon 2 Bölüm 7', 'https://example.com/vod/3.mp4'), 'series');
  assert.equal(classify('Örnek Film (2010)', 'https://example.com/vod/4.mkv'), 'movie');
  assert.equal(classify('Haber Kanalı HD', 'https://example.com/live/1.m3u8'), 'live');
});

test('örnek playlist doğru ayrıştırılmalı', () => {
  const items = parseM3U(readFileSync(new URL('./sample.m3u', import.meta.url), 'utf8'));
  assert.equal(items.length, 6);
  assert.equal(items[0].logo, 'https://example.com/haber.png');
  assert.equal(items[5].userAgent, 'MyAgent/1.0');
  assert.equal(items[0].userAgent, null);
});

test('arama Türkçe karakterlere duyarsız olmalı', () => {
  assert.equal(searchKey('Şehir Işıkları ʰᵈ'), 'sehir isiklari hd');
  assert.ok(searchKey('Korku Filmleri').includes(searchKey('KORKU')));
});

test('kategori önekleri bulunmalı', () => {
  assert.equal(prefixOf('TR | Aksiyon'), 'TR');
  assert.equal(prefixOf('[EN] Drama'), 'EN');
  assert.equal(prefixOf('DE: Komödie'), 'DE');
  assert.equal(prefixOf('Belgesel'), null);
});
