import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TIMELINE, timecode} from '../script/timeline';
import {C, FONT, VIDEO} from '../theme';

// Geliştirme aracı: sahneleri küçültülmüş bir ızgarada yan yana gösterir.
// Tüm videoyu render etmeden bütünü görmek için. Final videoda kullanılmaz.

const COLS = 4;
const ROWS = 4;
const PER_PAGE = COLS * ROWS;

export type ContactSheetProps = {readonly page: number};

export const ContactSheet: React.FC<ContactSheetProps> = ({page}) => {
  const slice = TIMELINE.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const cellW = VIDEO.width / COLS;
  const cellH = VIDEO.height / ROWS;
  const scale = cellW / VIDEO.width;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', display: 'flex', flexWrap: 'wrap'}}>
      {slice.map((e) => (
        <div
          key={e.beat.id}
          style={{width: cellW, height: cellH, position: 'relative', overflow: 'hidden', outline: '1px solid #000'}}
        >
          <div
            style={{
              position: 'absolute',
              width: VIDEO.width,
              height: VIDEO.height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {e.beat.node}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              right: 0,
              background: 'rgba(0,0,0,0.72)',
              color: C.text,
              fontFamily: FONT.body,
              fontWeight: 800,
              fontSize: 15,
              padding: '4px 8px',
            }}
          >
            {String(e.index + 1).padStart(2, '0')} · {e.beat.id} · {timecode(e.from)} · {e.seconds.toFixed(1)}s
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
