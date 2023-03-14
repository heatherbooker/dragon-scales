function get_key_sig_complexity() {
  const complexity: HTMLInputElement =
    document.querySelector('#max-sig-input') as HTMLInputElement;
  return Number(complexity.value);
};
