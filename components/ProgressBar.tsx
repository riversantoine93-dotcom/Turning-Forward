export default function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress-wrap" aria-label={`${value}% complete`}>
      <div className="progress-meta"><span>Course progress</span><strong>{value}%</strong></div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
