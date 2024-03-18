function getApiToken() {
  let apiToken = null
  chrome.storage.sync.get(['CMC_API_TOKEN'], function(result) {
    if (result.CMC_API_TOKEN) {
      apiToken = result.CMC_API_TOKEN
    } else {
      console.log('No CMC_API_TOKEN found')
    }
  })
  return apiToken
}

export async function fetchRealtimePrice(ticker) {
  const symbol = ticker.replace('$', '').toUpperCase()
  const apiToken = getApiToken()

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
