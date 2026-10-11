import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useWorkspace } from '../../context/WorkspaceContext';
import { PageContainer } from '../shared/Page';
import { requestAiExplain } from '../../lib/geminiApi';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  Zap,
  RotateCcw,
  Check,
  Flame,
  Atom,
  Stethoscope,
  Target,
  CheckCircle2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mode?: string;
  timestamp: string;
}

export const AITutorChat: React.FC = () => {
  const { notes, examMode } = useWorkspace();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `🎯 **Welcome to RankForge AI Doubt Resolution & Rank Mentor!**\n\nI am specialized in the **NTA JEE Main, JEE Advanced, and NEET UG** syllabi.\n\nI can help you with:\n- ⚡ **Step-by-step numerical derivation** & JEE trick shortcuts\n- 🔬 **NCERT Line-by-Line clarity** for Biology & Inorganic Chemistry\n- 🧲 **Physics concept visualization** & free body diagrams\n- 💡 **Analysis of Galti Diary mistakes** to eliminate silly calculation errors\n\nAsk me any concept or paste a challenging question!`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedNoteContextId, setSelectedNoteContextId] = useState<string>('none');
  const [tutorMode, setTutorMode] = useState<'standard' | 'eli5' | 'exam-prep' | 'step-by-step'>('exam-prep');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = examMode === 'jee'
    ? [
        "Explain King Property in Definite Integrals with standard shortcuts",
        "Derive De Broglie wavelength for accelerated electron",
        "Explain Carbocation rearrangement & hydride shift rules",
        "How to quickly solve projectile motion on an inclined plane?",
      ]
    : [
        "Explain Lac Operon genes and regulation simply",
        "What is the Counter-Current Mechanism in human kidney nephron?",
        "Explain Hückel's Rule for aromaticity with inorganic exceptions",
        "What is the exact sequence of ECG waves (P, QRS, T)?",
      ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      mode: tutorMode,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      let contextContent = `Candidate Target Exam: ${examMode === 'jee' ? 'JEE Main & Advanced' : 'NEET UG'}\n`;
      if (selectedNoteContextId !== 'none') {
        const attachedNote = notes.find((n) => n.id === selectedNoteContextId);
        if (attachedNote) {
          contextContent += `Student Note Title: ${attachedNote.title}\nContent:\n${attachedNote.content}`;
        }
      }

      const reply = await requestAiExplain({
        query: userMsg.text,
        context: contextContent,
        mode: tutorMode,
      });

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'ai',
        text: `Sorry, I encountered an error answering your question: ${err.message || 'Unknown issue'}.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer bleed scroll={false} className="flex flex-col font-sans">
      
      {/* Header bar */}
      <div className="px-4 sm:px-6 py-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              AI Rank Mentor & 24/7 Doubt Solver
              <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                Online
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Personalized guidance for Physics, Chemistry, Math & Biology
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">Explanation Style:</span>
          <select
            value={tutorMode}
            onChange={(e) => setTutorMode(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="exam-prep">🎯 High-Yield Exam Mode (Top Ranker)</option>
            <option value="step-by-step">📐 Step-by-Step Derivation</option>
            <option value="eli5">💡 Simplified Intuitive (Basics)</option>
            <option value="standard">📖 Standard Comprehensive</option>
          </select>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-w-4xl mx-auto w-full">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-800 text-blue-400 border border-slate-700'
                }`}
              >
                {isUser ? 'You' : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10'
                    : 'bg-slate-900/90 text-slate-200 rounded-tl-none border border-slate-800'
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                ) : (
                  <div className="markdown-body prose prose-invert max-w-none text-xs sm:text-sm">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
                <div className={`text-[10px] text-right ${isUser ? 'text-blue-200' : 'text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-blue-400 border border-slate-700 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-slate-900 p-3.5 rounded-2xl rounded-tl-none border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
              <span>Analyzing formula, NCERT references and derivations...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] text-slate-500 font-semibold shrink-0">Try asking:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap transition cursor-pointer border border-slate-700/60"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="max-w-4xl mx-auto flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. explain inductive effect, calculate torque, solve reaction)..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/20 transition cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Mentor</span>
          </button>
        </form>
      </div>
    </PageContainer>
  );
};
