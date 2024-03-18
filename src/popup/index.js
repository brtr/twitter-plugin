import './index.css'

document.addEventListener('DOMContentLoaded', () => {
  // Get the API token from Chrome storage
  const tokenInput = document.getElementById('cmc-api-token')
  chrome.storage.sync.get(['CMC_API_TOKEN'], function(result) {
    if (result.CMC_API_TOKEN) {
      tokenInput.value = result.CMC_API_TOKEN
    }
  })

  // Save the API token to Chrome storage
  const saveButton = document.getElementById('save-cmc-api-token')
  saveButton.addEventListener('click', function() {
    const token = tokenInput.value
    chrome.storage.sync.set({ CMC_API_TOKEN: token }, function() {
      console.log('CoinMarketCap API Token is set')
    })
  })
})
