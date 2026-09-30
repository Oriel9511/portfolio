// One height for everything: sections, scroll targets and progress all use the visible viewport,
// so phones with a collapsing browser bar never drift out of alignment.
export const slideHeight = () => (typeof window === 'undefined' ? 900 : window.innerHeight);

export function syncSlideHeight() {
  document.documentElement.style.setProperty('--slide-h', `${slideHeight()}px`);
}
