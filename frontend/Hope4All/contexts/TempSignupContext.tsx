import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TempSignupData {
  username: string;
  email: string;
  password: string;
}

interface TempSignupContextType {
  tempData: TempSignupData | null;
  setTempData: (data: TempSignupData | null) => void;
}

const TempSignupContext = createContext<TempSignupContextType | undefined>(undefined);

export const useTempSignup = () => {
  const context = useContext(TempSignupContext);
  if (!context) {
    throw new Error('useTempSignup must be used within TempSignupProvider');
  }
  return context;
};

interface Props {
  children: ReactNode;
}

export const TempSignupProvider: React.FC<Props> = ({ children }) => {
  const [tempData, setTempData] = useState<TempSignupData | null>(null);

  return (
    <TempSignupContext.Provider value={{ tempData, setTempData }}>
      {children}
    </TempSignupContext.Provider>
  );
};

