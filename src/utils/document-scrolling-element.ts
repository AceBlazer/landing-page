// polyfill for browsers that don't support document.scrollingElement
const documentScrollingElement =
  typeof window !== "undefined"
    ? window.document.scrollingElement
      ? (window.document.scrollingElement as HTMLElement)
      : // IE <= 11 doesn't support scrollElement, but we can assume it is documentElement
        window.document.documentElement
    : null;

export default documentScrollingElement;
