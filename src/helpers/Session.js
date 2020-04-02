export function isLoggedIn() {
  return !!localStorage.getItem('user');
}

export function removeSession() {
  localStorage.removeItem('user');
}
