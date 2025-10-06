import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
