export function typewriter(
  full: string,
  onUpdate: (partial: string) => void,
  stepMs = 15
): { cancel: () => void; done: Promise<void> } {
  let i = 0;
  let cancelled = false;
  let resolve!: () => void;
  const done = new Promise<void>((r) => (resolve = r));

  const tick = () => {
    if (cancelled) return resolve();
    if (i >= full.length) return resolve();
    i++;
    onUpdate(full.slice(0, i));
    setTimeout(tick, stepMs);
  };

  tick();

  return {
    cancel: () => {
      cancelled = true;
      resolve();
    },
    done,
  };
}
