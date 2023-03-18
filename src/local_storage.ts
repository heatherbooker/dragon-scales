function add_checkbox_savers() {
  const checkboxen: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[type = "checkbox"]');
  checkboxen.forEach((checkbox) => {
    checkbox.onchange = (event: any) => {
      const settings = loadSettings();
      const checked: boolean = event.target.checked;
      if (checked) {
        settings.checkboxen.push(checkbox.id);
      } else {
        settings.checkboxen = settings.checkboxen.filter(value => value !== checkbox.id);
      }
      localStorage.setItem('ds-settings', JSON.stringify(settings));
    };
  });
}

function loadSettings(): Settings {
  const settingsString = localStorage.getItem('ds-settings');
  const default_settings = {
    sig_complexity: 4,
    checkboxen: [
      "ionian", "melodic-minor", "harmonic-minor", "harmonic-major",
    ]
  };
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

function applySettings() {
  const settings = loadSettings();
  const checkboxen: NodeListOf<HTMLInputElement> =
    document.querySelectorAll('input[type = "checkbox"]');
  checkboxen.forEach((checkbox) => {
    if (settings.checkboxen.includes(checkbox.id)) {
      checkbox.checked = true;
    }
  });
}

