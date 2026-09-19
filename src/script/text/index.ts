import {de} from './de';
import {en, type Locale} from './en';

export type LocaleId = 'en' | 'de';

export const LOCALES: Record<LocaleId, Locale> = {en, de};

/** Kompozisyon kimliklerinde kullanılan önek: İngilizce öneksiz kalır. */
export const localePrefix = (id: LocaleId) => (id === 'en' ? '' : `${id}-`);

export type {Locale};
