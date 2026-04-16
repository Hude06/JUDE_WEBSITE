export function SeparatorBlock() {
  return (
    <div className="mx-auto max-w-[var(--container-wide)] px-6 md:px-10 py-[var(--space-section-sm)]">
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-[color:var(--color-hairline-strong)] to-transparent"
      />
    </div>
  );
}
