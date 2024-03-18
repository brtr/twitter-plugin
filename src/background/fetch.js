async function getApiToken() {
  const apiTokenResult = await chrome.storage.sync.get(['CMC_API_TOKEN'])
  return apiTokenResult?.CMC_API_TOKEN
}

export async function fetchRealtimePrice(ticker) {
  const symbol = ticker.replace('$', '').toUpperCase()
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
