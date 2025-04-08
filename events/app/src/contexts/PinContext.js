import { createContext, useContext, useState } from 'react';

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pin, setPin] = useState('');

  return (
    <PinContext.Provider value={{ pin, setPin }}>
      {children}
    </PinContext.Provider>
  );
};

export const usePin = () => useContext(PinContext);