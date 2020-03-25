import Cookies from 'js-cookie';

function isLoggedIn() {
  return !!Cookies.get('actix-session');
}

export default isLoggedIn;
