import React from "react";
import PropTypes from "prop-types";

const AuthenticationContext = React.createContext();

export const AuthenticationProvider = ({ initialLoggedInState, children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(initialLoggedInState);

  return (
    <AuthenticationContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
      {children}
    </AuthenticationContext.Provider>
  );
};

AuthenticationProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  initialLoggedInState: PropTypes.bool,
};

AuthenticationProvider.defaultProps = {
  initialLoggedInState: false,
};

export default AuthenticationContext;
