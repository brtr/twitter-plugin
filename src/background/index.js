console.log('background is running')

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
    return
  }

  if (request.type === 'TICKER_INFO') {
    console.log('background has received a message from contentScript, and ticker info is ', request?.ticker)
    sendResponse({ type: 'TICKER_INFO', ticker: request?.ticker, price: 100 })

    return
  }
})
