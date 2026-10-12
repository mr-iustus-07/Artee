export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <div className="border border-border/70 p-6">
      <span className="eyebrow">{label}</span>
      <p className="mt-3 font-display text-4xl text-ink">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-muted">{sublabel}</p>}
    </div>
  );
}
