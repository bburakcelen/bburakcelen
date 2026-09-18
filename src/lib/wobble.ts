import {random, useCurrentFrame} from 'remotion';

export type Wobble = {x: number; y: number; rotate: number};

/**
 * El çizimi "kaynama" (boil) efekti.
 *
 * Gerçek çizgi film animasyonunda her kare elle çizildiği için konturlar
 * hafifçe oynar. Burada aynı hissi, birkaç karede bir değişen deterministik
 * rastgele ofsetlerle taklit ediyoruz. Remotion'un random()'ı tohum tabanlı
 * olduğu için aynı kare her zaman aynı sonucu verir — render tekrarlanabilir.
 */
export const useWobble = (seed: string, amount = 1.6, hold = 3): Wobble => {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / hold);

  return {
    x: (random(`${seed}-x-${tick}`) - 0.5) * amount * 2,
    y: (random(`${seed}-y-${tick}`) - 0.5) * amount * 2,
    rotate: (random(`${seed}-r-${tick}`) - 0.5) * amount * 0.5,
  };
};

export const wobbleStyle = (w: Wobble): React.CSSProperties => ({
  transform: `translate(${w.x}px, ${w.y}px) rotate(${w.rotate}deg)`,
});
