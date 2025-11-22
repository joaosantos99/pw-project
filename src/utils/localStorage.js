const getLocalStorage = (key) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null
}

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}

export { getLocalStorage, setLocalStorage, removeLocalStorage }
