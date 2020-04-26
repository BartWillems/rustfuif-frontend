export function isLoggedIn() {
  return !!localStorage.getItem('user');
}

export function getUser() {
  const userString = localStorage.getItem('user');
  try {
    return JSON.parse(userString);
  } catch (error) {
    return null;
  }
}

export function removeSession() {
  localStorage.removeItem('user');
}
