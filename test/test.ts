window.addEventListener('load', () => {

async function test(message: string, testFn: () => Promise<boolean>) {
  const passed = await testFn();
  if (passed) {
    console.log('Test passed:', message)
  } else {
    console.error('Test failed:', message);
  }
}

function clickGo() {
  const goButton = document.querySelector<HTMLInputElement>('button#go-button');
  goButton.click();
}

test('when you click "go", the scale label changes', () => {
  const initialText = document.querySelector('#scale-flavour').innerHTML;
  clickGo();
  return new Promise(resolve => {
    setTimeout(() => {
      const newText = document.querySelector('#scale-flavour').innerHTML;

      resolve(initialText !== newText);
    }, 10); // wait until DOM is updated :)
  });
});

test('when you click "go", the staff svg changes', () => {
  const initialSvg = document.querySelector('.staff svg').innerHTML;
  clickGo();
  return new Promise(resolve => {
    setTimeout(() => {
      const newSvg = document.querySelector('.staff svg').innerHTML;
      resolve(initialSvg !== newSvg);
    }, 10); // wait until DOM is updated :)
  });
});

function getCheckboxen(): NodeListOf<HTMLInputElement> {
  return document.querySelectorAll('input[type = "checkbox"]');
}
function testCheckboxen() {
  getCheckboxen().forEach(({ id: testMode }, index) => {
    setTimeout(() => {
      test(`when checkbox ${testMode} is selected, only that scale type is suggested`, () => {
        getCheckboxen().forEach((checkbox) => {
          if (checkbox.id === testMode) {
            checkbox.checked = true;
          } else {
            checkbox.checked = false;
          }
        });
        clickGo();
        return new Promise(resolve => {
          setTimeout(() => {
            const shownMode = document.querySelector('#test-id-scale-mode').innerHTML;
            console.log(testMode, shownMode);
            // TODO: shownMode needs to be converted back to id form; maybe need to import enum from modules once its in module form
            // will need scaletype_subsets from scripts.ts and something else from types.ts
            resolve(testMode === shownMode.toLowerCase());
          }, 10); // wait until DOM is updated :)
        });
      });
    }, 20 * index); // so checkboxes aren't all overwriting each other
  });
}
testCheckboxen();

});
