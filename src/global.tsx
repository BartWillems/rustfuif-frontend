import React from "react";
import PropTypes from "prop-types";

const AuthenticationContext = React.createContext<User | undefined>(undefined);

export class User {
  id: Number;
  username: string;
  isAdmin: Boolean;

  constructor(user: any) {
    this.id = user.id;
    this.username = user.username;
    this.isAdmin = user.is_admin;
  }
}

type Props = {
  initialLoggedInState?: User,
  children: React.ReactNode,
}

export const AuthenticationProvider = ({ initialLoggedInState, children }: Props) => {
  const [user, setUser] = React.useState<User | undefined>(initialLoggedInState);

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
