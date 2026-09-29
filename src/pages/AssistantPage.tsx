import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  AlertTriangle,
  HelpCircle,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Download,
  Calendar,
  Sparkles,
  PhoneCall,
  RotateCcw,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';

interface AssistantPageProps {
  setActiveTab: (tab: string) => void;
  onOpenEmergency: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: `### Hello, I am your MediCare AI Health Assistant 🩺
*Powered by n8n Cloud Workflow Integration*

I can help explain common health symptoms, clarify medical terminology, outline lifestyle & preventive strategies, recommend board-certified specialists, and assist your appointment scheduling.

**Clear Safety Disclaimer:**
*I provide general health education only. I do not provide clinical diagnoses, prescribe medications, or replace the care of a licensed physician.*

How can I assist your health journey today? Feel free to ask a question below or select one of the suggested topics.`,
    timestamp: 'Just now',
    followUpQuestions: [
      'What are normal adult blood pressure ranges?',
      'When should a persistent cough be evaluated by a doctor?',
      'What are effective, non-drowsy remedies for seasonal allergies?',
      'How to recognize the difference between tension headaches and migraines?',
    ],
  },
];

const SUGGESTED_PROMPTS = [
  'What are normal resting blood pressure ranges?',
  'When should I see a doctor for a persistent cough?',
  'How to distinguish tension headaches from migraines?',
  'Safe hydration and electrolytes for adult dehydration',
  'What questions should I ask my doctor about cholesterol?',
];

export const AssistantPage: React.FC<AssistantPageProps> = ({ setActiveTab, onOpenEmergency }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = sessionStorage.getItem('medicare_chat_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // Ignore
    }
    return INITIAL_MESSAGES;
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    try {
      sessionStorage.setItem('medicare_chat_history', JSON.stringify(messages));
    } catch (e) {
      // Ignore
    }
  }, [messages]);

  // Handle Speech Synthesis
  const handleReadAloud = (text: string) => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown characters for pleasant speech
    const cleanText = text
      .replace(/[#*`_]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/🩺|💡|❓|👨‍⚕️|⚠️/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setMessages(INITIAL_MESSAGES);
    setEmergencyAlertActive(false);
    sessionStorage.removeItem('medicare_chat_history');
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    setInputPrompt('');

    // Check emergency triggers locally as well
    const emergencyRegex = /chest pain|heart attack|stroke|cant breathe|cannot breathe|severe bleeding|unconscious|suicid/i;
    const isEmerg = emergencyRegex.test(query);
    if (isEmerg) {
      setEmergencyAlertActive(true);
    }

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(query, newMessages);

      if (response.isEmergency) {
        setEmergencyAlertActive(true);
      }

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: response.isEmergency,
        followUpQuestions: response.followUpQuestions,
        suggestedAction: response.suggestedAction,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Failed to get AI response', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSummary = () => {
    const textContent = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.sender === 'user' ? 'Patient' : 'MediCare AI Assistant'}:\n${m.text}\n`
      )
      .join('\n---\n\n');

    const header = `MEDICARE AI - PATIENT HEALTH EDUCATIONAL CONSULTATION SUMMARY\nExported: ${new Date().toLocaleString()}\n*Notice: General educational notes to share with your physician. Not a formal diagnosis.*\n\n==================================================\n\n`;

    const blob = new Blob([header + textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medicare-health-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to format simple markdown lines
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-base font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="text-lg font-bold text-slate-900 mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-slate-700 my-0.5">
            {line.substring(2)}
          </li>
        );
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return (
          <p key={idx} className="ml-2 font-medium text-slate-800 my-1">
            {line}
          </p>
        );
      }
      if (line.trim().startsWith('*') && line.trim().endsWith('*') && !line.includes('**')) {
        return (
          <p key={idx} className="text-xs italic text-slate-500 my-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            {line.replace(/\*/g, '')}
          </p>
        );
      }
      if (line.trim() === '---') {
        return <hr key={idx} className="my-3 border-slate-200" />;
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="my-1 text-slate-800 leading-relaxed">
          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Medical Disclaimer Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">MediCare AI Health Assistant</h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                n8n Cloud AI Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evidence-based health explanations, symptom education, and clinical visit preparation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={handleExportSummary}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Download consultation notes as a text file for your doctor"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Notes</span>
          </button>
          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Persistent Medical Disclaimer Box */}
      <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-semibold text-amber-950">Mandatory Medical Notice:</strong> This assistant provides general educational information and is not a substitute for professional medical advice, diagnosis, or treatment. Never disregard professional clinical advice because of something you have read here.
        </div>
      </div>

      {/* Emergency Active Alert Card (Mounts if emergency words detected) */}
      {emergencyAlertActive && (
        <div className="p-4 sm:p-5 bg-rose-600 text-white rounded-2xl shadow-lg animate-in slide-in-from-top-2 duration-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-white animate-ping" />
              <h3 className="font-bold text-base sm:text-lg">POTENTIAL EMERGENCY DETECTED</h3>
            </div>
            <button
              onClick={() => setEmergencyAlertActive(false)}
              className="text-rose-200 hover:text-white text-xs underline"
            >
              Dismiss alert
            </button>
          </div>

          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Your query mentions symptoms that may require urgent medical evaluation (such as chest pain, severe shortness of breath, sudden facial/arm numbness, or acute trauma). <strong>Do not wait for AI responses.</strong>
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="tel:911"
              className="px-4 py-2 bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 911 / 112 Immediately</span>
            </a>
            <button
              onClick={onOpenEmergency}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs sm:text-sm rounded-lg border border-rose-500"
            >
              View Emergency Hospital Guide →
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Scrollable Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            const isAsst = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isAsst ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    isAsst
                      ? 'bg-teal-50 border border-teal-200 text-teal-700'
                      : 'bg-slate-800 text-white font-bold text-xs'
                  }`}
                >
                  {isAsst ? <Bot className="w-5 h-5" /> : 'YOU'}
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 sm:p-5 text-sm space-y-2 ${
                    isAsst
                      ? 'bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs w-full'
                      : 'bg-teal-700 text-white shadow-xs max-w-xl'
                  }`}
                >
                  {/* Sender & Timestamp */}
                  <div
                    className={`flex items-center justify-between text-[11px] pb-1 border-b ${
                      isAsst ? 'text-slate-400 border-slate-200' : 'text-teal-200 border-teal-600'
                    }`}
                  >
                    <span className="font-semibold">
                      {isAsst ? 'MediCare AI Assistant' : 'You'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Body Text */}
                  <div className="prose prose-sm max-w-none">
                    {isAsst ? renderFormattedText(msg.text) : <p className="leading-relaxed">{msg.text}</p>}
                  </div>

                  {/* Assistant Actions Bar */}
                  {isAsst && (
                    <div className="pt-3 mt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReadAloud(msg.text)}
                          className="hover:text-teal-700 flex items-center gap-1 font-medium transition-colors"
                          title="Read message aloud"
                        >
                          {isSpeaking ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                              <span className="text-rose-600 font-semibold">Stop audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>

                        <span aria-hidden="true" className="text-slate-300">·</span>

                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-teal-700 flex items-center gap-1 font-medium transition-colors"
                          title="Copy clinical response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy notes</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => setActiveTab('appointments')}
                        className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule with a Doctor</span>
                      </button>
                    </div>
                  )}

                  {/* Follow-up Reflection Questions Chips */}
                  {isAsst && msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3 text-teal-600" />
                        Relevant questions to explore:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUpQuestions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => handleSend(q)}
                            className="text-left text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-800 transition-colors"
                          >
                            "{q}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-xl">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shrink-0">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex items-center gap-2">
                <span className="flex space-x-1">
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" />
                </span>
                <span>Reviewing clinical evidence and medical guidelines...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Dock & Suggested Quick Prompts */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          {/* Quick Prompts Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-600" />
              Suggested:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md transition-colors font-medium disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Text Input Field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Ask about general symptoms, blood pressure guidelines, sleep hygiene..."
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all disabled:bg-slate-100"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-5 py-3 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-xs shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
