# TwoSide Boys — animasyon videosu

8 dakikalık İngilizce ses kaydına eşlik edecek **karikatür tarzı animasyon**, [Remotion](https://www.remotion.dev) ile kod olarak üretiliyor.

Ses kaydı ve kurgu Adobe tarafında yapılacağı için bu proje iki çıktı verir:

- **`Master`** — tüm sahneler arka arkaya, tek dosya (8:00)
- **61 ayrı klip** — her sahne kendi başına bir kompozisyon, Adobe'da tek tek dizmek için

## Kendi makinende kurulum (Mac, sıfırdan)

Hiç terminal kullanmadıysan bile adım adım takip edebilirsin.

### 1. Terminal'i aç

`Cmd + Boşluk` → **Terminal** yaz → Enter. Siyah/beyaz bir pencere açılır.
Aşağıdaki komutları buraya yapıştırıp Enter'a basacaksın.

### 2. Node.js kur

<https://nodejs.org> adresine git, büyük yeşil **LTS** düğmesine bas.
İnen `.pkg` dosyasına çift tıkla, "İleri → İleri → Kur" de.

**Kurduktan sonra Terminal'i kapat, yeniden aç.** (Yoksa Terminal yeni
kurulumu görmez.) Sonra:

```bash
node -v
```

`v22.x.x` gibi bir şey yazmalı. "command not found" diyorsa Terminal'i
yeniden açmayı unutmuşsundur.

### 3. Projeyi indir

Tarayıcıda <https://github.com/bburakcelen/bburakcelen> adresine git.
Yeşil **Code** düğmesi → **Download ZIP**.

İnen dosyaya çift tıkla — Mac otomatik açar, `Downloads` içinde bir klasör
oluşur.

### 4. Terminal'i o klasöre götür

Terminal'e şunu yaz (sondaki **boşluğu bırak**, Enter'a basma):

```
cd 
```

Sonra Finder'dan az önce açılan klasörü **sürükleyip Terminal penceresinin
üstüne bırak**. Yolu kendisi yazar. Şimdi Enter'a bas.

Doğru yerde misin diye kontrol et:

```bash
ls
```

Listede `package.json`, `src`, `README.md` görüyorsan tamam.

### 5. Kur

```bash
npm install
```

Bir-iki dakika sürer, ekrandan bir sürü yazı akar — normal.
Sonunda `added 260 packages` gibi bir satır görürsün.

### 6. Önce küçük bir test

Tam videoyu başlatmadan önce tek sahne dene (~1 dakika):

```bash
npx remotion render s47-find-out out/test.mp4 --scale=2
```

**İlk çalıştırmada Remotion kendi tarayıcısını indirir (~150 MB)** — bu tek
seferlik, internet gerekir. `out/test.mp4` oluştuysa her şey hazır.

### 7. Tam 4K render

```bash
caffeinate -i npm run render:4k
```

`caffeinate -i` Mac'in uyumasını engeller — render saatler sürdüğü için
önemli. Terminal penceresini kapatma.

Bitince dosyayı aç:

```bash
open out
```

`TwoSideBoys-4k.mp4` orada, 3840×2160.

### Süre ve disk

4K render M-serisi bir MacBook'ta kabaca **1–2 saat** sürer. **~5 GB boş
disk** ayır. Çekirdek sayına göre hızlandırmak istersen:

```bash
caffeinate -i npx remotion render Master out/video.mp4 --scale=2 --concurrency=8
```

### Sonradan güncelleme gelirse

ZIP ile indirdiysen tekrar indirip aynı adımları uygularsın. Sık güncelleme
alacaksan `git clone` daha rahat olur ama Mac'te ilk `git` komutu Xcode
araçlarını indirmek isteyebilir (birkaç GB).

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
| `npm run render` | Master videoyu `out/TwoSideBoys.mp4` olarak üretir (1080p) |
| `npm run render:4k` | Master'ı 3840×2160 olarak üretir |
| `npm run render:prores` | Master'ı ProRes 4444 (.mov) olarak — Adobe'a girdi için |
| `npm run render:clips` | 61 sahnenin her birini ayrı mp4 olarak `out/clips/` altına |
| `npm run render:clips:4k` | Aynısı 4K olarak, `out/clips-2x/` altına |
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

## Görsel dil

Sinematik sci-fi. Karikatür değil — kalın siyah kontur ve doygun düz renk yok.

- **Aydınlatma:** ana ışık soldan arkadan. Gövdeler büyük ölçüde gölgede kalır,
  sol kontur boyunca aksan renginde keskin bir kenar ışığı çizilir. Formu
  tanımlayan şey çizgi değil, ışık.
- **Mekân:** ufka yakınsayan zemin ızgarası, ışık huzmeleri, derinlik katmanlı
  parçacıklar. Her sahne bir mekânın içinde geçiyor gibi durur.
- **Kamera:** hiçbir sahne sabit değil. Yavaş push-in / drift + çok hafif el
  kamerası salınımı. Sabit kadraj bir videoyu anında ucuz gösterir.
- **Objektif katmanı:** vinyet, film greni, tarama çizgileri, bloom. Sahnelerin
  üstünde durur ve kamerayla birlikte hareket etmez.
- **Tipografi:** Chakra Petch (başlık, geniş harf aralığı, büyük harf),
  Barlow (gövde), JetBrains Mono (sayılar, HUD okumaları, kicker'lar).

## Karakterler

| | A | B |
| --- | --- | --- |
| Boy | Uzun | A'dan ~%12 kısa |
| Saç | Sarı, normal uzunlukta dağınık | Siyah, kısa |
| Göz | Mavi | Siyah |
| Aksan rengi | Camgöbeği | Kehribar |
| Rolü | **Airdrop · yeni projeler · on-chain araştırma** | **Futures · spot trading · strateji** |

Oranlar ~6.5 kafa boyu (yetişkin figür), ince konturlar, gradyanla hacim,
teknik parka. Yakın planda yüz hatları okunur; geniş planda siluet ve
kenar ışığı taşır — gerçek animasyonun çalışma biçimi.

Tanımları `src/characters/presets.ts` içinde. Renk, boy, saç stili — hepsi tek yerden değişir.

**Duygular:** `neutral` `happy` `excited` `laughing` `confident` `thinking` `worried` `sad` `shocked` `defeated`

**Pozlar:** `idle` `point` `pointUp` `wave` `armsUp` `shrug` `thumbsUp` `facepalm` `crossed` `presenting` `handsDown`

**Kadrajlar:** `full` (tam boy) · `bust` (bel üstü) · `head` (yakın plan)

Karakterler sürekli canlı: nefes alır, göz kırpar, `talking` verildiğinde ağız
oynar, `energy` verildiğinde ağırlık aktarır. Konuşma ağzı duyguya duyarlı —
üzgün bir yüzde ağız çok daha az açılır, yoksa "bağırıyor" gibi okunur.

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

  effects/
    Grade.tsx             Vinyet, gren, tarama çizgileri, bloom, lens flare
  lib/
    camera.tsx            Sahne kamerası (push-in, drift, el kamerası)

  scenes/
    Stage.tsx             Mekân: ızgara, huzmeler, parçacıklar + başlık
    layouts.tsx           7 sahne düzeni (TitleCard, Duo, Solo, ListReveal,
                          Spotlight, Split, CloseUp)

  props/
    Crypto.tsx            Holo mum grafiği, coin, blok zinciri, kapsül, roket
    SciFi.tsx             HUD çerçevesi, holo panel, veri akışı, tel kafes
                          dünya, radar, fiyat şeridi, düğüm ağı
    Ui.tsx                Diyalog kutusu, kasa, tarayıcı, soru glifleri,
                          like/subscribe, kıvılcım patlaması
    Story.tsx             Buzdağı, red damgası, kalkan, sayaç, yorumlar

public/fonts/             Chakra Petch + Barlow + JetBrains Mono (yerel)
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
- `mood` → arka plan tonu: `void` `data` `risk` `wealth` `deep` `dawn`
- `move` → kamera hareketi: `pushIn` `pullOut` `driftLeft` `driftRight` `riseUp` `sinkDown` `still`
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

## 4K

Kompozisyon 1920×1080 tasarlandı ama **her şey vektör** — SVG şekiller ve
metin. Yani 4K büyütme değil, gerçek çözünürlük: aynı sahne iki kat
piksel yoğunluğunda yeniden çizilir, hatlar ve yazılar gerçekten keskinleşir.

```bash
npm run render:4k
# ya da elle:
npx remotion render Master out/video.mp4 --scale=2
```

`--scale=2`, 1920×1080 kompozisyonu 3840×2160 basar. Tasarımda hiçbir
şeyi değiştirmen gerekmez; ölçüler CSS pikseli cinsinden kaldığı için
yerleşim birebir aynı kalır.

**Ölçülen maliyet** (aynı 66 karelik sahne, 4 çekirdek):

| | Süre | Boyut |
| --- | --- | --- |
| 1080p | 16 sn | 2.1 MB |
| 4K (`--scale=2`) | 51 sn | 5.7 MB |

Tam videoya vurursan: 1080p'de ~45 dakika ve ~390 MB olan çıktı, 4K'da
kabaca **2–3 saat ve ~1 GB** olur. Çekirdek sayın arttıkça süre düşer:

```bash
npx remotion render Master out/video.mp4 --scale=2 --concurrency=8
```

4K'yı varsayılan yapmak istersen `remotion.config.ts` içine
`Config.setScale(2)` ekleyebilirsin — ama geliştirme sırasında her render
üç kat yavaşlar, o yüzden ayrı komut olarak bırakmak daha rahat.

**Neden 4K yüklemek mantıklı:** YouTube 4K yüklemelere daha yüksek bitrate
ve VP9 kodlama veriyor. İzleyici 1080p'de izlese bile görüntü, doğrudan
1080p yüklenmiş bir videodan daha temiz görünür.

**Alfa kanallı 4K klip** gerekiyorsa:

```bash
npx remotion render s27-lost-everything out/klip.webm --codec=vp8 --image-format=png --scale=2
```

## Render süresi

8 dakika = 14.400 kare. Süre makinene ve çekirdek sayısına bağlı; hızlandırmak için:

```bash
npx remotion render Master out/TwoSideBoys.mp4 --concurrency=8
```

Geliştirme sırasında tüm videoyu render alma — Studio'da bak, sadece üzerinde çalıştığın sahnenin kompozisyonunu render et.

## Notlar

- Fontlar `public/fonts/` altında yerel — render internet gerektirmez, sonuç her makinede aynı.
- Tüm görseller kod ile çizilmiş SVG. Dışarıdan stok görsel/Lottie yok, dolayısıyla **lisans sorunu yok** — ticari kullanım, monetizasyon serbest.
- Sahne geçişleri bilinçli olarak sert kesim; yumuşak geçişi Premiere'de eklemek daha esnek.
- Remotion'un kendi lisansı ayrı: bireysel ve küçük ekipler için ücretsiz, büyük şirketler için ücretli. <https://www.remotion.dev/license>
