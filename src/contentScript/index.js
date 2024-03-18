import { computePosition, offset, arrow } from "@floating-ui/dom";
import "./index.css"

// Regular expression to match $ followed by uppercase letters and numbers
const tickerPattern = /\$[A-Za-z0-9]+\b/g;

async function fetchPriceForTicker(ticker, callback) {
  chrome.runtime.sendMessage({ type: 'TICKER_INFO', ticker }, (response) => {
    callback(response)
  })
}

function createFloatingUI() {
  // Create the floating UI
  const floating = document.createElement('div')
  floating.id = 'x-chrome-ext-floating'
  floating.style.display = 'none'

  const content = document.createElement('div')
  content.id = 'x-chrome-ext-floating-content'
  content.textContent = 'Fetching ...'

  const arrowEl = document.createElement('div')
  arrowEl.id = 'x-chrome-ext-floating-arrow'

  floating.appendChild(arrowEl)
  floating.appendChild(content)
  document.body.appendChild(floating)
}

function updateUI(reference, htmlContent) {
  const floating = document.getElementById('x-chrome-ext-floating')
  const arrowEl = document.getElementById('x-chrome-ext-floating-arrow')
  const floatingContent = document.getElementById('x-chrome-ext-floating-content')
  floatingContent.innerHTML = htmlContent
  floating.style.display = 'block'

  computePosition(reference, floating, {
    placement: 'bottom', // 'top', 'right', 'bottom', 'left'
    middleware: [offset(10), arrow({ element: arrowEl })]
  }).then(({ x, y, middlewareData }) => {
    Object.assign(floating.style, {
      top: `${y}px`,
      left: `${x}px`
    })

    if (middlewareData.arrow) {
      const { x } = middlewareData.arrow;

      Object.assign(arrowEl.style, {
        left: `${x}px`,
        top: `${-arrowEl.offsetHeight / 2}px`
      })
    }
  })
}

createFloatingUI()

document.addEventListener('mouseover', (event) => {
  const target = event.target

  if (target.tagName === 'A' && tickerPattern.test(target.textContent)) {
    target.classList.add('x-chrome-ext-ticker-popup-instance')
    const ticker = target.textContent.match(tickerPattern)[0]

    fetchPriceForTicker(ticker, (response) => {
      console.log('contentScript has received a message from background, and ticker info is ', response);
      const info = response?.data[0];
      const floatingContent =
        `
        <div>
          <h3>${info?.name} (${info?.symbol})</h3>
          <p>Price for ${ticker}: $${info?.quote?.USD?.price}</p>
          <p> Percent change in 1h: ${info?.quote?.USD?.percent_change_1h?.toFixed(4)}%</p>
          <p> Percent change in 24h: ${info?.quote?.USD?.percent_change_24h?.toFixed(4)}%</p>
          <p> Percent change in 7d: ${info?.quote?.USD?.percent_change_7d?.toFixed(4)}%</p>
        </div>
      `
      updateUI(target, floatingContent)
    })
  }
})

document.addEventListener('mouseout', () => {
  document.getElementById('x-chrome-ext-floating').style.display = 'none'
  document.getElementById('x-chrome-ext-floating-content').textContent = 'Fetching ...'
})
