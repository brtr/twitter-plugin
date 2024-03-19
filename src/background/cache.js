const storage = chrome.storage.local

const CACHE_VERSION = 'v1'

function getCacheKey(key) {
  return `${CACHE_VERSION}_${key}`
}

export function setCache(key, value, durationInSeconds) {
  const cacheKey = getCacheKey(key)
  const expiration = new Date()
  const cache = {
    data: value,
    expiration: expiration.setSeconds(expiration.getSeconds() + durationInSeconds)
    ,
  }
  storage.set({ [cacheKey]: cache }, () => {
    console.log(`Data for ${cacheKey} is now cached with expiration.`);
  })
}

export function getCache(key, callback) {
  const cacheKey = getCacheKey(key)
  storage.get([cacheKey], (data) => {
    const cache = data[cacheKey]
    if (!cache) {
      callback(null)
      return
    }

    if (new Date(cache.expiration) < new Date()) {
      console.log(`Cache for ${cacheKey} has expired.`);
      storage.remove([cacheKey], () => {
        console.log(`Cache for ${cacheKey} has been removed.`);
      })
      callback(null)
      return
    }

    callback(cache.data)
  })
}
