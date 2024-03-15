import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/themes/material.css'

console.info('contentScript is running')

// Regular expression to match $ followed by uppercase letters and numbers
const tickerPattern = /\$[A-Z0-9]+\b/;

function fetchPriceForTicker(ticker, callback) {
  chrome.runtime.sendMessage({ type: 'TICKER_INFO', ticker }, (response) => {
    callback(response)
  })
}

const tippyInstances = [];

document.addEventListener('mouseover', (event) => {
  const target = event.target

  if (target.tagName === 'A' && tickerPattern.test(target.textContent)) {
    target.classList.add('x-chrome-ext-ticker-popup-instance')
    const ticker = target.textContent.match(tickerPattern)[0]
    tippy(target, {
      content: `Fetching price for ${ticker}...`,
      allowHTML: true,
      animation: 'scale',
      arrow: true,
      delay: 500, // ms
      theme: 'material',
      hideOnClick: false,
      interactive: true,
      followCursor: true,
      onShow(instance) {
        fetchPriceForTicker(ticker, (response) => {
          console.log('contentScript has received a message from background, and ticker info is ', response?.ticker, response?.price);
          instance.setContent(`Price for ${ticker}: $${response?.price}`);
        });
        tippyInstances.push(instance);
      }
    })
  }
});

document.addEventListener('mouseout', (event) => {
  tippyInstances.forEach(instance => instance.destroy());
});
