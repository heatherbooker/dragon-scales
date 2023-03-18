function get_key_sig_complexity(): number {
  const complexity: HTMLInputElement =
    document.querySelector('#max-sig-input') as HTMLInputElement;
  return Number(complexity.value);
};

function get_html_element(str: string): HTMLElement {
  return document.querySelector(str) as HTMLElement;
}

function get_sig_complexity_slider(): HTMLInputElement {
  return document.querySelector(
    'input[id = "max-sig-input"]'
    ) as HTMLInputElement;
}

function get_checkboxen(): NodeListOf<HTMLInputElement> {
  return document.querySelectorAll('input[type = "checkbox"]');
}

function get_checked_boxen(): Set<CheckBoxen> {
  const checked_boxen = new Set<CheckBoxen>();

  const checkboxen: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[type = "checkbox"]');

  checkboxen.forEach((checkbox) => {
    checkbox.checked && checked_boxen.add(checkbox.id as CheckBoxen);
  });

  return checked_boxen;
};


function get_back_button(): HTMLInputElement {
  return document.querySelector('#back-button') as HTMLInputElement;
}
