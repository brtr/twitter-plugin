import { getCache, setCache } from './cache'
import { fetchRealtimePrice } from './fetch'

const CACHE_EXPIRATION_IN_SECONDS = 3600 // 1 hour

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
    return
  }

  if (request.type === 'TICKER_INFO') {
    console.log('background has received a message from contentScript, and ticker info is ', request?.ticker)
    const cacheKey = `TICKER_INFO_${request?.ticker}`
    getCache(cacheKey, (data) => {
      if (data) {
        sendResponse({ type: 'TICKER_INFO', ticker: request?.ticker, data: data })
      } else {
        fetchRealtimePrice(request?.ticker).then(data => {
          console.log('TICKER_INFO', data)
          setCache(cacheKey, data, CACHE_EXPIRATION_IN_SECONDS)
          sendResponse({ type: 'TICKER_INFO', ticker: request?.ticker, data: data })
        }).catch(err => console.error(err))
      }
    })

    return true
  }
})
