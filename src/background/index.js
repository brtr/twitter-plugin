import { getCache, setCache } from './cache'
import { fetchRealtimePrice, fetchSpotAggregateTransactions } from './fetch'

const CACHE_EXPIRATION_IN_SECONDS = 3600 // 1 hour

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log('background has received a message from popup, and count is ', request?.count)
    return
  }

  if (request.type === 'TICKER_INFO') {
    console.log('TICKER_INFO: background has received a message from contentScript, and ticker info is ', request?.ticker)
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

  if (request.type === 'SPOT_AGGREGATE_TXNS') {
    console.log('SPOT_AGGREGATE_TXNS: background has received a message from contentScript, and ticker info is ', request?.ticker)
    const cacheKey = `SPOT_AGGREGATE_TXNS_${request?.ticker}`
    getCache(cacheKey, (data) => {
      if (data) {
        sendResponse({ type: 'SPOT_AGGREGATE_TXNS', ticker: request?.ticker, data: data })
      } else {
        fetchSpotAggregateTransactions(request?.ticker).then(data => {
          console.log('SPOT_AGGREGATE_TXNS', data)
          setCache(cacheKey, data, CACHE_EXPIRATION_IN_SECONDS)
          sendResponse({ type: 'SPOT_AGGREGATE_TXNS', ticker: request?.ticker, data: data })
        })
      }
    })

    return true
  }
})
