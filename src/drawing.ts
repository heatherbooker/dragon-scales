function createElementSVG(shape: string) {
  return document.createElementNS('http://www.w3.org/2000/svg', shape);
}

function clear_staff() {
  document.querySelectorAll('ellipse.notehead').forEach(note => note.remove());
  document.querySelectorAll('rect.ledger').forEach(note => note.remove());

  document.querySelectorAll('path.flat').forEach(flat => flat.remove());
  document.querySelectorAll('path.sharp').forEach(sharp => sharp.remove());
}

function draw_note_heads(staff: HTMLElement, first: LetterName): void {
  let staffNoteheadsCounter = 0;
  const notes =
    ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const lowestNote = 7; // C
  let position = lowestNote + notes.indexOf(first);

  const distanceBetweenStaffLines = 10;

  const lowestCy = 200; // since size of our svg is 200

  for (let highest = position+7 ; position < highest ; position++) {
    const notehead = createElementSVG('ellipse');
    notehead.setAttribute('class', "notehead");

    const cx = 250 + staffNoteheadsCounter * 50;
    notehead.setAttribute('cx', cx.toString()); // distance between notes

    const cy = lowestCy - (distanceBetweenStaffLines * position);
    notehead.setAttribute('cy', cy.toString());
    notehead.setAttribute('rx', '14');
    notehead.setAttribute('ry', '10');

    staff.appendChild(notehead);
    staffNoteheadsCounter++;

    const ledgerLines = [10, 130]; // highest and lowest notes
    if (ledgerLines.includes(cy)) {
      const ledgerLine = createElementSVG('rect');
      ledgerLine.setAttribute('height', '2');
      ledgerLine.setAttribute('width', '44');
      ledgerLine.setAttribute('y', cy.toString());
      ledgerLine.setAttribute('x', (cx - 22).toString());
      ledgerLine.setAttribute('class', "ledger");
      staff.appendChild(ledgerLine);
    }
  }
}

function draw_key_sig(staff: HTMLElement, sig: KeySig) {
  const flat_sig_heights = [ 83, 53, 93, 63, 103, 73, 113 ];
  const sharp_sig_heights = [ 53, 83, 43, 73, 103, 63, 93 ];

  function draw_symbols(svg: string, positions: number[], quantity: number) {
    positions.slice(0, quantity).forEach((pos, idx) => {
      const sharp = createElementSVG('path');
      sharp.setAttribute('d', svg);
      sharp.setAttribute('class', 'sharp');
      const sharp_x = 70 + 20*idx;
      const sharp_y = pos;
      sharp.setAttribute('transform', `translate(${sharp_x} , ${sharp_y})`);
      staff.appendChild(sharp);
    });
  }

  draw_symbols(SHARP_SVG_PATH, sharp_sig_heights, sig.sharps);
  draw_symbols(FLAT_SVG_PATH, flat_sig_heights, sig.flats);
}

