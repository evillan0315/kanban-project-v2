
import { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  loading: boolean;
  messages: string[];
  setLoading: (state: boolean) => void;
  addMessage: (msg: string) => void;
  clearMessages: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({
  children,
}: {

  children: ReactNode;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = (msg: string) => {
    setMessages((prev) => [...prev, msg]);
  };
  
  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <LoadingContext.Provider
      value={{
        loading,
        messages,
        setLoading,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
