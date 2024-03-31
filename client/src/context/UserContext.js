import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userFeedback, setUserFeedback] = useState({
    message: "",
    type: "", // 'success' or 'error'
  });

  return (
    <UserContext.Provider value={{ userFeedback, setUserFeedback }}>
      {children}
    </UserContext.Provider>
  );
};
