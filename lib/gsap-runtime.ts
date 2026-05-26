export interface GsapRuntime {
  gsap: {
    registerPlugin: (...plugins: unknown[]) => void;
    context: (fn: () => void, scope?: Element | null) => { revert: () => void };
    fromTo: (target: unknown, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => unknown;
    to: (target: unknown, vars: Record<string, unknown>) => unknown;
    set: (target: unknown, vars: Record<string, unknown>) => unknown;
    killTweensOf: (targets: unknown) => void;
  };
  ScrollTrigger: {
    create: (vars: Record<string, unknown>) => { kill: () => void };
  };
}

let runtimePromise: Promise<GsapRuntime | null> | null = null;

export function loadGsapRuntime(): Promise<GsapRuntime | null> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (!runtimePromise) {
    runtimePromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([gsapModule, scrollTriggerModule]) => {
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        return {
          gsap,
          ScrollTrigger,
        } as GsapRuntime;
      })
      .catch(() => null);
  }

  return runtimePromise;
}
