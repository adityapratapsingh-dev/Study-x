import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Note } from '../../types';
import { requestAiSummary, requestAiExplain } from '../../lib/geminiApi';
import {
  FileText,
  Plus,
  Star,
  Trash2,
  Sparkles,
  Layers,
  FileCheck,
  Tag,
  Clock,
  Eye,
  Edit3,
  Columns,
  Share2,
  Check,
  Copy,
  Folder,
  BookOpen,
  Search,
  Bot,
  HelpCircle,
  Hash,
  List,
  Code2,
  Quote,
  Bold,
  Italic,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';

export const NotesWorkspace: React.FC = () => {
  const {
    notes,
    selectedNoteId,
    setSelectedNoteId,
    addNote,
    updateNote,
    deleteNote,
    toggleFavoriteNote,
    subjects,
    selectedSubjectId,
    setSelectedSubjectId,
    searchQuery,
    setIsAiQuizModalOpen,
    setAiQuizPresetNote,
    setIsAiFlashcardModalOpen,
    setAiFlashcardPresetNote,
    setActiveTab,
  } = useWorkspace();

  const [editorMode, setEditorMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  // Quick Explain Drawer / Modal
  const [explainQuery, setExplainQuery] = useState('');
  const [explainResult, setExplainResult] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showExplainBox, setShowExplainBox] = useState(false);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedSubjectId && n.subjectId !== selectedSubjectId) return false;
      if (showOnlyFavorites && !n.isFavorite) return false;
      if (selectedTagFilter && !n.tags.includes(selectedTagFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesContent = n.content.toLowerCase().includes(q);
        const matchesTag = n.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTag) return false;
      }
      return true;
    });
  }, [notes, selectedSubjectId, showOnlyFavorites, selectedTagFilter, searchQuery]);

  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || filteredNotes[0] || null;
  }, [notes, selectedNoteId, filteredNotes]);

  const activeSubject = useMemo(() => {
    if (!activeNote) return null;
    return subjects.find((s) => s.id === activeNote.subjectId) || null;
  }, [activeNote, subjects]);

  // All unique tags across notes
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [notes]);

  const handleCreateNewNote = () => {
    const n = addNote({
      title: 'Untitled Note',
      subjectId: selectedSubjectId || subjects[0]?.id || 'cs-algo',
      content: `# New Topic Notes\n\n## 1. Overview\nWrite your concepts and study material here...\n\n## 2. Key Definitions & Formulas\n- \n\n## 3. Practice Observations\n- \n`,
      tags: ['Study'],
    });
    setSelectedNoteId(n.id);
  };

  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (!activeNote || !newTagInput.trim()) return;
    const tag = newTagInput.trim().replace(/^#/, '');
    if (!activeNote.tags.includes(tag)) {
      updateNote(activeNote.id, {
        tags: [...activeNote.tags, tag],
      });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!activeNote) return;
    updateNote(activeNote.id, {
      tags: activeNote.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleInsertFormatting = (prefix: string, suffix: string = '') => {
    if (!activeNote) return;
    const textarea = document.getElementById('note-markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = activeNote.content;
    const selectedText = currentText.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);
    updateNote(activeNote.id, { content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  const handleGenerateSummary = async () => {
    if (!activeNote) return;
    setIsGeneratingSummary(true);
    try {
      const summary = await requestAiSummary({
        noteTitle: activeNote.title,
        noteContent: activeNote.content,
      });
      updateNote(activeNote.id, { aiSummary: summary });
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleTriggerQuizFromNote = () => {
    if (!activeNote) return;
    setAiQuizPresetNote(activeNote);
    setIsAiQuizModalOpen(true);
  };

  const handleTriggerFlashcardsFromNote = () => {
    if (!activeNote) return;
    setAiFlashcardPresetNote(activeNote);
    setIsAiFlashcardModalOpen(true);
  };

  const handleExplainConcept = async () => {
    if (!explainQuery.trim()) return;
    setIsExplaining(true);
    try {
      const res = await requestAiExplain({
        query: explainQuery,
        context: activeNote?.content,
        mode: 'standard',
      });
      setExplainResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleCopyNote = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-112px)] bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* LEFT SIDEBAR: Notes Directory & Filters */}
      <aside className="w-full md:w-80 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0">
        
        {/* Directory Controls */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Notes Library</h2>
            </div>
            <span className="text-xs px-2 py-0.5 bg-slate-800 rounded text-slate-400 font-medium">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {/* New Note Button */}
          <button
            id="btn-sidebar-new-note"
            onClick={handleCreateNewNote}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Note</span>
          </button>

          {/* Favorites & Filter row */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowOnlyFavorites((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                showOnlyFavorites
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Favorites</span>
            </button>

            {selectedTagFilter && (
              <button
                onClick={() => setSelectedTagFilter(null)}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                Clear Tag (#{selectedTagFilter})
              </button>
            )}
          </div>

          {/* Quick Tag Pills */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1 max-h-16 overflow-y-auto no-scrollbar">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? null : tag)}
                  className={`text-[11px] px-2 py-0.5 rounded-full transition cursor-pointer ${
                    selectedTagFilter === tag
                      ? 'bg-indigo-500 text-white font-semibold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes List Scroll */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No notes found.</p>
              <button
                onClick={handleCreateNewNote}
                className="mt-3 text-xs text-indigo-400 hover:underline font-medium"
              >
                Create your first note
              </button>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              const sub = subjects.find((s) => s.id === note.subjectId);
              return (
                <div
                  key={note.id}
                  id={`note-card-${note.id}`}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3 rounded-xl transition cursor-pointer text-left group ${
                    isSelected
                      ? 'bg-indigo-950/70 border border-indigo-500/40 text-white shadow-sm'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold line-clamp-1 group-hover:text-indigo-300 transition">
                      {note.title || 'Untitled Note'}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavoriteNote(note.id);
                      }}
                      className="text-slate-500 hover:text-amber-400 transition"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          note.isFavorite ? 'fill-amber-400 text-amber-400' : 'opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {note.content.replace(/[#*`_\[\]]/g, '').slice(0, 100)}
                  </p>

                  <div className="flex items-center justify-between mt-2.5 pt-1 text-[11px] text-slate-500">
                    <span
                      className="px-1.5 py-0.5 rounded font-medium text-[10px]"
                      style={{
                        backgroundColor: `${sub?.color || '#3B82F6'}20`,
                        color: sub?.color || '#3B82F6',
                      }}
                    >
                      {sub?.code || 'General'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* MAIN NOTE EDITOR & VIEWER */}
      {activeNote ? (
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
          
          {/* Note Action Toolbar */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3">
            
            {/* Subject Selector & Title Meta */}
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <select
                id="note-subject-select"
                value={activeNote.subjectId}
                onChange={(e) => updateNote(activeNote.id, { subjectId: e.target.value })}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code}: {sub.name}
                  </option>
                ))}
              </select>

              <button
                id="btn-note-fav"
                onClick={() => toggleFavoriteNote(activeNote.id)}
                className={`p-1.5 rounded-lg border transition ${
                  activeNote.isFavorite
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-800'
                }`}
                title="Toggle Favorite"
              >
                <Star className={`w-4 h-4 ${activeNote.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>

              <button
                id="btn-note-copy"
                onClick={handleCopyNote}
                className="p-1.5 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800 rounded-lg transition"
                title="Copy Markdown to Clipboard"
              >
                {copiedNote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                id="btn-note-delete"
                onClick={() => deleteNote(activeNote.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 border border-slate-800 hover:bg-slate-800 rounded-lg transition"
                title="Delete Note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* AI Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                id="btn-note-ai-test"
                onClick={handleTriggerQuizFromNote}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
                title="Generate an instant test based on this note"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Test Me on This</span>
              </button>

              <button
                id="btn-note-ai-flashcards"
                onClick={handleTriggerFlashcardsFromNote}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
                title="Generate flashcard deck from this note"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Make Flashcards</span>
              </button>

              <button
                id="btn-note-ai-summary"
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-950/80 hover:bg-violet-900 border border-violet-700/50 text-violet-200 rounded-lg text-xs font-medium transition disabled:opacity-50 cursor-pointer"
                title="Generate AI Study Guide & Executive Summary"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                <span>{isGeneratingSummary ? 'Summarizing...' : 'AI Study Guide'}</span>
              </button>

              {/* View Mode Switcher */}
              <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                <button
                  onClick={() => setEditorMode('edit')}
                  className={`p-1.5 rounded text-xs transition ${
                    editorMode === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Editor Only"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditorMode('split')}
                  className={`p-1.5 rounded text-xs transition hidden sm:block ${
                    editorMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Split View"
                >
                  <Columns className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditorMode('preview')}
                  className={`p-1.5 rounded text-xs transition ${
                    editorMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Preview Only"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Note Title & Tags Bar */}
          <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/20 space-y-3">
            <input
              type="text"
              id="note-title-input"
              value={activeNote.title}
              onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
              placeholder="Note Title (e.g. Graph Traversal & Dijkstra Algorithms)"
              className="w-full text-xl sm:text-2xl font-bold bg-transparent border-none text-white placeholder-slate-500 focus:outline-none tracking-tight"
            />

            {/* Tags line */}
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              {activeNote.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 bg-slate-800 text-indigo-300 rounded-full border border-slate-700"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-400 ml-0.5 text-[10px]"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="inline-flex items-center">
                <input
                  type="text"
                  placeholder="+ Add tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTag(e);
                  }}
                  className="text-xs bg-slate-900 border border-slate-800 rounded-full px-2.5 py-0.5 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-24"
                />
              </div>
            </div>
          </div>

          {/* AI Executive Summary Box (If exists) */}
          {activeNote.aiSummary && (
            <div className="mx-6 mt-4 p-4 rounded-xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-slate-900 border border-indigo-500/30 text-slate-200 relative group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-violet-300">
                    AI Study Guide & Executive Summary
                  </h4>
                </div>
                <button
                  onClick={() => updateNote(activeNote.id, { aiSummary: undefined })}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Dismiss
                </button>
              </div>
              <div className="prose prose-invert prose-sm max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed">
                <ReactMarkdown>{activeNote.aiSummary}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Formatting Quick Toolbar */}
          {editorMode !== 'preview' && (
            <div className="px-6 py-2 border-b border-slate-800/60 bg-slate-900/30 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => handleInsertFormatting('**', '**')}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleInsertFormatting('*', '*')}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <span className="w-px h-4 bg-slate-800 mx-1" />
              <button
                onClick={() => handleInsertFormatting('# ')}
                className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded font-bold"
                title="H1 Heading"
              >
                H1
              </button>
              <button
                onClick={() => handleInsertFormatting('## ')}
                className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded font-bold"
                title="H2 Heading"
              >
                H2
              </button>
              <button
                onClick={() => handleInsertFormatting('### ')}
                className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded font-bold"
                title="H3 Heading"
              >
                H3
              </button>
              <span className="w-px h-4 bg-slate-800 mx-1" />
              <button
                onClick={() => handleInsertFormatting('- ')}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleInsertFormatting('- [ ] ')}
                className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
                title="Task Checklist"
              >
                ☑ Task
              </button>
              <button
                onClick={() => handleInsertFormatting('```ts\n', '\n```')}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
                title="Code Block"
              >
                <Code2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleInsertFormatting('$$\n', '\n$$')}
                className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded font-serif"
                title="Math Formula LaTeX"
              >
                ∑ Formula
              </button>
              <button
                onClick={() => handleInsertFormatting('> ')}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
                title="Quote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  handleInsertFormatting(
                    '| Concept | Description |\n| :--- | :--- |\n| Item 1 | Detail 1 |\n'
                  )
                }
                className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
                title="Table"
              >
                Table
              </button>

              <span className="flex-1" />

              {/* In-Note Quick Ask AI */}
              <button
                onClick={() => setShowExplainBox(!showExplainBox)}
                className="flex items-center gap-1 px-2 py-0.5 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/40 text-indigo-300 rounded text-xs transition"
              >
                <Bot className="w-3 h-3" />
                <span>Ask AI Tutor</span>
              </button>
            </div>
          )}

          {/* Quick AI Explainer Panel (Collapsible) */}
          {showExplainBox && (
            <div className="mx-6 mt-2 p-3 rounded-xl bg-slate-900 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question or request concept clarification on this note..."
                  value={explainQuery}
                  onChange={(e) => setExplainQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleExplainConcept();
                  }}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleExplainConcept}
                  disabled={isExplaining || !explainQuery.trim()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
                >
                  {isExplaining ? 'Thinking...' : 'Explain'}
                </button>
              </div>

              {explainResult && (
                <div className="mt-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{explainResult}</ReactMarkdown>
                </div>
              )}
            </div>
          )}

          {/* Content Workspace Area */}
          <div className="flex-1 flex overflow-hidden p-6 gap-6">
            
            {/* Editor Pane */}
            {(editorMode === 'edit' || editorMode === 'split') && (
              <div className="flex-1 flex flex-col h-full bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden">
                <textarea
                  id="note-markdown-textarea"
                  value={activeNote.content}
                  onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                  placeholder="Type your notes in Markdown here... Use # for headings, - for lists, ``` for code."
                  className="w-full h-full p-4 bg-transparent resize-none font-mono text-sm text-slate-200 focus:outline-none leading-relaxed"
                />
              </div>
            )}

            {/* Rendered Preview Pane */}
            {(editorMode === 'preview' || editorMode === 'split') && (
              <div className="flex-1 h-full overflow-y-auto bg-slate-900/20 rounded-xl border border-slate-800/80 p-6">
                <div className="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed">
                  <ReactMarkdown>{activeNote.content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500">
          <div>
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium text-slate-400">Select a note or create a new one to begin studying</p>
            <button
              onClick={handleCreateNewNote}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md transition"
            >
              + Create New Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
