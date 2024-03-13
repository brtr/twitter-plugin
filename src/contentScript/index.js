console.info('contentScript is running')

// Regular expression to match $ followed by uppercase letters and numbers
const tickerPattern = /\$[A-Z0-9]+\b/;

document.addEventListener('mouseover', (event) => {
  const target = event.target;

  if (target.tagName === 'A' && tickerPattern.test(target.textContent)) {
    console.log('mouseover:', target.textContent);
    const match = target.textContent.match(tickerPattern)[0];
    console.log('match:', match);
  }
});

document.addEventListener('mouseout', (event) => {
  // const target = event.target;
  // console.log('mouseout:', target)
});
