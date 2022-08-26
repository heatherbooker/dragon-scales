function createElementSVG(shape: string) {
  return document.createElementNS('http://www.w3.org/2000/svg', shape);
}

function clear_staff() {
  document.querySelectorAll('ellipse.notehead').forEach(note => note.remove());
  document.querySelectorAll('rect.ledger').forEach(note => note.remove());
  document.querySelectorAll('path.note-modifier').forEach(sharp => sharp.remove());
}

const distanceBetweenStaffLines = 10; // in pixels?
const svg_bottom = 180; // since size of our svg is 180

// beginning from the ledger line below the staff, count up:
const staff_positions = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ledgerLines = [30, 150]; // highest and lowest notes

function draw_scale(staff: HTMLElement,
                    first: LetterName,
                    notes: RelativeNote[],
                    key_sig: KeySig): void {

  const lowest_cy = (3 + staff_positions.indexOf(first))
                    * distanceBetweenStaffLines;
  const scale_bottom = svg_bottom - lowest_cy;

  let x_position = 200; // enough space for a key sig with 7 symbols

  for (const note of notes) {
    const current_letter = interval_up_letter(first, note.position + 1);
    const y_position = scale_bottom - (note.position *
                                       distanceBetweenStaffLines);

    // draw accid, if necessary
    if (note.accidental) {
      const acc = key_sig[current_letter] + note.accidental;
      draw_accidental(staff, acc, x_position, y_position);
      x_position = x_position + 70;
    } else {
      x_position = x_position + 50;
    }

    draw_note_head(staff, x_position, y_position);

    if (ledgerLines.includes(y_position)) {
      draw_ledger_line(staff, x_position, y_position);
    }
  }
}

function draw_note_head(staff: HTMLElement, x_pos: number, y_pos: number): void {
    const notehead = createElementSVG('ellipse');
    notehead.setAttribute('class', "notehead");
    notehead.setAttribute('cx', x_pos.toString());
    notehead.setAttribute('cy', y_pos.toString());
    notehead.setAttribute('rx', '14');
    notehead.setAttribute('ry', '10');
    staff.appendChild(notehead);
}

function draw_key_sig(staff: HTMLElement, sig: KeySig) {
  const flat_sig_heights: { letter: LetterName, height: number }[] = [
    {letter: LetterName.B, height: 88},
    {letter: LetterName.E, height: 58},
    {letter: LetterName.A, height: 98},
    {letter: LetterName.D, height: 68},
    {letter: LetterName.G, height: 108},
    {letter: LetterName.C, height: 78},
    {letter: LetterName.F, height: 118},
  ];

  const sharp_sig_heights = [
    {letter: LetterName.F, height: 48},
    {letter: LetterName.C, height: 78},
    {letter: LetterName.G, height: 38},
    {letter: LetterName.D, height: 68},
    {letter: LetterName.A, height: 98},
    {letter: LetterName.E, height: 58},
    {letter: LetterName.B, height: 88},
  ];

  // keep track of how far we have moved from the left
  let sig_x_position = 0;

  // -1 is flat, 1 is sharp
  function draw_symbols(accid: number,
                        heights: { letter: LetterName, height: number}[]) {
    for (let k of heights) {
      if (sig[k.letter] === accid) {
        draw_accidental(staff,
                        accid,
                        (20*sig_x_position+35),
                        k.height);
        sig_x_position++;
      }
    }
  }

  // in the key signature, flats come first, then sharps.
  // there isn't really a reason why; that's just the order we chose.
  draw_symbols(-1, flat_sig_heights);
  draw_symbols(1, sharp_sig_heights);
}

function draw_accidental(staff: HTMLElement,
                         accid: number,
                         x_pos: number,
                         y_pos: number) {

  function accidental_svg(accid: number) {
    switch (accid) {
      case -2:
        return DOUBLE_FLAT_SVG_PATH;
      case -1:
        return FLAT_SVG_PATH;
      case 0:
        return NATURAL_SVG_PATH;
      case 1:
        return SHARP_SVG_PATH;
      case 2:
        return DOUBLE_SHARP_SVG_PATH;
      default:
        console.log('invalid accidental number: ', accid);
        return FLAT_SVG_PATH;
    }
  }

  const svg = createElementSVG('path');
  svg.setAttribute('d', accidental_svg(accid));
  svg.setAttribute('class', 'note-modifier');
  svg.setAttribute('transform', `translate(${x_pos+35} , ${y_pos+25})`);
  staff.appendChild(svg);
}

function draw_ledger_line(staff: HTMLElement, cx: number, cy: number) {
  const ledgerLine = createElementSVG('rect');
  ledgerLine.setAttribute('height', '2');
  ledgerLine.setAttribute('width', '44');
  ledgerLine.setAttribute('y', cy.toString());
  ledgerLine.setAttribute('x', (cx-22).toString());
  ledgerLine.setAttribute('class', "ledger");
  staff.appendChild(ledgerLine);
}
