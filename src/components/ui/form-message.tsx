export function FormMessage({ error, success }: { error?: string; success?: boolean }) {
  if (error) {
    return (
      <p className="rounded-md border border-red-700/20 bg-red-700/5 px-4 py-3 text-sm text-red-700 dark:text-red-400">
        {error}
      </p>
    );
  }
  if (success) {
    return (
      <p className="rounded-md border border-emerald-700/20 bg-emerald-700/5 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
        Saved.
      </p>
    );
  }
  return null;
}
