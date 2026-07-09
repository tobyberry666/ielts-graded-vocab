import type { Band } from '../data/words';

export interface BandSelectorProps {
  value: Band;
  onChange: (band: Band) => void;
}

const BANDS: { band: Band; label: string; sub: string }[] = [
  { band: '5', label: 'Band 5', sub: '≈5-6 分' },
  { band: '6', label: 'Band 6', sub: '≈6-7 分' },
  { band: '7', label: 'Band 7', sub: '≈7 分' },
  { band: '8', label: 'Band 8+', sub: '8 分以上' },
];

export default function BandSelector({ value, onChange }: BandSelectorProps) {
  return (
    <div className="band-selector" role="tablist" aria-label="选择难度档位">
      {BANDS.map(({ band, label, sub }) => {
        const active = band === value;
        return (
          <button
            key={band}
            type="button"
            role="tab"
            aria-selected={active}
            className={`band-option${active ? ' is-active' : ''}`}
            onClick={() => onChange(band)}
          >
            <span className="band-option-label">{label}</span>
            <span className="band-option-sub">{sub}</span>
          </button>
        );
      })}
    </div>
  );
}
