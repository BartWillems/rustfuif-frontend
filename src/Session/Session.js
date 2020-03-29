function isLoggedIn() {
  return localStorage.getItem('user');
}

export default isLoggedIn;
