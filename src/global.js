import React from "react";
import PropTypes from "prop-types";

const AuthenticationContext = React.createContext();

export const AuthenticationProvider = ({ initialLoggedInState, children }) => {
  const [user, setUser] = React.useState(initialLoggedInState);

  return (
    <AuthenticationContext.Provider value={[user, setUser]}>
      {children}
    </AuthenticationContext.Provider>
  );
};

AuthenticationProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  initialLoggedInState: PropTypes.object,
};

AuthenticationProvider.defaultProps = {
  initialLoggedInState: null,
};

export default AuthenticationContext;
