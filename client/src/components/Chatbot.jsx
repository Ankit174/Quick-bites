import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useChatbot } from '../context/ChatbotContext';

const DEFAULT_TRENDS = [
    'Currently trending: Spicy Korean Corn Dogs! Perfect for a crispy cheese pull.',
    'Viral on social media: The Dubai Chocolate Bar! A rich mix of pistachio and kunafa.',
    'Everyone is loving: Smash Burgers right now. Simple, crispy, and delicious!',
    'Boba Tea with Brown Sugar Glaze is the absolute trendsetter today.',
    'Birria Tacos are extremely popular. The slow-cooked beef is a must-try.'
];

export default function Chatbot() {
    const { isChatbotOpen, toggleChatbot, closeChatbot } = useChatbot();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your AI Food Guru 🍔. Tell me how you're feeling today, or ask me what's trending, and I'll find the perfect food for you!", sender: "bot" }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await api.get('/menu');
                setMenuItems(response.data);
            } catch (error) {
                console.error("Failed to fetch menu items for chatbot", error);
            }
        };
        fetchMenu();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const getRealMenuSuggestions = (mood) => {
        if (!menuItems || menuItems.length === 0) return null;

        // Simple heuristic rules to map real items to moods by keyword
        const rules = {
            happy: ['sweet', 'cake', 'dessert', 'mango', 'ice', 'milkshake', 'fruity', 'fun'],
            sad: ['warm', 'cheese', 'soup', 'comfort', 'melt', 'hot', 'chocolate', 'pasta', 'mac'],
            tired: ['coffee', 'tea', 'latte', 'espresso', 'energy', 'fresh', 'green', 'salad'],
            stressed: ['tea', 'chamomile', 'sushi', 'roll', 'relax', 'light', 'calm', 'brownie'],
            energetic: ['protein', 'grilled', 'spicy', 'bowl', 'chicken', 'tuna', 'smoothie'],
            romantic: ['pasta', 'wine', 'carbonara', 'strawberry', 'chocolate', 'special', 'fine'],
            angry: ['fried', 'crunchy', 'spicy', 'buffalo', 'jalapeno', 'wings', 'burger', 'hot'],
            chill: ['pizza', 'sandwich', 'club', 'cold', 'margarita', 'iced', 'simple', 'wrap'],
        };

        const keywords = rules[mood] || [];
        const matches = menuItems.filter(item => {
            const description = (item.description || '').toLowerCase();
            const name = (item.name || '').toLowerCase();
            const category = (item.category || '').toLowerCase();
            const combined = `${name} ${description} ${category}`;
            return keywords.some(kw => combined.includes(kw));
        });

        // If specific matches found, pick a random one, otherwise pick completely random
        if (matches.length > 0) {
            return matches[Math.floor(Math.random() * matches.length)];
        }
        return menuItems[Math.floor(Math.random() * menuItems.length)];
    };

    const getRealTrend = () => {
        if (!menuItems || menuItems.length === 0) {
            return DEFAULT_TRENDS[Math.floor(Math.random() * DEFAULT_TRENDS.length)];
        }
        // Let's pretend some premium random items are "trending" recently
        const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        return `Our ${randomItem.name} is absolutely trending right now. Lots of people are ordering it!`;
    };

    const generateResponse = (text) => {
        const lowerText = text.toLowerCase();
        let response = "I couldn't catch a specific mood. Are you feeling happy, stressed, tired, or maybe you want to know what's trending?";

        const moods = ['happy', 'sad', 'tired', 'stressed', 'energetic', 'romantic', 'angry', 'chill'];
        let foundMood = null;
        for (const mood of moods) {
            if (lowerText.includes(mood)) {
                foundMood = mood;
                break;
            }
        }

        const isAskingTrend = lowerText.includes('trend') || lowerText.includes('popular') || lowerText.includes('viral') || lowerText.includes('new');

        if (foundMood && isAskingTrend) {
            const itemMatch = getRealMenuSuggestions(foundMood);
            const foodName = itemMatch ? itemMatch.name : "something delicious from our menu";
            const trend = getRealTrend();
            response = `Oh, feeling ${foundMood}? I highly recommend our ${foodName}! Also, by the way, ${trend}`;
        } else if (foundMood) {
            const itemMatch = getRealMenuSuggestions(foundMood);
            const foodName = itemMatch ? itemMatch.name : "a special treat";
            const description = itemMatch && itemMatch.description ? ` It's exactly that: ${itemMatch.description.substring(0, 50)}...` : '';
            response = `Since you're feeling ${foundMood}, I think you'd absolutely love our ${foodName}!${description}`;
        } else if (isAskingTrend) {
            const trend = getRealTrend();
            response = `${trend} Want me to recommend something for your mood too?`;
        } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
            response = "Hello there! Food is my passion. Tell me your mood (e.g., happy, sad, chill) or ask what's trending right now!";
        } else {
            // Fallback logic for just food mentions or anything else
            const randomItem = menuItems.length > 0 ? menuItems[Math.floor(Math.random() * menuItems.length)] : null;
            if (randomItem) {
                response = `Hmm, I'm just a simple AI, but how about taking a look at our ${randomItem.name}? It might be exactly what you need.`;
            }
        }

        return response;
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const newMsg = { id: Date.now(), text: inputMessage, sender: "user" };
        setMessages((prev) => [...prev, newMsg]);
        setInputMessage('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponse = generateResponse(newMsg.text);
            setMessages((prev) => [...prev, { id: Date.now() + 1, text: botResponse, sender: "bot" }]);
            setIsTyping(false);
        }, 1200); // simulate delay
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl hover:shadow-2xl focus:outline-none z-50 flex items-center justify-center group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleChatbot}
            >
                <MessageCircle size={28} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isChatbotOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }}
                        className="fixed bottom-24 right-6 w-[90vw] max-w-sm h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white flex justify-between items-center shadow-md">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">Food Guru AI</h3>
                                    <p className="text-xs text-orange-100 flex items-center">
                                        <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeChatbot}
                                className="text-white/80 hover:text-white p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm break-words ${msg.sender === 'user'
                                            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-tr-sm'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.sender === 'bot' && (
                                            <Sparkles size={14} className="inline-block mr-1 text-orange-400 mb-1" />
                                        )}
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex space-x-2">
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Tell me your mood or a trend..."
                                    className="flex-1 bg-gray-100 text-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-shadow text-sm border border-transparent focus:border-orange-200"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim() || isTyping}
                                    className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
