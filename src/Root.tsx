import React from 'react';
import {Composition} from 'remotion';
import {CharacterSheet} from './dev/CharacterSheet';
import {ContactSheet} from './dev/ContactSheet';
import {loadFonts} from './fonts';
import {Master} from './Master';
import {ThumbA, ThumbB, ThumbC, ThumbD} from './thumbnail/Thumbnails';
import {buildTimeline} from './script/timeline';
import type {LocaleId} from './script/text';
import {VIDEO} from './theme';

loadFonts();

const LOCALE_IDS: readonly LocaleId[] = ['en', 'de'];

/**
 * Her dil için: bir Master videosu + her sahnenin kendi kompozisyonu.
 * İngilizce kimlikler öneksiz (Master, s01-welcome), Almanca "de-" önekli
 * (de-Master, de-s01-welcome) — mevcut render komutları bozulmasın diye.
 */
export const RemotionRoot: React.FC = () => (
  <>
    {LOCALE_IDS.map((locale) => {
      const {entries, totalFrames} = buildTimeline(locale);
      const prefix = locale === 'en' ? '' : `${locale}-`;

      return (
        <React.Fragment key={locale}>
          <Composition
            id={`${prefix}Master`}
            component={Master}
            durationInFrames={totalFrames}
            fps={VIDEO.fps}
            width={VIDEO.width}
            height={VIDEO.height}
            defaultProps={{locale}}
          />

          {entries.map((e) => (
            <Composition
              key={e.compositionId}
              id={e.compositionId}
              component={() => <>{e.beat.node}</>}
              durationInFrames={e.durationInFrames}
              fps={VIDEO.fps}
              width={VIDEO.width}
              height={VIDEO.height}
            />
          ))}
        </React.Fragment>
      );
    })}

    {LOCALE_IDS.flatMap((locale) =>
      [0, 1, 2, 3].map((page) => (
        <Composition
          key={`${locale}-sheet-${page}`}
          id={`Dev${locale === 'en' ? '' : 'De'}ContactSheet${page + 1}`}
          component={ContactSheet}
          durationInFrames={60}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
          defaultProps={{page, locale}}
        />
      )),
    )}

    {/* YouTube kapakları — 1280x720, still olarak basılır */}
    {([['ThumbA', ThumbA], ['ThumbB', ThumbB], ['ThumbC', ThumbC], ['ThumbD', ThumbD]] as const).map(([id, comp]) => (
      <Composition
        key={id}
        id={id}
        component={comp}
        durationInFrames={60}
        fps={VIDEO.fps}
        width={1280}
        height={720}
      />
    ))}

    <Composition
      id="DevCharacterSheet"
      component={CharacterSheet}
      durationInFrames={120}
      fps={VIDEO.fps}
      width={1920}
      height={1200}
    />
  </>
);
