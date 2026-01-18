
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Send, 
  Paperclip, 
  Trash2, 
  Plus, 
  Menu, 
  X, 
  ChevronLeft,
  Bot,
  User,
  Loader2,
  FileText,
  Copy,
  Check,
  Download,
  Terminal
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { ChatSession, Message, FileAttachment } from '../types';
import { getGeminiResponse } from '../services/gemini';

// Optimized Typewriter for high speed
const Typewriter = ({ text, onComplete, speed = 1 }: { text: string; onComplete?: () => void; speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const charsPerTick = text.length > 500 ? 5 : 2; 
    
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, index + charsPerTick));
        setIndex((prev) => prev + charsPerTick);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, speed, onComplete]);

  return <MarkdownRenderer content={displayedText} />;
};

// Advanced Code Block with Copy & Download and proper scrolling
const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = language === 'python' ? 'py' : 
                    language === 'javascript' ? 'js' : 
                    language === 'typescript' ? 'ts' : 
                    language === 'html' ? 'html' : 
                    language === 'css' ? 'css' : 'txt';
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `golem_code_${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-4 w-full max-w-full rounded-xl overflow-hidden border border-white/10 bg-[#0d0d0d] group/code shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{language || 'code'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white flex items-center gap-1.5"
            title="Copy Code"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            <span className="text-[10px] font-bold">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white flex items-center gap-1.5"
            title="Download File"
          >
            <Download size={14} />
            <span className="text-[10px] font-bold">Save</span>
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[500px]">
        <SyntaxHighlighter
          language={language || 'text'}
          style={vscDarkPlus}
          customStyle={{ 
            margin: 0, 
            padding: '1.5rem', 
            background: 'transparent', 
            fontSize: '13px',
            minWidth: '100%',
            width: 'max-content'
          }}
          wrapLines={false}
          wrapLongLines={false}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

// Markdown Renderer Component
const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <CodeBlock 
                language={match[1]} 
                value={String(children).replace(/\n$/, '')} 
              />
            ) : (
              <code className={`${className} bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono text-xs break-all`} {...props}>
                {children}
              </code>
            );
          },
          p: ({children}) => <p className="mb-4 last:mb-0 leading-relaxed break-words">{children}</p>,
          h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-6 break-words">{children}</h1>,
          h2: ({children}) => <h2 className="text-xl font-bold mb-3 mt-5 break-words">{children}</h2>,
          h3: ({children}) => <h3 className="text-lg font-bold mb-2 mt-4 break-words">{children}</h3>,
          a: ({children, href}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">{children}</a>,
          table: ({children}) => <div className="overflow-x-auto my-4 w-full"><table className="min-w-full glass rounded-lg border-collapse">{children}</table></div>,
          ul: ({children}) => <ul className="list-disc ml-5 mb-4 space-y-1">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal ml-5 mb-4 space-y-1">{children}</ol>,
          li: ({children}) => <li className="break-words">{children}</li>,
        }}
        className="prose prose-invert max-w-none"
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

interface ChatInterfaceProps {
  chats: ChatSession[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onUpdateChat: (chat: ChatSession) => void;
  onBackToLanding: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onUpdateChat,
  onBackToLanding
}) => {
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [animatingMessageId, setAnimatingMessageId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId), [chats, activeChatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages.length, isTyping, animatingMessageId]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || !activeChatId || !activeChat || isTyping) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    const chatWithUserMsg: ChatSession = {
      ...activeChat,
      messages: [...activeChat.messages, userMessage],
      lastModified: Date.now(),
      title: activeChat.messages.length === 0 ? (input.slice(0, 30) || 'New Conversation') : activeChat.title
    };

    onUpdateChat(chatWithUserMsg);
    
    const currentInput = input;
    const currentAttachments = [...attachments];
    
    setInput('');
    setAttachments([]);
    setIsTyping(true);

    const aiResponseContent = await getGeminiResponse(currentInput, activeChat.messages, currentAttachments);
    
    const aiMessageId = crypto.randomUUID();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'model',
      content: aiResponseContent,
      timestamp: Date.now()
    };

    onUpdateChat({
      ...chatWithUserMsg,
      messages: [...chatWithUserMsg.messages, aiMessage],
      lastModified: Date.now()
    });
    
    setIsTyping(false);
    setAnimatingMessageId(aiMessageId);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    (Array.from(files) as File[]).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        const newAttachment: FileAttachment = {
          name: file.name,
          type: file.type,
          data: base64Data,
          previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden text-[#f5f5f5]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-[#0d0d0d] border-r border-white/5 z-40 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 px-2 shrink-0">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={onBackToLanding}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Bot size={18} className="text-white" />
              </div>
              <span className="font-bold tracking-tight text-lg">Golem AI</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <button 
            onClick={() => {
              onNewChat();
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-2 w-full p-3 mb-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus size={18} className="text-blue-400" />
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2 scrollbar-hide">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] px-2 mb-3">Chat History</p>
            {chats.length === 0 ? (
              <p className="text-xs text-zinc-600 px-2 py-4 italic">No history found...</p>
            ) : (
              chats.map(chat => (
                <div 
                  key={chat.id}
                  className={`
                    group relative flex items-center justify-between p-3 rounded-xl text-sm transition-all cursor-pointer border
                    ${activeChatId === chat.id 
                      ? 'bg-blue-600/10 text-blue-400 border-blue-500/30' 
                      : 'text-zinc-400 border-transparent hover:bg-white/5 hover:text-zinc-200'}
                  `}
                  onClick={() => {
                    onSelectChat(chat.id);
                    setIsSidebarOpen(false);
                    setAnimatingMessageId(null);
                  }}
                >
                  <span className="truncate pr-8 font-medium">{chat.title}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="absolute right-2 p-1.5 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all rounded-md hover:bg-red-400/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5 px-2 shrink-0">
            <div className="flex items-center gap-3 py-3 px-2 bg-white/5 rounded-2xl mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center text-xs font-bold border border-white/10">ST</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">Stoky</p>
                <p className="text-[10px] text-zinc-500 font-medium">Lead Developer</p>
              </div>
            </div>
            <button 
              onClick={onBackToLanding}
              className="w-full p-2 flex items-center gap-2 text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
            >
              <ChevronLeft size={14} />
              Return Home
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-20 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-white"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex-1 flex justify-center min-w-0">
            <div className="text-center group cursor-default max-w-full">
              <h2 className="text-sm font-bold truncate max-w-[180px] md:max-w-[400px] text-zinc-200">
                {activeChat?.title || 'Golem AI Assistant'}
              </h2>
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active System</span>
              </div>
            </div>
          </div>

          <div className="w-8"></div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 scroll-smooth">
          {activeChat?.messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
                <Bot size={48} className="text-blue-500" />
                <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full -z-10 animate-pulse"></div>
              </div>
              <h3 className="text-3xl font-extrabold mb-3 tracking-tight">I'm Golem AI</h3>
              <p className="text-zinc-400 max-w-sm leading-relaxed font-medium">
                Greetings! I'm your cheerful assistant by <span className="text-white">Stoky</span>. 
                Ready to code, analyze files, or just chat politely!
              </p>
              <div className="mt-10 grid grid-cols-2 gap-3 max-w-md w-full">
                <div className="glass p-4 rounded-2xl text-xs text-zinc-500 font-bold border-blue-500/10 hover:border-blue-500/30 transition-colors">"Analyze this CSV file"</div>
                <div className="glass p-4 rounded-2xl text-xs text-zinc-500 font-bold border-purple-500/10 hover:border-purple-500/30 transition-colors">"Write a React script"</div>
              </div>
            </div>
          )}

          {activeChat?.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 md:gap-5 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`
                flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center self-end mb-6
                ${msg.role === 'user' 
                  ? 'bg-zinc-800 shadow-xl border border-white/5' 
                  : 'bg-gradient-to-tr from-blue-600 to-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]'}
              `}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>

              {/* Message Content Container */}
              <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[75%] min-w-0 overflow-hidden ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {msg.attachments.map((att, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-white/10 bg-zinc-900 max-w-[200px] shadow-2xl hover:scale-105 transition-transform cursor-pointer">
                        {att.previewUrl ? (
                          <img src={att.previewUrl} alt="Upload" className="w-full h-auto" />
                        ) : (
                          <div className="p-3 flex items-center gap-2 text-xs font-bold">
                            <FileText size={16} className="text-blue-400" />
                            <span className="truncate">{att.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Bubble Chat */}
                <div className={`
                  p-5 rounded-[1.5rem] text-[14.5px] leading-relaxed w-full min-w-0
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-[0_10px_30px_rgba(37,99,235,0.15)] border border-blue-400/20 break-words' 
                    : 'bg-[#18181b] text-zinc-200 rounded-tl-none border border-white/5'}
                `}>
                  {animatingMessageId === msg.id ? (
                    <Typewriter 
                      text={msg.content} 
                      speed={1} 
                      onComplete={() => setAnimatingMessageId(null)} 
                    />
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>

                <span className="text-[10px] text-zinc-600 px-2 font-black uppercase tracking-widest opacity-70 shrink-0">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4 max-w-4xl mx-auto">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] self-end mb-6">
                <Bot size={18} />
              </div>
              <div className="bg-[#18181b] border border-white/5 p-4 px-6 rounded-2xl rounded-tl-none flex items-center shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4 shrink-0" />
        </div>

        {/* Input Area - Redesigned to be artistic and clean */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent shrink-0">
          <div className="max-w-4xl mx-auto relative">
            {/* Attachment Previews */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {attachments.map((att, i) => (
                  <div key={i} className="relative group p-2.5 bg-zinc-900/80 border border-white/10 rounded-xl flex items-center gap-2.5 pr-9 animate-in slide-in-from-bottom-2 duration-300 backdrop-blur-md">
                    {att.previewUrl ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10"><img src={att.previewUrl} className="w-full h-full object-cover" /></div>
                    ) : (
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20"><FileText size={18} className="text-blue-400" /></div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-300 max-w-[120px] truncate">{att.name}</span>
                      <span className="text-[9px] text-zinc-600 font-bold uppercase">Ready to upload</span>
                    </div>
                    <button 
                      onClick={() => removeAttachment(i)}
                      className="absolute right-2 p-1 text-zinc-500 hover:text-white bg-white/5 rounded-md transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ARTISTIC Input Container: Defined border art on the outside, CLEAN inside */}
            <div className="relative bg-[#111113]/40 backdrop-blur-3xl rounded-[2.5rem] p-1.5 shadow-[0_10px_50px_-10px_rgba(0,0,0,0.5)] border border-white/5 transition-all duration-500 hover:border-blue-500/20 group/input">
              <div className="flex items-end gap-1 px-2">
                {/* Side Icons: These are the 'Prominent Art' parts */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 text-zinc-500 hover:text-blue-400 hover:bg-white/5 rounded-full transition-all shrink-0 group-hover/input:text-zinc-400"
                  title="Attach Documents or Images"
                >
                  <Paperclip size={20} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  multiple 
                />
                
                {/* CLEAN INTERNAL INPUT: NO FOCUS BORDER/OUTLINE */}
                <textarea 
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Golem anything politely..."
                  className="flex-1 bg-transparent border-none border-0 focus:border-0 ring-0 focus:ring-0 outline-none focus:outline-none text-[15px] py-4 px-3 resize-none max-h-60 scrollbar-hide min-h-[56px] font-medium placeholder:text-zinc-700 text-zinc-200"
                  style={{ boxShadow: 'none', appearance: 'none', WebkitAppearance: 'none' }}
                  rows={1}
                />

                <button 
                  onClick={handleSend}
                  disabled={(!input.trim() && attachments.length === 0) || isTyping}
                  className={`
                    p-4 rounded-full transition-all shrink-0 mb-1
                    ${(!input.trim() && attachments.length === 0) || isTyping 
                      ? 'text-zinc-800' 
                      : 'text-white hover:scale-110 active:scale-95 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]'}
                  `}
                >
                  {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 px-8">
              <p className="text-[10px] text-zinc-800 uppercase tracking-[0.3em] font-black">
                GOLEM <span className="text-zinc-900 mx-1">/</span> STOKY
              </p>
              <div className="flex gap-6">
                <span className="text-[9px] text-zinc-900 font-black uppercase tracking-widest">v.3.1.0</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span className="text-[9px] text-zinc-900 font-black uppercase tracking-widest">System Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
