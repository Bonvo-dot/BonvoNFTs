import React, { useReducer } from "react";
import useGeoLocation from "../components/helpers/useGeoLocation";
import ContextWeb3 from "./ContextWeb3";

const initialState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_WEB3_PROVIDER":
      localStorage.setItem("address", action.address);
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      };
    case "SET_CHAIN_ID":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.address,
      };
    case "RESET_WEB3_PROVIDER":
      localStorage.removeItem("address");
      return initialState;
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    default:
      throw new Error();
  }
};
export const ContextProviderWeb3 = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useGeoLocation();
  return (
    <ContextWeb3.Provider value={{ state, dispatch }}>
      {children}
    </ContextWeb3.Provider>
  );
};

export default ContextProviderWeb3;
