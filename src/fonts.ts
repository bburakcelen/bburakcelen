// Fontlar public/fonts altından yüklenir; render sırasında internet gerekmez.
// delayRender ile Remotion, fontlar hazır olana kadar ilk kareyi çizmeyi bekler.

import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

const LATIN_EXT =
  'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF';

type Spec = {family: string; weight: number; subset: 'latin' | 'latin-ext'};

const SPECS: Spec[] = [
  {family: 'Fredoka', weight: 500, subset: 'latin'},
  {family: 'Fredoka', weight: 500, subset: 'latin-ext'},
  {family: 'Fredoka', weight: 600, subset: 'latin'},
  {family: 'Fredoka', weight: 600, subset: 'latin-ext'},
  {family: 'Fredoka', weight: 700, subset: 'latin'},
  {family: 'Fredoka', weight: 700, subset: 'latin-ext'},
  {family: 'Nunito', weight: 700, subset: 'latin'},
  {family: 'Nunito', weight: 700, subset: 'latin-ext'},
  {family: 'Nunito', weight: 800, subset: 'latin'},
  {family: 'Nunito', weight: 800, subset: 'latin-ext'},
];

let started = false;

export const loadFonts = () => {
  if (started || typeof document === 'undefined') {
    return;
  }
  started = true;

  const handle = delayRender('Fontlar yükleniyor');

  Promise.all(
    SPECS.map(async (spec) => {
      const url = staticFile(`fonts/${spec.family}-${spec.weight}-${spec.subset}.woff2`);
      const face = new FontFace(spec.family, `url(${url}) format('woff2')`, {
        weight: String(spec.weight),
        style: 'normal',
        unicodeRange: spec.subset === 'latin' ? LATIN : LATIN_EXT,
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => cancelRender(err));
};
