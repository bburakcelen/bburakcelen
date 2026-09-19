import React from 'react';

/**
 * Gerçekçi duran kapak öğeleri.
 *
 * Karikatür karakterler kapakta çocukça duruyordu: oranları abartılı,
 * yüzleri düz. Onları büyütmek sorunu büyütüyor. Çözüm yüzü hiç
 * göstermemek — kanal zaten yüzünü 1 milyonda açacak.
 *
 * Buradaki siluet gerçek insan oranlarıyla çizildi (baş = boyun ~1/7.6'sı,
 * omuz genişliği boyun ~1/4'ü) ve arkadan ışık alıyor: dolgu neredeyse
 * siyah, yalnız kontur boyunca ince bir ışık şeridi var. Fotoğrafik
 * görünümü veren şey bu — ayrıntı değil, doğru oran ve tek yönlü ışık.
 */

const VB_W = 260;
const VB_H = 660;

/*
 * Ölçüler gerçek yetişkin oranlarından: toplam boy 7.6 baş, omuz
 * genişliği baş yüksekliğinin ~1.6 katı, bel omzun ~%62'si. Kollar
 * gövdeden hafif açık duruyor — yapışık olduklarında siluet bel
 * çizgisini kaybediyor ve insan değil palto gibi okunuyor.
 */

/** Baş — tepe yassı, şakaklar içeri, çene köşeli. */
const HEAD = `M 130 24
  C 144 24 155 34 156 54
  C 157 64 155 72 152 80
  C 149 88 144 95 136 98
  C 132 100 128 100 124 98
  C 116 95 111 88 108 80
  C 105 72 103 64 104 54
  C 105 34 116 24 130 24 Z`;

/** Boyun — kısa. Uzun boyun figürü oyuncak gibi gösteriyordu. */
const NECK = `M 117 92
  C 117 102 116 108 115 118
  L 145 118
  C 144 108 143 102 143 92 Z`;

/**
 * Gövde — omuz üstü yatay, deltoid yuvarlak. Omuz genişliği baş
 * genişliğinin ~3 katı; daha darı figürü çocuk gibi gösteriyor.
 */
const TORSO = `M 114 110
  C 107 115 97 120 84 127
  C 69 135 50 146 46 166
  C 42 188 50 210 58 230
  C 66 250 74 266 77 286
  C 79 304 75 318 74 334
  C 73 350 76 362 80 372
  L 180 372
  C 184 362 187 350 186 334
  C 185 318 181 304 183 286
  C 186 266 194 250 202 230
  C 210 210 218 188 214 166
  C 210 146 191 135 176 127
  C 163 120 153 115 146 110 Z`;

/** Kol — deltoidin altından başlar, dirsekte incelir, el uyluk hizasında. */
const ARM_L = `M 53 156
  C 43 174 37 196 35 218
  C 33 242 32 268 32 294
  C 32 320 33 346 35 370
  C 37 390 39 406 42 418
  C 45 430 55 436 63 431
  C 70 426 70 414 68 400
  C 65 378 63 354 62 328
  C 61 302 61 276 63 250
  C 65 226 69 202 75 180 Z`;

/** Bacak — uyluk, diz, baldır, ince bilek. Bilekte biter. */
const LEG_L = `M 80 368
  C 74 410 69 452 71 494
  C 73 522 79 546 77 572
  C 76 592 74 608 74 626
  L 98 626
  C 98 608 99 592 101 572
  C 104 540 108 500 112 462
  C 116 420 122 386 128 366 Z`;

/** Ayakkabı — bileğin altında ayrı parça. Bacağın kendisi aşağı doğru
    genişletildiğinde pantolon paçası gibi duruyordu. */
const SHOE_L = `M 73 616
  C 72 630 69 640 64 645
  C 59 649 60 654 67 654
  L 101 654
  C 103 646 101 634 100 622
  L 100 614 Z`;

export type SilhouetteProps = {
  /** Kareye basılacak yükseklik (px). */
  readonly height: number;
  /** Gövde dolgusu. */
  readonly tone?: string;
  /** Kontur ışığı rengi. */
  readonly rim?: string;
  readonly rimWidth?: number;
  /** Işığın saçılması. 0 = kapalı. */
  readonly bloom?: number;
  /** Omuz genişliği çarpanı — iki figür birbirinden ayrışsın. */
  readonly broad?: number;
  /** Duruştaki hafif eğim (derece). Simetri kırılınca fotoğraf gibi durur. */
  readonly lean?: number;
  readonly flip?: boolean;
  readonly style?: React.CSSProperties;
};

export const Silhouette: React.FC<SilhouetteProps> = ({
  height,
  tone = '#05070C',
  rim = '#9FE8FF',
  rimWidth = 3.2,
  bloom = 1,
  broad = 1,
  lean = 0,
  flip = false,
  style,
}) => {
  const id = `${tone}${rim}${broad}`.replace(/[^a-zA-Z0-9]/g, '');
  const mirrored = `translate(${VB_W}, 0) scale(-1, 1)`;

  // Parçalar ayrı ayrı çiziliyor; aynı renkle dolduklarında tek siluet olurlar.
  const shapes = (
    <>
      <path d={HEAD} />
      <path d={NECK} />
      <path d={TORSO} />
      <path d={ARM_L} />
      <path d={ARM_L} transform={mirrored} />
      <path d={LEG_L} />
      <path d={LEG_L} transform={mirrored} />
      <path d={SHOE_L} />
      <path d={SHOE_L} transform={mirrored} />
    </>
  );

  return (
    <svg
      width={(height * VB_W) / VB_H}
      height={height}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{
        display: 'block',
        overflow: 'visible',
        transform: flip ? 'scaleX(-1)' : undefined,
        filter:
          bloom > 0
            ? `drop-shadow(0 0 ${10 * bloom}px ${rim}) drop-shadow(0 0 ${34 * bloom}px ${rim}55)`
            : undefined,
        ...style,
      }}
    >
      <defs>
        {/* Dolgu düz siyah değil: üstte bir tık açık. Kesilmiş kâğıt gibi durmasın. */}
        <linearGradient id={`fill-${id}`} x1="0.2" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={tone} />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      <g
        transform={`translate(${VB_W / 2}, ${VB_H}) rotate(${lean}) scale(${broad}, 1) translate(${-VB_W / 2}, ${-VB_H})`}
      >
        {/* Kontur ışığı: parçalar önce şişirilmiş olarak basılır, sonra üstleri
            dolguyla kapanır. Böylece şerit yalnız dış konturda kalır; kolun
            omza bindiği yerdeki iç dikişler görünmez. */}
        <g fill={rim} stroke={rim} strokeWidth={rimWidth * 2} strokeLinejoin="round">
          {shapes}
        </g>
        <g fill={`url(#fill-${id})`}>{shapes}</g>
      </g>
    </svg>
  );
};

/**
 * Altın madeni — düz sarı daire değil, ışık alan bir nesne.
 * Gerçekçiliği veren dört şey: üst-soldan gelen tek ışık, kenardaki
 * kalınlık, alt kenardan geri yansıyan ışık ve zemine düşen gölge.
 */
export const GoldCoin: React.FC<{
  readonly size: number;
  readonly rotate?: number;
  readonly shadow?: boolean;
  readonly seed?: string;
}> = ({size, rotate = 0, shadow = true, seed = 'c'}) => (
  <svg
    width={size}
    height={size * 1.12}
    viewBox="0 0 200 224"
    style={{display: 'block', transform: `rotate(${rotate}deg)`, overflow: 'visible'}}
  >
    <defs>
      <radialGradient id={`face-${seed}`} cx="0.33" cy="0.26" r="0.88">
        <stop offset="0%" stopColor="#FFF4CE" />
        <stop offset="22%" stopColor="#FFDA79" />
        <stop offset="52%" stopColor="#EDA729" />
        <stop offset="80%" stopColor="#B96E06" />
        <stop offset="100%" stopColor="#7A4102" />
      </radialGradient>
      <linearGradient id={`edge-${seed}`} x1="0.1" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor="#D08D14" />
        <stop offset="40%" stopColor="#8A5103" />
        <stop offset="100%" stopColor="#402200" />
      </linearGradient>
      <linearGradient id={`spec-${seed}`} x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
        <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <radialGradient id={`drop-${seed}`}>
        <stop offset="0%" stopColor="#000000" stopOpacity="0.6" />
        <stop offset="60%" stopColor="#000000" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
      <clipPath id={`clip-${seed}`}>
        <circle cx="100" cy="96" r="90" />
      </clipPath>
    </defs>

    {shadow ? <ellipse cx="100" cy="206" rx="92" ry="17" fill={`url(#drop-${seed})`} /> : null}

    {/* Kenar kalınlığı — madeni düz bir daireden nesneye çeviren şey */}
    <circle cx="100" cy="108" r="90" fill={`url(#edge-${seed})`} />
    {/* Ön yüz */}
    <circle cx="100" cy="96" r="90" fill={`url(#face-${seed})`} />

    <g clipPath={`url(#clip-${seed})`}>
      {/* İç kademe */}
      <circle cx="100" cy="96" r="74" fill="none" stroke="#7A4102" strokeOpacity="0.4" strokeWidth="4" />
      <circle cx="100" cy="93" r="74" fill="none" stroke="#FFE9A8" strokeOpacity="0.4" strokeWidth="3" />
      {/* Alt kenardan geri yansıyan ışık */}
      <path d="M 16 128 A 90 90 0 0 0 184 128" fill="none" stroke="#FFD98A" strokeOpacity="0.34" strokeWidth="9" />
      {/* Üst-soldan tek parlama */}
      <ellipse cx="62" cy="50" rx="58" ry="34" fill={`url(#spec-${seed})`} transform="rotate(-30 62 50)" />
    </g>

    {/* ₿ — kabartma: önce koyu gölge kopyası, üstüne açık yüz */}
    {[
      {dy: 4, color: '#7A4102', opacity: 0.55},
      {dy: 0, color: '#FFE7A0', opacity: 0.92},
    ].map(({dy, color, opacity}) => (
      <g key={dy} transform={`translate(0, ${dy})`} opacity={opacity}>
        <g stroke={color} strokeWidth="13" fill="none" strokeLinecap="square" strokeLinejoin="round">
          <path d="M 80 54 L 80 140" />
          <path d="M 80 60 H 111 A 15 15 0 0 1 111 92 H 80" />
          <path d="M 80 92 H 118 A 17 17 0 0 1 118 134 H 80" />
        </g>
        <g fill={color}>
          <rect x="84" y="38" width="13" height="20" rx="2.5" />
          <rect x="105" y="38" width="13" height="20" rx="2.5" />
          <rect x="84" y="136" width="13" height="20" rx="2.5" />
          <rect x="105" y="136" width="13" height="20" rx="2.5" />
        </g>
      </g>
    ))}
  </svg>
);
