console.info('contentScript is running')

// Regular expression to match $ followed by uppercase letters and numbers
const tickerPattern = /\$[A-Z0-9]+\b/;

document.addEventListener('mouseover', (event) => {
  const target = event.target

  if (target.tagName === 'A' && tickerPattern.test(target.textContent)) {
    const ticker = target.textContent.match(tickerPattern)[0]
    chrome.runtime.sendMessage({ type: 'TICKER_INFO', ticker }, (response) => {
      console.log('contentScript has received a message from background, and ticker info is ', response?.ticker, response?.price);
    })
  }
});

document.addEventListener('mouseout', (event) => {
  // const target = event.target;
  // console.log('mouseout:', target)
});
