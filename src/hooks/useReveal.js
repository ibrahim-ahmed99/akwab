import { useEffect } from 'react';

/**
 * Adds `.in` to any element with `.reveal` once it enters the viewport.
 * Mount once at the app root; it self-observes newly-mounted nodes too.
 */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const observe = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    };
    observe();

    // Watch for DOM changes so freshly-rendered .reveal nodes get picked up.
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}
