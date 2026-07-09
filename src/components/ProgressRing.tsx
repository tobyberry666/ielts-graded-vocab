export interface ProgressRingProps {
  /** 进度比例，取值范围 0-1。 */
  value: number;
  /** 圆环直径，默认 72。 */
  size?: number;
  /** 圆环线宽，默认 8。 */
  stroke?: number;
  /** 圆心显示的文本（如「3/10」）。 */
  label?: string;
}

export default function ProgressRing({
  value,
  size = 72,
  stroke = 8,
  label,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  const center = size / 2;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="progress-ring-track"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="progress-ring-value"
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      {label && <span className="progress-ring-label">{label}</span>}
    </div>
  );
}
