//pageを超えてデータを共有するためのコンテキストを作成する
import { NON_SESSION_MSG } from '@/basic_info';
import React, { createContext, useState, useContext, ReactNode } from 'react';

const MyContext = createContext<{ sessionId: string, setSessionId: React.Dispatch<React.SetStateAction<string>> } | undefined>(undefined);

export const MyProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string>(NON_SESSION_MSG);

  return (
    <MyContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
