/** Run native HTML5 validation and show the browser tooltip (Bootstrap-style). */
export function reportFormValidity(form: HTMLFormElement): boolean {
  if (form.checkValidity()) return true;
  form.reportValidity();
  return false;
}
