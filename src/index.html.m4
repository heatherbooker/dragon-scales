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
        <button id="back-button">&#x1F870</button>
        <button id="go-button">&#x1F872</button>

        <h2 id="scale-description">JavaScript is disabled.</h2>
      </div>

      <div class="staff">
        m4_undivert(`src/blobs/staff-treble')
      </div>

      <br /> <br /> <br /> <br />


      <div class="checkboxen" id="others">
        <label><input type="checkbox" id="majors" /> all major scales</label>
        <label><input type="checkbox" id="minors" /> all minor scales</label>
        <label>
          <input type="checkbox" id="dominants" /> all dominant scales
        </label>
      <!--
      <label>
        <input type="checkbox" id="altered-dominant" />altered dominant
      </label>
      <label>
        <input type="checkbox" id="lydian-dominant" />Lydian dominant
      </label>
      <label><input type="checkbox" id="chromatic" />chromatic</label>
      <label><input type="checkbox" id="octatonic" />octatonic</label>
      <label><input type="checkbox" id="hexatonic" />hexatonic</label>
      <label><input type="checkbox" id="pentatonic" />pentatonic</label>
      <label><input type="checkbox" id="whole-tone" />whole tone</label>
      <label>
        <input type="checkbox" id="contrary-motion" />contrary motion
      </label>
      <label>
        <input type="checkbox" id="rhythmic-patterns" />rhythmic patterns
      </label>
      <label><input type="checkbox" id="cross-rhythms" />cross rhythms</label>
      <label>
        <input type="checkbox" id="fingering-constraints" />fingering constraints
      </label>
      <label><input type="checkbox" id="dan" />full-on dan</label>
      -->
      </div>

      <br />

      <div class="checkboxen" id="mains-and-modes">
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

      <div class="checkboxen" id="funky">
        <label><input type="checkbox" id="blues" /> blues</label>
      </div>

      <br />

      <div class="complexity-slider">
        <label>Key signature complexity </label>
        <input type="range" id="max-sig-input"
               min="0" max="7" step="1" style="margin-bottom: 25px" />
      </div>

      <br />
    </main>

    <footer>
      dragon scales m4_syscmd(`git describe --always --dirty --tags')
      (<a href=https://gitlab.com/danso/dragon-scales>code</a>)
      by <a href=https://danso.ca>danso</a>
      and <a href=https://hboo.ca>hboo</a>
    </footer>

  </body>
</html>
