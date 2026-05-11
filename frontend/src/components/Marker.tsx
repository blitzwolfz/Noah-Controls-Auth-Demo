type MarkerProps = { num: string; label: string };

export default function Marker({ num, label }: MarkerProps) {
  return (
    <div className="marker">
      <span className="num">{num}</span>
      <span>{label}</span>
      <span className="dash" />
    </div>
  );
}
