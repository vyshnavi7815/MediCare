import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Minimize2,
  Maximize2,
  RotateCcw,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage, getN8nSessionId, N8N_CHAT_WEBHOOK_URL } from '../services/api';

interface N8nChatbotWidgetProps {
  onOpenFullAssistant?: () => void;
  onNavigateAppointments?: () => void;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'n8n-welcome-msg',
  sender: 'assistant',
  text: `Hello! I am your **MediCare AI Assistant** connected to your n8n workflow.

I can assist you with:
- Explaining health symptoms and general wellness concepts
- Matching you with certified medical specialists
- Guiding you through appointment scheduling
- Answering questions about clinic locations and fees

How can I help you today?`,
  timestamp: 'Just now',
};

const SUGGESTED_QUERIES = [
  'Help me book an appointment',
  'What are normal blood pressure ranges?',
  'Which doctor treats skin rashes?',
  'When should I see a cardiologist?',
];

export const N8nChatbotWidget: React.FC<N8nChatbotWidgetProps> = ({
  onOpenFullAssistant,
  onNavigateAppointments,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = sessionStorage.getItem('medicare_n8n_widget_chat');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Ignore
    }
    return [INITIAL_GREETING];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    try {
      sessionStorage.setItem('medicare_n8n_widget_chat', JSON.stringify(messages));
    } catch (e) {
      // Ignore
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const res = await sendChatMessage(text, updatedMessages);
      const asstMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: res.isEmergency,
      };

      setMessages((prev) => [...prev, asstMsg]);
      if (!isOpen) setHasUnread(true);
    } catch (err) {
      console.error('Error querying n8n chat widget', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_GREETING]);
    sessionStorage.removeItem('medicare_n8n_widget_chat');
  };

  // Render formatted markdown lines
  const renderFormattedText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-slate-900 mt-2 mb-1 text-xs sm:text-sm">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-bold text-slate-900 mt-2 mb-1 text-sm">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-3 list-disc text-slate-700 text-xs my-0.5">
            {line.substring(2)}
          </li>
        );
      }
      if (line.trim().startsWith('*') && line.trim().endsWith('*') && !line.includes('**')) {
        return (
          <p key={idx} className="text-[11px] italic text-slate-500 my-1 bg-slate-50 p-1.5 rounded border border-slate-100">
            {line.replace(/\*/g, '')}
          </p>
        );
      }
      if (line.trim() === '---') {
        return <hr key={idx} className="my-2 border-slate-200" />;
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-700 leading-relaxed my-0.5">
          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded/Standard Chat Modal Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden mb-3 transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${
            isExpanded
              ? 'w-[94vw] sm:w-[680px] h-[85vh] max-h-[800px]'
              : 'w-[92vw] sm:w-[410px] h-[550px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-teal-200 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white truncate">MediCare AI</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    n8n Live
                  </span>
                </div>
                <p className="text-[11px] text-teal-100 truncate">
                  Clinical assistant & scheduling guide
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-teal-100">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore window size' : 'Expand window'}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:inline-flex"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {onOpenFullAssistant && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenFullAssistant();
                  }}
                  title="Open full page assistant"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chatbot"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Webhook Connection Pill Banner */}
          <div className="px-4 py-1.5 bg-teal-50 border-b border-teal-100 text-[10px] text-teal-800 flex items-center justify-between">
            <span className="flex items-center gap-1 truncate font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
              Webhook: vyla30.app.n8n.cloud
            </span>
            <span className="font-semibold text-teal-700">Encrypted</span>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => {
              const isAsst = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[90%] ${isAsst ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isAsst
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {isAsst ? <Bot className="w-4 h-4" /> : 'YOU'}
                  </div>

                  <div
                    className={`rounded-2xl p-3 text-xs leading-relaxed ${
                      isAsst
                        ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs'
                        : 'bg-teal-700 text-white shadow-xs'
                    }`}
                  >
                    {isAsst ? renderFormattedText(msg.text) : <p>{msg.text}</p>}
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isAsst ? 'text-slate-400' : 'text-teal-200'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2 mr-auto max-w-[85%]">
                <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                  <span className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" />
                  </span>
                  <span>MediCare AI is responding...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 pt-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-[11px] text-slate-600 font-medium transition-colors border border-slate-200 shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Dock */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask MediCare AI anything..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white rounded-xl transition-colors shadow-xs shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Disclaimer */}
          <div className="px-3 py-1.5 bg-slate-100/70 border-t border-slate-200 text-[10px] text-slate-500 text-center">
            Educational assistant only · In an emergency, dial <strong>911</strong>
          </div>
        </div>
      )}

      {/* Floating Launcher Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-full shadow-lg shadow-teal-900/30 hover:shadow-xl hover:scale-105 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-300"
        aria-label="Open MediCare AI Chatbot"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-teal-700 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-teal-700 rounded-full" />
        </div>

        <div className="text-left hidden sm:block">
          <span className="block text-xs font-bold leading-tight">Chat with MediCare AI</span>
          <span className="block text-[10px] text-teal-200 leading-tight">n8n Cloud Assistant</span>
        </div>

        {hasUnread && !isOpen && (
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
        )}
      </button>
    </div>
  );
};
