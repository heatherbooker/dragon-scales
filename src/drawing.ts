function createElementSVG(shape: string) {
  return document.createElementNS('http://www.w3.org/2000/svg', shape);
}

function clear_staff() {
  document.querySelectorAll('ellipse.notehead').forEach(note => note.remove());
  document.querySelectorAll('rect.ledger').forEach(note => note.remove());
  document.querySelectorAll('path.note-modifier').forEach(sharp => sharp.remove());
}

function draw_note_heads(staff: HTMLElement,
                         first: LetterName,
                         accids: Accidentals,
                         key_sig: KeySig): void {
  const notes =
    ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];

  const distanceBetweenStaffLines = 10;
  const lowest_cy = (6 + notes.indexOf(first)) * distanceBetweenStaffLines;
  const bottom = 200; // since size of our svg is 200
  const ledgerLines = [10, 130]; // highest and lowest notes

  let x_position = 200;
  let y_position = bottom - lowest_cy;

  // FIXME: some scales don't have 7 notes
  let current_letter = first;
  for (let i = 0; i < 7; i++) {
    const notehead = createElementSVG('ellipse');
    notehead.setAttribute('class', "notehead");

    y_position = y_position - distanceBetweenStaffLines;

    // draw accid, if necessary
    if (accids[current_letter]) {
      const acc = accidental_svg(key_sig[current_letter]
                                 + accids[current_letter]);
      x_position = x_position + 35;
      draw_accidental(staff, acc, x_position, y_position+25);
      x_position = x_position + 35;
    } else {
      x_position = x_position + 50;
    }

    notehead.setAttribute('cx', x_position.toString());
    notehead.setAttribute('cy', y_position.toString());
    notehead.setAttribute('rx', '14');
    notehead.setAttribute('ry', '10');

    staff.appendChild(notehead);

    if (ledgerLines.includes(y_position)) {
      draw_ledger_line(staff, y_position, (x_position-22));
    }

    // up a second to the next letter name
    current_letter = interval_up_letter(current_letter, 2);
  }
}

function draw_key_sig(staff: HTMLElement, sig: KeySig) {
  const sharp_sig_heights = [
    {letter: LetterName.F, height: 53},
    {letter: LetterName.C, height: 83},
    {letter: LetterName.G, height: 43},
    {letter: LetterName.D, height: 73},
    {letter: LetterName.A, height: 103},
    {letter: LetterName.E, height: 63},
    {letter: LetterName.B, height: 93},
  ];

  const flat_sig_heights: { letter: LetterName, height: number }[] = [
    {letter: LetterName.B, height: 83},
    {letter: LetterName.E, height: 53},
    {letter: LetterName.A, height: 93},
    {letter: LetterName.D, height: 63},
    {letter: LetterName.G, height: 103},
    {letter: LetterName.C, height: 73},
    {letter: LetterName.F, height: 113},
  ];

  // keep track of how far we have moved from the left
  let sig_x_position = 0;

  // -1 is flat, 1 is sharp
  function draw_symbols(svg: string, symbol_numeric_repr: number,
                        heights: { letter: LetterName, height: number}[]) {
    for (let k of heights) {
      if (sig[k.letter] === symbol_numeric_repr) {
        draw_accidental(staff,
                        svg,
                        (20*sig_x_position+70),
                        heights[sig_x_position].height);
        sig_x_position++;
      }
    }
  }

  // in the key signature, flats come first, then sharps.
  // there isn't really a reason why; that's just the order we chose.
  draw_symbols(FLAT_SVG_PATH, -1, flat_sig_heights);
  draw_symbols(SHARP_SVG_PATH, 1, sharp_sig_heights);
}

function draw_accidental(staff: HTMLElement,
                         svg: string,
                         x_pos: number,
                         y_pos: number) {
  const sharp = createElementSVG('path');
  sharp.setAttribute('d', svg);
  sharp.setAttribute('class', 'note-modifier');
  sharp.setAttribute('transform', `translate(${x_pos} , ${y_pos})`);
//   sharp.setAttribute('cx', x_pos.toString());
//   sharp.setAttribute('cy', y_pos.toString());
  staff.appendChild(sharp);
}

function draw_ledger_line(staff: HTMLElement, cy: number, cx: number) {
  const ledgerLine = createElementSVG('rect');
  ledgerLine.setAttribute('height', '2');
  ledgerLine.setAttribute('width', '44');
  ledgerLine.setAttribute('y', cy.toString());
  ledgerLine.setAttribute('x', cx.toString());
  ledgerLine.setAttribute('class', "ledger");
  staff.appendChild(ledgerLine);
}

function accidental_svg(accid: number) {
  switch (accid) {
    case -2:
      console.log('make an svg for double-flat');
      return DOUBLE_FLAT_SVG_PATH;
    case -1:
      return FLAT_SVG_PATH;
    case 0:
      return NATURAL_SVG_PATH;
    case 1:
      return SHARP_SVG_PATH;
    case 2:
      console.log('make an svg for double-sharp');
      return DOUBLE_SHARP_SVG_PATH;
    default:
      console.log('invalid accidental number: ', accid);
      return FLAT_SVG_PATH;
  }
}
