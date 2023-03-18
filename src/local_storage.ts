const settings_sig_complexity = 'settings-sig-complexity'
const settings_checked_boxen = 'settings-checked-boxen'


function add_checkbox_savers() {
  const checkboxen = get_checkboxen();
  let checked: string[] = load_checked_boxen();
  checkboxen.forEach((checkbox) => {
    checkbox.onchange = (event: any) => {
      const is_checked: boolean = event.target.checked;
      if (is_checked) {
        checked.push(checkbox.id);
      } else {
        checked = checked.filter(value => value !== checkbox.id);
      }
      localStorage.setItem(settings_checked_boxen, JSON.stringify(checked));
    };
  });
}


function save_sig_complexity(n: number): void {
  localStorage.setItem(settings_sig_complexity, n.toString());
}

function applySettings() {
  apply_checked_boxen();
  apply_sig_complexity();
}

function load_checked_boxen(): string[] {
  const settingsString = localStorage.getItem(settings_checked_boxen);
  const default_settings = [
      "ionian", "melodic-minor", "harmonic-minor", "harmonic-major",
    ];
  if (typeof settingsString === 'string') {
    try {
      return JSON.parse(settingsString);
    } catch {
      return default_settings;
    }
  } else {
    return default_settings;
  }
}

function load_sig_complexity(): number {
  const default_setting = 4;
  const settingsString = localStorage.getItem(settings_sig_complexity);
  if (settingsString === null) {
    return default_setting;
  }
  const setting = Number(settingsString);
  return (isNaN(setting)) ? default_setting : setting;
}

function apply_checked_boxen() {
  const checked_boxen: string[] = load_checked_boxen();
  const checkboxen = get_checkboxen();
  checkboxen.forEach((checkbox) => {
    if (checked_boxen.includes(checkbox.id)) {
      checkbox.checked = true;
    }
  });
}

function apply_sig_complexity() {
  const setting = load_sig_complexity();
  const sig_complexity_slider = get_sig_complexity_slider();
  sig_complexity_slider.value = setting.toString();
}
