import { createContext, useContext, useEffect, useState } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingBackdrop, setLoadingBackDrop] = useState(false);

  return (
    <LoadingContext.Provider value={{ loadingBackdrop, setLoadingBackDrop }}>
      {children}
    </LoadingContext.Provider>
  );
};

// export const useLoading = () => useContext(LoadingContext);
