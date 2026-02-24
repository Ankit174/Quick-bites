import { createContext, useContext, useState } from 'react';

const ChatbotContext = createContext();

export function ChatbotProvider({ children }) {
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const toggleChatbot = () => {
        setIsChatbotOpen(prev => !prev);
    };

    const openChatbot = () => {
        setIsChatbotOpen(true);
    };

    const closeChatbot = () => {
        setIsChatbotOpen(false);
    };

    return (
        <ChatbotContext.Provider value={{ isChatbotOpen, toggleChatbot, openChatbot, closeChatbot }}>
            {children}
        </ChatbotContext.Provider>
    );
}

export function useChatbot() {
    return useContext(ChatbotContext);
}
