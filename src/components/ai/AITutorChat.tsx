import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useWorkspace } from '../../context/WorkspaceContext';
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
  Code2,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  mode?: string;
  timestamp: string;
}

export const AITutorChat: React.FC = () => {
  const { notes, subjects, selectedSubjectId } = useWorkspace();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `👋 **Hello! I am your 24/7 AI Academic Study Assistant.**\n\nI can help you:\n- 🧠 **Explain complex concepts** in intuitive plain English or high-yield exam mode\n- 🔍 **Break down homework problems** step-by-step\n- 💡 **Test your knowledge** with rapid self-test questions\n- 📝 **Analyze any of your saved notes**\n\nWhat topic are you studying today?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedNoteContextId, setSelectedNoteContextId] = useState<string>('none');
  const [tutorMode, setTutorMode] = useState<'standard' | 'eli5' | 'exam-prep' | 'step-by-step'>('standard');
  const [isLoading, setIsLoading] = useState(false);

  const samplePrompts = [
    "Explain SN1 vs SN2 reaction mechanisms simply",
    "Why can't Dijkstra handle negative edge weights?",
    "How to calculate eigenvalues of a 2x2 matrix step-by-step",
    "What triggers an action potential in a neuron?",
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
      let contextContent = '';
      if (selectedNoteContextId !== 'none') {
        const attachedNote = notes.find((n) => n.id === selectedNoteContextId);
        if (attachedNote) {
          contextContent = `Student Note Title: ${attachedNote.title}\nContent:\n${attachedNote.content}`;
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
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-[calc(100vh-112px)] max-w-5xl mx-auto w-full p-4 sm:p-6 overflow-hidden">
      
      {/* Top Tutor Configuration Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-4 space-y-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Academic Tutor
            </h2>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setTutorMode('standard')}
              className={`px-3 py-1 rounded-lg transition ${
                tutorMode === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Standard Tutor
            </button>
            <button
              onClick={() => setTutorMode('eli5')}
              className={`px-3 py-1 rounded-lg transition ${
                tutorMode === 'eli5' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ELI5 (Simple)
            </button>
            <button
              onClick={() => setTutorMode('exam-prep')}
              className={`px-3 py-1 rounded-lg transition ${
                tutorMode === 'exam-prep' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Exam High-Yield
            </button>
            <button
              onClick={() => setTutorMode('step-by-step')}
              className={`px-3 py-1 rounded-lg transition ${
                tutorMode === 'step-by-step' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Step-by-Step
            </button>
          </div>
        </div>

        {/* Note Context Attachment */}
        <div className="flex items-center gap-2 text-xs pt-1 border-t border-slate-800/80">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Attach Note as Context:</span>
          <select
            value={selectedNoteContextId}
            onChange={(e) => setSelectedNoteContextId(e.target.value)}
            className="px-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none"
          >
            <option value="none">None (General Knowledge)</option>
            {notes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isAi
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                    : 'bg-indigo-600 text-white shadow-indigo-600/20'
                }`}
              >
                {isAi ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{msg.text}</p>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 animate-pulse">
              AI Tutor is analyzing and formatting explanation...
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs px-3 py-1 bg-slate-900 hover:bg-slate-850 text-indigo-300 border border-slate-800 hover:border-indigo-500/40 rounded-full transition cursor-pointer"
            >
              💡 {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl shrink-0"
      >
        <input
          type="text"
          id="tutor-chat-input"
          placeholder="Ask your tutor anything (e.g. 'Explain this proof', 'Quiz me on thermodynamics')..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="flex-1 px-4 py-2 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
