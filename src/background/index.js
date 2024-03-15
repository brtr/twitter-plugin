console.log('background is running')

async function fetchRealtimePrice(ticker) {
  const symbol = ticker.replace('$', '').toUpperCase()
  return fetch(`https://sandbox-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}`, {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
      'Accept': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('fetchRealtimePrice', data?.data)
      return data?.data?.[symbol]
    })
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
    return
  }

  if (request.type === 'TICKER_INFO') {
    console.log('background has received a message from contentScript, and ticker info is ', request?.ticker)
    fetchRealtimePrice(request?.ticker).then(data => {
      console.log('TICKER_INFO', data)
      sendResponse({ type: 'TICKER_INFO', ticker: request?.ticker, data: data })
    }).catch(err => console.error(err))

    return true
  }
})
