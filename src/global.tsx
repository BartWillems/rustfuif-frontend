import React from "react";

type User = {
  id: Number;
  username: string;
  isAdmin: Boolean;
};

type CtxUser = User | null;

export type ContextUser = {
  user: CtxUser;
  setUser: React.Dispatch<React.SetStateAction<CtxUser>> | null;
} | null;

const AuthenticationContext = React.createContext<ContextUser>({
  user: null,
  setUser: null,
});

type Props = {
  children: React.ReactNode;
};

export const AuthenticationProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<CtxUser>(null);
  return (
    <AuthenticationContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
export default AuthenticationContext;
