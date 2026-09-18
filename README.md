# TwoSide Boys — animasyon videosu

8 dakikalık İngilizce ses kaydına eşlik edecek **karikatür tarzı animasyon**, [Remotion](https://www.remotion.dev) ile kod olarak üretiliyor.

Ses kaydı ve kurgu Adobe tarafında yapılacağı için bu proje iki çıktı verir:

- **`Master`** — tüm sahneler arka arkaya, tek dosya (8:00)
- **61 ayrı klip** — her sahne kendi başına bir kompozisyon, Adobe'da tek tek dizmek için

## Hızlı başlangıç

```bash
npm install
npm run dev          # Remotion Studio → http://localhost:3000
```

Studio'da soldaki listeden `Master`'ı seç, zaman çizelgesinde gez. Tek bir sahneye odaklanmak için o sahnenin kompozisyonunu aç — çok daha hızlı iterasyon.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Studio (canlı önizleme) |
| `npm run timeline` | Sahne listesi + zaman damgaları (terminal) |
| `npm run timeline:md` | Aynısı `out/timeline.md` dosyasına |
| `npm run render` | Master videoyu `out/TwoSideBoys.mp4` olarak üretir |
| `npm run render:prores` | Master'ı ProRes 4444 (.mov) olarak — Adobe'a girdi için |
| `npm run render:clips` | 61 sahnenin her birini ayrı mp4 olarak `out/clips/` altına |
| `npm run render:frames` | Her sahneden bir PNG — hızlı görsel kontrol |
| `npm run typecheck` | TypeScript kontrolü |

## Süreyi ses kaydına göre ayarlamak

**Tek bir sayı değiştiriyorsun.** `src/script/beats.tsx`:

```ts
export const TARGET_SECONDS = 8 * 60;   // ses kaydın kaç saniye?
```

Kaydın 8:14 ise `494` yaz. Tüm sahneler, metinlerindeki kelime sayısıyla orantılı olarak yeniden dağılır ve toplam tam olarak o süreye oturur. Tek tek sahne süresi ayarlamana gerek yok.

Belirli bir sahnenin süresini sabitlemek istersen (komik zamanlama gibi) o beat'e `seconds: 3.4` ekle — o sahne sabit kalır, kalan süre diğerleri arasında paylaşılır.

Sahne sıralamasını ve zamanlamayı görmek için:

```bash
npm run timeline
```

## Karakterler

| | A | B |
| --- | --- | --- |
| Boy | Uzun | A'dan ~%12 kısa |
| Saç | Sarı, normal uzunlukta dağınık | Siyah, kısa |
| Göz | Mavi | Siyah |
| Tişört | Mavi | Kırmızı |
| Rolü | Futures / spot trading | Airdrop / on-chain / yeni projeler |

Tanımları `src/characters/presets.ts` içinde. Renk, boy, saç stili — hepsi tek yerden değişir.

**Duygular:** `neutral` `happy` `excited` `laughing` `confident` `thinking` `worried` `sad` `shocked` `defeated`

**Pozlar:** `idle` `point` `pointUp` `wave` `armsUp` `shrug` `thumbsUp` `facepalm` `crossed` `presenting` `handsDown`

**Kadrajlar:** `full` (tam boy) · `bust` (bel üstü) · `head` (yakın plan)

Karakterler sürekli canlı: nefes alır, göz kırpar, `talking` verildiğinde ağız oynar, `energy` verildiğinde zıplar. Konturlarda hafif bir titreme var — gerçek çizgi filmdeki "kaynama" efektinin taklidi.

Hepsini bir arada görmek için Studio'da **`DevCharacterSheet`** kompozisyonunu aç.

## Geliştirme araçları

Studio'da üç yardımcı kompozisyon var (final videoda kullanılmaz):

| Kompozisyon | Ne gösterir |
| --- | --- |
| `DevCharacterSheet` | İki karakter, tüm duygular ve pozlar tek ekranda |
| `DevContactSheet1`–`4` | 61 sahnenin tamamı 4×4 ızgarada, zaman damgalarıyla |

Kontak sayfaları en çok işe yarayan araç: 8 dakikalık videoyu render etmeden
bütünü görüp hangi sahnenin zayıf kaldığını anlıyorsun.

```bash
npx remotion still DevContactSheet1 out/contact1.png --frame=52
```

## Proje yapısı

```
src/
  Root.tsx                Kompozisyon kaydı (Master + 61 sahne + karakter sayfası)
  Master.tsx              Tüm sahneleri sırayla dizen kompozisyon
  theme.ts                Renkler, fontlar, çizgi kalınlıkları
  fonts.ts                public/fonts'tan yerel font yükleme

  script/
    beats.tsx             ★ STORYBOARD — 61 sahne, metinleri ve görselleri
    timeline.ts           Süre dağıtımı ve zaman damgaları

  characters/
    presets.ts            A ve B karakterinin tanımı
    Character.tsx         Ana karakter bileşeni (poz, duygu, kadraj)
    parts/                Yüz, saç, gövde, kol

  scenes/
    Stage.tsx             Arka plan tonları ve başlık
    layouts.tsx           7 sahne düzeni (TitleCard, Duo, Solo, ListReveal,
                          Spotlight, Split, CloseUp)

  props/
    Crypto.tsx            Mum grafiği, coin, blok zinciri, paraşüt, roket
    Ui.tsx                Konuşma balonu, para çuvalı, büyüteç, dünya,
                          soru işaretleri, ekran, like/subscribe, konfeti
    Story.tsx             Buzdağı, yasak işareti, kalkan, sayaç, yorumlar

public/fonts/             Fredoka + Nunito (yerel — render internet istemez)
out/                      Çıktılar (git'e dahil değil)
```

## Bir sahneyi değiştirmek

Her şey `src/script/beats.tsx` içinde. Bir beat şöyle görünür:

```tsx
{
  id: 's27-lost-everything',
  script: 'And eventually, we lost everything.',   // süre bundan hesaplanır
  node: (
    <Spotlight
      caption="And then — we lost everything."
      mood="danger"
      a={{emotion: 'defeated', pose: 'handsDown'}}
      b={{emotion: 'defeated', pose: 'handsDown'}}
    >
      <CandleChart width={1240} height={470} trend="crash" count={20} />
    </Spotlight>
  ),
}
```

- `script` → anlatım metni; süre buradan gelir
- `caption` → ekranda görünen kısa yazı
- `mood` → arka plan tonu: `night` `warm` `chart` `danger` `gold` `calm`
- `a` / `b` → karakterlerin o sahnedeki hâli

Kaydedince Studio anında güncellenir.

## Adobe'a aktarma

```bash
npm run render:clips          # out/clips/ altına 61 mp4
npm run timeline:md           # out/timeline.md — hangi klip nereye denk geliyor
```

Klipler sahne sırasına göre isimlendirilmiştir (`s01-…` → `s61-…`), yani dosya adına göre sıralayıp timeline'a atabilirsin.

**Alfa kanallı** klip gerekiyorsa (bir şeyin üstüne bindirecekseniz) sahnelerdeki arka planı kaldırıp şeffaf render alman gerekir:

```bash
npx remotion render s27-lost-everything out/klip.webm --codec=vp8 --image-format=png
```

Master'ı Adobe'a sokacaksan kalite kaybı olmaması için ProRes tercih et:

```bash
npm run render:prores
```

## Render süresi

8 dakika = 14.400 kare. Süre makinene ve çekirdek sayısına bağlı; hızlandırmak için:

```bash
npx remotion render Master out/TwoSideBoys.mp4 --concurrency=8
```

Geliştirme sırasında tüm videoyu render alma — Studio'da bak, sadece üzerinde çalıştığın sahnenin kompozisyonunu render et.

## Notlar

- Fontlar (Fredoka, Nunito) `public/fonts/` altında yerel — render internet gerektirmez, sonuç her makinede aynı.
- Tüm görseller kod ile çizilmiş SVG. Dışarıdan stok görsel/Lottie yok, dolayısıyla **lisans sorunu yok** — ticari kullanım, monetizasyon serbest.
- Sahne geçişleri bilinçli olarak sert kesim; yumuşak geçişi Premiere'de eklemek daha esnek.
- Remotion'un kendi lisansı ayrı: bireysel ve küçük ekipler için ücretsiz, büyük şirketler için ücretli. <https://www.remotion.dev/license>
