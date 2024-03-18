const storage = chrome.storage.local

export function setCache(key, value, durationInSeconds) {
  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + durationInSeconds)
  const cache = {
    data: value,
    expiration: expiration,
  }
  storage.set({ [key]: cache }, () => {
    console.log(`Data for ${key} is now cached with expiration.`);
  })
}

export function getCache(key, callback) {
  storage.get([key], (data) => {
    const cache = data[key]
    if (!cache) {
      callback(null)
      return
    }

    if (new Date(cache.expiration) < new Date()) {
      console.log(`Cache for ${key} has expired.`);
      storage.remove([key], () => {
        console.log(`Cache for ${key} has been removed.`);
      })
      callback(null)
      return
    }

    callback(cache.data)
  })
}
