<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>dragon scales</title>

    <link rel="stylesheet" href="styles.css">
  </head>

  <body>
    <script src="dist/types.js"></script>
    <script src="dist/local_storage.js"></script>
    <script src="dist/svgpaths.js"></script>
    <script src="dist/drawing.js"></script>
    <script src="dist/selecting.js"></script>
    <script src="dist/difficulty.js"></script>
    <script src="dist/scripts.js"></script>

    <main>
      <div class="header">
        <button id="back-button">&#x1F870;</button>
        <button id="go-button">&#x1F872;</button>

        <h2 id="scale-description">JavaScript is disabled.</h2>
      </div>

      <div class="staff">
        m4_undivert(`src/blobs/staff-treble')
      </div>

      <br /> <br />

      <div class="checkboxen twocol" id="mains-and-modes">
        <label>
          <input type="checkbox" id="ionian" /> ionian (major)
        </label>
        <label>
          <input type="checkbox" id="melodic-minor" /> melodic minor
        </label>
        <label>
          <input type="checkbox" id="harmonic-minor" /> harmonic minor
        </label>
        <label>
          <input type="checkbox" id="harmonic-major" /> harmonic major
        </label>
        <label>
          <input type="checkbox" id="double-harmonic" /> double harmonic
        </label>
        <label>
          <input type="checkbox" id="modes-ionian" /> modes of ionian
        </label>
        <label>
          <input type="checkbox" id="memimos" />
          modes of melodic minor (memimos)
        </label>
        <label>
          <input type="checkbox" id="modes-harmonic-minor" />
          modes of harmonic minor
        </label>
        <label>
          <input type="checkbox" id="modes-harmonic-major" />
          modes of harmonic major
        </label>
        <label>
          <input type="checkbox" id="modes-double-harmonic" />
          modes of double harmonic
        </label>
      </div>

      <br />

      <div class="checkboxen twocol" id="hexatonic">
        <label>
          <input type="checkbox" id="major-hexatonic" /> major hexatonic
        </label>
        <label><input type="checkbox" id="blues" /> blues</label>
        <label><input type="checkbox" id="prometheus" /> Prometheus</label>
        <label><input type="checkbox" id="augmented" /> augmented</label>
        <label><input type="checkbox" id="whole-tone" /> whole-tone</label>
        <label>
          <input type="checkbox" id="minor-hexatonic" /> minor hexatonic
        </label>
        <label><input type="checkbox" id="major-blues" /> major blues</label>
        <label><input type="checkbox" id="petrushka" /> Petrushka</label>
        <label>
          <input type="checkbox" id="two-semitone-tritone" />
          2-semitone tritone
        </label>
      </div>

      <br />

      <div class="checkboxen twocol" id="octatonic">
        <label>
          <input type="checkbox" id="oct-dim" /> octatonic (diminished)
        </label>
        <label>
          <input type="checkbox" id="oct-dom" /> octatonic (dominant)
        </label>
      </div>

      <br />

      <div class="checkboxen" id="subsets">
        <label><input type="checkbox" id="majors" /> all major scales</label>
        <label><input type="checkbox" id="minors" /> all minor scales</label>
        <label>
          <input type="checkbox" id="dominants" /> all dominant scales
        </label>
        <label>
          <input type="checkbox" id="hexatonic" /> all hexatonic scales
        </label>
        <label>
          <input type="checkbox" id="octatonic" /> all octatonic scales
        </label>
      </div>

      <br />

      <div class="complexity-slider">
        <label>Key signature complexity </label>
        <input type="range" id="max-sig-input"
               min="0" max="7" step="1" style="margin-bottom: 25px"
               oninput="save_sig_complexity(this.value)" />
      </div>

      <br />
    </main>

    <footer>
      dragon &#x1F409; scales
      m4_syscmd(`git describe --always --dirty --tags')
      (<a href=https://gitlab.com/danso/dragon-scales>code</a>)
      by <a href=https://danso.ca>danso</a>
      and <a href=https://hboo.ca>hboo</a>
    </footer>

  </body>
</html>
