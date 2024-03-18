import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/themes/material.css'

console.info('contentScript is running')

// Regular expression to match $ followed by uppercase letters and numbers
const tickerPattern = /\$[A-Za-z0-9]+\b/g;

async function fetchPriceForTicker(ticker, callback) {
  chrome.runtime.sendMessage({ type: 'TICKER_INFO', ticker }, (response) => {
    callback(response)
  })
}

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
          console.log('contentScript has received a message from background, and ticker info is ', response);
          const info = response?.data[0];
          instance.setContent(`Price for ${ticker}: $${info?.quote?.USD?.price}`);
          // instance.setContent(`
          //   <div>
          //     <h3>${info?.name} (${info?.symbol})</h3>
          //     <p>Price for ${ticker}: $${info?.quote?.USD?.price}</p>
          //     <p>Platform: ${info?.platform?.name} (${info?.platform?.symbol})</p>
          //     <p> Is active: ${info?.is_active}</p>
          //     <p> Date added: ${info?.date_added}</p>
          //     <p> Last updated: ${info?.last_updated}</p>
          //   </div>
          // `)
        });
      }
    })
  }
})

