async function getApiToken() {
  const apiTokenResult = await chrome.storage.sync.get(['CMC_API_TOKEN'])
  return apiTokenResult?.CMC_API_TOKEN
}

function getSymbolFromTicker(ticker) {
  return ticker.replace('$', '').toUpperCase()
}

export async function fetchRealtimePrice(ticker) {
  const symbol = getSymbolFromTicker(ticker)
  const apiToken = await getApiToken()

  return fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}`, {
    method: 'GET',
    headers: {
      'X-CMC_PRO_API_KEY': apiToken,
      'Accept': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('fetchRealtimePrice', data?.data)
      return data?.data?.[symbol]
    })
}

export async function fetchSpotAggregateTransactions(ticker) {
  const symbol = getSymbolFromTicker(ticker)

  return fetch(`https://spot.techbay.club/aggregate_transactions?search=${symbol}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('fetchSpotTransactions', data)
      return data?.[0]
    })
}
