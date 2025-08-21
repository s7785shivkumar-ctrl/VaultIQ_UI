import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { X, Send, Paperclip, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { quickPrompts } from '../data/mockData';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import { serverUrl } from '../utils/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIPanel({ isOpen, onClose }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { selectedWallet } = useWallet();
  const { accessToken, user } = useAuth();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages when panel opens
  useEffect(() => {
    if (isOpen && accessToken && user && messages.length === 0) {
      loadMessages();
    }
  }, [isOpen, accessToken, user]);

  const loadMessages = async () => {
    if (!accessToken) return;

    try {
      const response = await fetch(`${serverUrl}/ai/messages`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {
      console.error('Error loading AI messages:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !accessToken) return;

    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${serverUrl}/ai/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ message: userInput })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const { messages: updatedMessages } = await response.json();
      
      // Find the new assistant message and simulate streaming
      const lastMessage = updatedMessages[updatedMessages.length - 1];
      if (lastMessage && lastMessage.type === 'assistant') {
        // Set messages without the last AI message first
        setMessages(updatedMessages.slice(0, -1));
        setIsLoading(false);
        setIsStreaming(true);
        
        // Simulate streaming by adding words progressively
        const words = lastMessage.content.split(' ');
        let currentContent = '';
        
        const streamingMessage: Message = {
          ...lastMessage,
          content: ''
        };

        setMessages(prev => [...prev, streamingMessage]);

        words.forEach((word, index) => {
          setTimeout(() => {
            currentContent += (index === 0 ? '' : ' ') + word;
            setMessages(prev => 
              prev.map(msg => 
                msg.id === streamingMessage.id 
                  ? { ...msg, content: currentContent }
                  : msg
              )
            );
            
            if (index === words.length - 1) {
              setIsStreaming(false);
            }
          }, index * 50);
        });
      } else {
        setMessages(updatedMessages);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.message || 'Failed to send message');
      setIsLoading(false);
      setInput(userInput); // Restore the input
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full lg:w-96 bg-card border-l border-border z-50 flex flex-col"
            id="ai-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold">AI Insights</h2>
                  {selectedWallet && (
                    <p className="text-xs text-muted-foreground">
                      {selectedWallet.ens || formatAddress(selectedWallet.address)}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex space-x-2 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-100 dark:bg-blue-900/20' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex space-x-2 max-w-[80%]">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick prompts */}
            <div className="p-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Quick prompts:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickPrompts.slice(0, 4).map((prompt) => (
                  <Badge
                    key={prompt}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </Badge>
                ))}
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Ask about your portfolio..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    disabled={isLoading || isStreaming || !accessToken}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    disabled
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || isStreaming || !accessToken}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {!accessToken && (
                <p className="text-xs text-muted-foreground mt-2">
                  Please sign in to use AI features
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}