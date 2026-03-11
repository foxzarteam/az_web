export function scrollToElement(elementId: string, behavior: ScrollBehavior = "smooth"): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior });
  }
}

export function scrollToTop(behavior: ScrollBehavior = "smooth"): void {
  window.scrollTo({ top: 0, behavior });
}
