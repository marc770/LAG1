export function setupCounter(element) {
  let counter = 0

  const setCount = (count) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }

  element.addEventListener('click', () => setCount(counter + 1))
  setCount(0)

  return {
    getCount: () => counter,
    setCount,
  }
}
