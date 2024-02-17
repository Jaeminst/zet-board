'use client';
import { useState, createContext, Dispatch, SetStateAction, ReactNode, useContext, useEffect } from 'react';

const EnvironmentContext = createContext<[string, Dispatch<SetStateAction<string>>] | undefined>(undefined);

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');

  useEffect(() => {
    const localStorageSelectedEnvironment = localStorage.getItem('selectedEnvironment')
    setSelectedEnvironment(localStorageSelectedEnvironment || 'Select Profile')
  }, []);

  return (
    <EnvironmentContext.Provider value={[selectedEnvironment, setSelectedEnvironment]}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within a EnvironmentProvider');
  }
  return context;
}