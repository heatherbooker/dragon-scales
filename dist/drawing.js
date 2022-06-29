"use strict";
function createElementSVG(shape) {
    return document.createElementNS('http://www.w3.org/2000/svg', shape);
}
function clear_staff() {
    document.querySelectorAll('ellipse.notehead').forEach(note => note.remove());
    document.querySelectorAll('rect.ledger').forEach(note => note.remove());
    document.querySelectorAll('path.note-modifier').forEach(sharp => sharp.remove());
}
function draw_note_heads(staff, first, accids) {
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
    const distanceBetweenStaffLines = 10;
    const lowest_cy = (6 + notes.indexOf(first)) * distanceBetweenStaffLines;
    const bottom = 200; // since size of our svg is 200
    const ledgerLines = [10, 130]; // highest and lowest notes
    let x_position = 200;
    let y_position = bottom - lowest_cy;
    // FIXME: some scales don't have 7 notes
    for (let i = 0; i < 7; i++) {
        const notehead = createElementSVG('ellipse');
        notehead.setAttribute('class', "notehead");
        y_position = y_position - distanceBetweenStaffLines;
        // draw accid, if necessary
        if (accids[i]) {
            x_position = x_position + 35;
            // FIXME other accidentals besides sharp are sometimes needed
            draw_accidental(staff, SHARP_SVG_PATH, x_position, y_position + 25);
            x_position = x_position + 35;
        }
        else {
            x_position = x_position + 50;
        }
        notehead.setAttribute('cx', x_position.toString());
        notehead.setAttribute('cy', y_position.toString());
        notehead.setAttribute('rx', '14');
        notehead.setAttribute('ry', '10');
        staff.appendChild(notehead);
        if (ledgerLines.includes(y_position)) {
            draw_ledger_line(staff, y_position, (x_position - 22));
        }
    }
}
function draw_key_sig(staff, sig) {
    const flat_sig_heights = [83, 53, 93, 63, 103, 73, 113];
    const sharp_sig_heights = [53, 83, 43, 73, 103, 63, 93];
    function draw_symbols(svg, positions, quantity) {
        positions.slice(0, quantity).forEach((pos, idx) => {
            draw_accidental(staff, svg, (20 * idx) + 70, pos);
        });
    }
    draw_symbols(SHARP_SVG_PATH, sharp_sig_heights, sig.sharps);
    draw_symbols(FLAT_SVG_PATH, flat_sig_heights, sig.flats);
}
function draw_accidental(staff, svg, x_pos, y_pos) {
    const sharp = createElementSVG('path');
    sharp.setAttribute('d', svg);
    sharp.setAttribute('class', 'note-modifier');
    sharp.setAttribute('transform', `translate(${x_pos} , ${y_pos})`);
    //   sharp.setAttribute('cx', x_pos.toString());
    //   sharp.setAttribute('cy', y_pos.toString());
    staff.appendChild(sharp);
}
function draw_ledger_line(staff, cy, cx) {
    const ledgerLine = createElementSVG('rect');
    ledgerLine.setAttribute('height', '2');
    ledgerLine.setAttribute('width', '44');
    ledgerLine.setAttribute('y', cy.toString());
    ledgerLine.setAttribute('x', cx.toString());
    ledgerLine.setAttribute('class', "ledger");
    staff.appendChild(ledgerLine);
}
