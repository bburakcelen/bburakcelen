# Remotion Animasyon Projesi

[Remotion](https://www.remotion.dev) ile **React kullanarak programatik video** üretmek için hazırlanmış çalışır durumda bir başlangıç projesi.

Videoyu bir React bileşeni gibi yazarsın: her kare için bileşen yeniden render edilir, sen de o anki kare numarasına göre stilleri hesaplarsın. Sonuç `mp4`, `webm`, `gif` veya `png` olarak dışa aktarılır.

## Gereksinimler

- **Node.js 18+** (bu proje Node 22 ile test edildi)
- FFmpeg **kurmana gerek yok** — Remotion kendi derleyicisini paketle birlikte getirir
- İlk render'da Remotion otomatik olarak Chrome Headless Shell indirir (~150 MB, tek seferlik)

## Hızlı başlangıç

```bash
npm install     # bağımlılıkları kur
npm run dev     # Remotion Studio'yu aç → http://localhost:3000
```

Studio açıldığında soldaki listeden bir kompozisyon seç, zaman çizelgesinde gez, sağdaki **Props** panelinden başlık/alt başlığı canlı değiştir. Kodu kaydettiğin anda önizleme güncellenir.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Remotion Studio'yu başlatır (canlı önizleme + zaman çizelgesi) |
| `npm run render` | `HelloWorld` kompozisyonunu `out/HelloWorld.mp4` olarak render eder |
| `npm run render:vertical` | Dikey (9:16) sürümü render eder |
| `npm run still` | Tek kare PNG çıktısı alır (`out/thumbnail.png`) |
| `npm run typecheck` | TypeScript tip kontrolü |
| `npm run upgrade` | Tüm Remotion paketlerini birlikte günceller |

Elle render almak istersen:

```bash
npx remotion render HelloWorld out/video.mp4
npx remotion render HelloWorld out/video.webm --codec=vp8
npx remotion render HelloWorld out/video.gif --codec=gif --every-nth-frame=2
npx remotion still HelloWorld out/kapak.png --frame=90
```

## Proje yapısı

```
remotion.config.ts        CLI ayarları (codec, kalite, giriş noktası)
src/
  index.ts                registerRoot — Remotion'un giriş noktası
  Root.tsx                Kompozisyon listesi (süre, fps, çözünürlük)
  HelloWorld/
    index.tsx             Sahneyi kuran ana bileşen
    Background.tsx        Hareketli gradyan arka plan
    Logo.tsx              Kendini çizen SVG çember (strokeDashoffset)
    Title.tsx             Kelime kelime giren başlık (stagger + spring)
    Subtitle.tsx          Fade + yukarı kayma (interpolate)
    theme.ts              Ortak renkler ve font
public/                   staticFile() ile erişilen varlıklar (görsel, ses, font)
out/                      Render çıktıları (git'e dahil değil)
```

## Temel kavramlar

```tsx
const frame = useCurrentFrame();              // o an render edilen kare (0, 1, 2...)
const {fps, width, height} = useVideoConfig(); // kompozisyon ayarları
```

**`interpolate`** — bir aralığı başka bir aralığa eşler. Süresi kesin belli olan animasyonlar için:

```tsx
// 0. kareden 30. kareye kadar opaklık 0 → 1
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp', // 30'dan sonra 1'de kalsın
});
```

**`spring`** — yay fiziği ile doğal hareket. Giriş animasyonları için:

```tsx
const scale = spring({frame, fps, config: {damping: 14, stiffness: 120}});
```

**`Sequence`** — bir bileşenin zamanını kaydırır. İçindeki `useCurrentFrame()` yeniden 0'dan başlar:

```tsx
<Sequence from={30} durationInFrames={60}>
  <Baslik />   {/* 30. karede belirir, 60 kare görünür kalır */}
</Sequence>
```

> `Sequence` varsayılan olarak içeriğini `AbsoluteFill` ile sarar. Flex yerleşimi içinde kullanıyorsan `layout="none"` vermeyi unutma.

**`AbsoluteFill`** — tüm kareyi kaplayan, konumlandırılmış `div`. Katmanlamanın temeli.

## Yeni animasyon ekleme

1. `src/` altında bileşenini yaz.
2. `src/Root.tsx` dosyasına yeni bir `<Composition />` ekle:

```tsx
<Composition
  id="YeniVideo"
  component={YeniVideo}
  durationInFrames={150}   // 30 fps'te 5 saniye
  fps={30}
  width={1920}
  height={1080}
/>
```

3. `npm run dev` ile Studio'da gör, `npx remotion render YeniVideo out/yeni.mp4` ile dışa aktar.

## Sıkça ihtiyaç duyulanlar

| İhtiyaç | Paket / yöntem |
| --- | --- |
| Ses eklemek | `<Audio src={staticFile('muzik.mp3')} />` |
| Video gömmek | `<OffthreadVideo src={...} />` |
| Görsel | `<Img src={staticFile('logo.png')} />` |
| Sahne geçişleri | `npm i @remotion/transitions` |
| Google Fonts | `npm i @remotion/google-fonts` |
| Lottie animasyonu | `npm i @remotion/lottie` |
| Web sayfasına gömülü oynatıcı | `npm i @remotion/player` |

## Sunucuda / CI'da render

Grafik arayüzü olmayan ortamlarda kendi Chrome'unu göstermek istersen:

```bash
npx remotion render HelloWorld out/video.mp4 \
  --browser-executable=/yol/headless_shell \
  --gl=swangle
```

## Lisans

Remotion **ücretsiz değildir**: bireysel kullanım ve küçük ekipler için serbest, ancak belirli bir büyüklüğün üzerindeki şirketler için ücretli lisans gerekir. Ayrıntılar: <https://www.remotion.dev/license>
