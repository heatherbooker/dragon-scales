function get_key_sig_complexity(): number {
  const complexity: HTMLInputElement =
    document.querySelector('#max-sig-input') as HTMLInputElement;
  return Number(complexity.value);
};

function get_html_element(str: string): HTMLElement {
  return document.querySelector(str) as HTMLElement;
}
