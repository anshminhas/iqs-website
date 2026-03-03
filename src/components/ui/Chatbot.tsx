import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Phone, Mail, ChevronDown, ArrowLeft } from 'lucide-react';

interface Message {
    id: number;
    from: 'bot' | 'user';
    text: string;
}

const FAQ = [
    { q: 'What services does IQS offer?', a: 'IQS provides HR Services, Recruitment & Manpower solutions, and Payroll Management services. We are a one-stop destination for all your HR needs.' },
    { q: 'How can I get a quote?', a: 'You can get a quote by visiting our Contact page or reaching out to us at info@iqsindia.in or calling +(91) 7042559158.' },
    { q: 'Hassle-Free Payroll Solutions', a: 'From attendance tracking to final salary disbursement, we manage everything — PF, ESI, TDS & compliance included. Accurate, timely, and legally compliant payroll processing. Reduce errors, save time, and stay stress-free with our expert support.' },
    { q: 'Tell me about Recruiting', a: 'We help you hire the right talent quickly and efficiently. From sourcing and screening to interview coordination and onboarding support — we manage the complete hiring process. Access qualified candidates across multiple roles and industries. Save time, reduce hiring costs, and build a strong team with us.' },
    { q: 'What industries do you serve?', a: 'We serve clients across IT, manufacturing, logistics, retail, healthcare, banking, and more across India.' },
    { q: 'Is payroll outsourcing secure?', a: 'Absolutely. We follow strict data security protocols, encrypted data storage, and role-based access controls to protect your employee data.' },
];

const WELCOME = "👋 Hi there! I'm the IQS Assistant. How can I help you today? Feel free to ask about our services, pricing, or anything else!";

let msgId = 0;
const newMsg = (from: 'bot' | 'user', text: string): Message => ({ id: ++msgId, from, text });

const getBotReply = (input: string): string => {
    const lc = input.toLowerCase();
    if (lc.includes('service') || lc.includes('offer') || lc.includes('what do')) return FAQ[0].a;
    if (lc.includes('quote') || lc.includes('price') || lc.includes('cost') || lc.includes('pricing')) return FAQ[1].a;
    if (lc.includes('payroll') || lc.includes('salary') || lc.includes('pay')) return FAQ[2].a;
    if (lc.includes('recruit') || lc.includes('hire') || lc.includes('manpower') || lc.includes('talent')) return FAQ[3].a;
    if (lc.includes('industry') || lc.includes('sector') || lc.includes('who')) return FAQ[4].a;
    if (lc.includes('secure') || lc.includes('safe') || lc.includes('data') || lc.includes('privacy')) return FAQ[5].a;
    if (lc.includes('contact') || lc.includes('reach') || lc.includes('call') || lc.includes('email')) {
        return "You can reach us at info@iqsindia.in or call +(91) 7042559158. Our office is at R-307, Dua Complex, Vikas Marg, New Delhi — 110092.";
    }
    if (lc.includes('hello') || lc.includes('hi') || lc.includes('hey')) return "Hello! Great to hear from you. How can IQS assist you today?";
    if (lc.includes('thank')) return "You're welcome! Is there anything else I can help you with? 😊";
    return "That's a great question! For detailed information, please contact our team at info@iqsindia.in or call +(91) 7042559158 and we'll be happy to assist.";
};

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([newMsg('bot', WELCOME)]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showFAQ, setShowFAQ] = useState(true);
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        setShowFAQ(false);
        const userMsg = newMsg('user', text);
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
            const reply = getBotReply(text);
            setIsTyping(false);
            setMessages(prev => [...prev, newMsg('bot', reply)]);
        }, 1200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    // Back to initial: reset messages and show FAQ chips again
    const handleBack = () => {
        msgId = 0;
        setMessages([newMsg('bot', WELCOME)]);
        setInput('');
        setIsTyping(false);
        setShowFAQ(true);
    };

    return (
        <>
            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-5 z-50 w-[350px] max-w-[calc(100vw-2.5rem)] transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
                    }`}
            >
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-elevation-5 overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700" style={{ maxHeight: '520px' }}>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* Back button — only visible when FAQ chips are hidden (conversation started) */}
                            {!showFAQ && (
                                <button
                                    onClick={handleBack}
                                    title="Back to main menu"
                                    className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors mr-1"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            )}
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-white font-semibold text-sm">IQS Assistant</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-white/80 text-xs">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                        >
                            <ChevronDown className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '280px' }}>
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.from === 'bot'
                                    ? 'bg-primary-100 dark:bg-primary-900/40'
                                    : 'bg-primary-600'
                                    }`}>
                                    {msg.from === 'bot'
                                        ? <Bot className="w-4 h-4 text-primary-600 dark:text-blue-400" />
                                        : <User className="w-4 h-4 text-white" />
                                    }
                                </div>
                                <div
                                    className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.from === 'bot'
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                                        : 'bg-primary-600 text-white rounded-tr-sm'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-end gap-2">
                                <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-primary-600 dark:text-blue-400" />
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>

                    {/* FAQ Quick Replies */}
                    {showFAQ && (
                        <div className="px-4 pb-3">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Frequently asked:</p>
                            <div className="flex flex-wrap gap-2">
                                {FAQ.slice(0, 4).map((f, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(f.q)}
                                        className="text-xs px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-blue-300 rounded-full border border-primary-200 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-800/40 transition-colors text-left"
                                    >
                                        {f.q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back to menu link — shown inside conversation when FAQ chips are hidden */}
                    {!showFAQ && (
                        <div className="px-4 pb-1">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-1.5 text-xs text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300 transition-colors font-medium"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to main menu
                            </button>
                        </div>
                    )}

                    {/* Contact Quick Links */}
                    <div className="px-4 pb-2 flex gap-4">
                        <a href="tel:+917042559158" className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-blue-400 transition-colors">
                            <Phone className="w-3.5 h-3.5" /> Call Us
                        </a>
                        <a href="mailto:info@iqsindia.in" className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-blue-400 transition-colors">
                            <Mail className="w-3.5 h-3.5" /> Email Us
                        </a>
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="px-4 pb-4">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 focus-within:border-primary-400 transition-colors">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-200 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="w-8 h-8 rounded-lg bg-primary-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 flex items-center justify-center transition-colors hover:bg-primary-700"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* FAB Button */}
            <button
                onClick={() => setIsOpen(p => !p)}
                className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white shadow-elevation-4 hover:shadow-elevation-5 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
                aria-label="Open chat"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                        1
                    </span>
                )}
            </button>
        </>
    );
};

export default Chatbot;
