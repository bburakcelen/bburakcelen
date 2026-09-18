// Remotion CLI yapılandırması.
// Not: Buradaki ayarlar yalnızca CLI (studio / render) için geçerlidir.
// Node API (@remotion/renderer) ile render alırken aynı değerleri
// fonksiyona parametre olarak geçmen gerekir.
// Dokümantasyon: https://www.remotion.dev/docs/config

import {Config} from '@remotion/cli/config';

Config.setEntryPoint('./src/index.ts');

// H.264 + jpeg kare formatı en hızlı ve en uyumlu kombinasyon.
Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');

// Aynı dosyaya tekrar render alındığında üzerine yazsın.
Config.setOverwriteOutput(true);

// Kalite / dosya boyutu dengesi (0 = en iyi kalite, 51 = en kötü).
Config.setCrf(18);
