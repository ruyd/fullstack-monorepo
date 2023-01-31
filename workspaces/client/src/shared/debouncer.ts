const cache: Record<string, number> = {}
export const debouncer = (key: string, callback: () => void, delay = 1000) => {
  if (cache[key]) {
    window.clearTimeout(cache[key])
  }
  const timer = window.setTimeout(() => callback(), delay)
  cache[key] = timer
}

export default debouncer
