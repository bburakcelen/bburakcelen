import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FONT} from '../theme';

/**
 * Hazır bir kapak görselinin üstüne basılacak yazı katmanı.
 *
 * Kullanıcının kendi ürettiği kapak iyi duruyor; değişmesi gereken tek
 * şey metin. "see you at 1,000,000" bir kripto kanalında fiyat hedefi
 * gibi okunabiliyor — neyin bir milyonu olduğu söylenmeli. Üçüncü satır
 * bunu çözerken bloğu aşağı uzatıp sol alttaki ölü alanı da dolduruyor.
 *
 * Zemin şeffaf basılır; PIL ile asıl görselin üstüne bindirilir.
 * Ölçüler 1672x941'e göre, yani kaynak görselin kendi boyutuna.
 */

const CYAN = '#16EAD9';
const INK = '#06131A';

/** Kullanıcının bloğundaki köşe kesikleri — tasarım dili korunuyor. */
const NOTCH = 'polygon(34px 0, 100% 0, 100% calc(100% - 34px), calc(100% - 34px) 100%, 0 100%, 0 34px)';

export const ThumbOverlay: React.FC = () => (
  <AbsoluteFill>
    {/* Kanal imzası — üst sol boşluğu dolduruyor, aynı zamanda marka tekrarı */}
    <div
      style={{
        position: 'absolute',
        left: 44,
        top: 122,
        fontFamily: FONT.ui,
        fontWeight: 700,
        fontSize: 40,
        letterSpacing: '0.34em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.82)',
        textShadow: '0 2px 18px rgba(0,0,0,0.8)',
      }}
    >
      TwoSide Boys
    </div>

    {/* Blok: eskisinin tam üstünü kapatacak biçimde aynı köşeden başlıyor */}
    <div
      style={{
        position: 'absolute',
        left: 28,
        top: 239,
        background: CYAN,
        clipPath: NOTCH,
        padding: '34px 48px 40px',
        // Eski bloğun sağ kenarı açıkta kalmasın (o 784'e kadar gidiyordu)
        minWidth: 764,
        boxSizing: 'border-box',
        filter: 'drop-shadow(0 26px 60px rgba(0,0,0,0.55))',
      }}
    >
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 700,
          fontSize: 130,
          lineHeight: 1.02,
          letterSpacing: '-0.035em',
          color: INK,
        }}
      >
        see you at
      </div>
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 800,
          fontSize: 130,
          lineHeight: 1.02,
          letterSpacing: '-0.04em',
          color: INK,
        }}
      >
        1,000,000
      </div>
      <div
        style={{
          fontFamily: FONT.ui,
          fontWeight: 700,
          fontSize: 54,
          lineHeight: 1.1,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: INK,
          opacity: 0.86,
          marginTop: 14,
        }}
      >
        subscribers
      </div>
    </div>
  </AbsoluteFill>
);
