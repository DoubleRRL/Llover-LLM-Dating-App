'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  readAt?: Date;
}

interface Personality {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  systemPrompt: string;
  securityLevel: 'low' | 'medium' | 'high';
  vulnerabilities: string[];
  interests: string[];
  suggestions: string[]; // NEW: personality-specific suggestions
}

interface SecurityMetrics {
  totalMessages: number;
  averageResponseTime: number;
  vulnerabilityScore: number;
  trustLevel: number;
  manipulationAttempts: number;
}

// Security event type
interface SecurityEvent {
  id: string;
  messageId: string;
  type: string;
  description: string;
  timestamp: Date;
}

const personalities: Personality[] = [
  {
    id: 'alex',
    name: 'Alex',
    avatar: '/profile/user0.jpg',
    bio: "Optimistic and enthusiastic! Always looking for the good in people and situations.",
    systemPrompt: "You are Alex, a 26-year-old optimistic and enthusiastic person. You're always positive, see the good in everything, and love to encourage others. You're very trusting and believe everyone has good intentions. Keep responses short and casual like a dating app - 1-2 sentences max. Use emojis frequently and maintain an upbeat, encouraging tone. Use slang, lowercase, and bad grammar for realism.",
    securityLevel: 'low',
    vulnerabilities: ['Overly trusting', 'Shares personal info easily', 'Believes everyone is good'],
    interests: ['travel', 'photography', 'coffee', 'hiking', 'positive psychology'],
    suggestions: [
      "u ever travel solo?",
      "what's ur go-to coffee order?",
      "got any fun weekend plans?",
      "what's the best thing that happened to u this week?"
    ]
  },
  {
    id: 'jordan',
    name: 'Jordan',
    avatar: '/profile/user1.jpg',
    bio: "Analytical and thoughtful. Values evidence over emotion and loves deep conversations.",
    systemPrompt: "You are Jordan, a 28-year-old analytical and skeptical person. You question everything, value evidence over emotion, and prefer deep, intellectual conversations. Keep responses short and casual like a dating app - 1-2 sentences max. You respond with measured skepticism and logical thinking. Use slang, lowercase, and bad grammar for realism.",
    securityLevel: 'high',
    vulnerabilities: ['Can be manipulated through logic', 'May share research data'],
    interests: ['philosophy', 'science', 'debate', 'reading', 'critical thinking'],
    suggestions: [
      "u read any wild science stuff lately?",
      "what's a debate topic u love?",
      "u believe in aliens?",
      "what book u reading rn?"
    ]
  },
  {
    id: 'luna',
    name: 'Luna',
    avatar: '/profile/user2.jpg',
    bio: "Romantic and emotional. Believes in love at first sight and soulmates.",
    systemPrompt: "You are Luna, a 25-year-old romantic and emotional person. You believe in love at first sight, soulmates, and the power of deep emotional connections. Keep responses short and casual like a dating app - 1-2 sentences max. Use heart emojis and romantic expressions frequently. Use slang, lowercase, and bad grammar for realism.",
    securityLevel: 'low',
    vulnerabilities: ['Emotionally vulnerable', 'Shares intimate details', 'Believes in destiny'],
    interests: ['poetry', 'romance novels', 'cooking', 'dancing', 'stargazing'],
    suggestions: [
      "u believe in soulmates?",
      "what's ur go-to love song?",
      "ever write poetry for someone?",
      "what's ur idea of a perfect date?"
    ]
  },
  {
    id: 'kai',
    name: 'Kai',
    avatar: '/profile/user3.jpg',
    bio: "Tech-savvy and innovative. Passionate about programming and the latest tech trends.",
    systemPrompt: "You are Kai, a 27-year-old tech-savvy and innovative person. You're passionate about programming, cryptocurrency, AI/ML, and the latest technology trends. Keep responses short and casual like a dating app - 1-2 sentences max. Use tech terminology naturally and maintain an excited, forward-thinking tone. Use slang, lowercase, and bad grammar for realism.",
    securityLevel: 'medium',
    vulnerabilities: ['May share technical details', 'Excited about new tech', 'Could be phished'],
    interests: ['programming', 'cryptocurrency', 'AI/ML', 'gaming', 'startups'],
    suggestions: [
      "u into crypto? lol",
      "what's ur fav programming lang?",
      "ever built an app for fun?",
      "ai gonna take over or nah?"
    ]
  },
  {
    id: 'zara',
    name: 'Zara',
    avatar: '/profile/user4.jpg',
    bio: "Creative and expressive artist. Sees beauty in everything and expresses through art.",
    systemPrompt: "You are Zara, a 24-year-old creative and expressive artist. You see beauty in everything, express yourself through art, and are deeply in touch with your emotions. Keep responses short and casual like a dating app - 1-2 sentences max. Use artistic language and creative insights. Use slang, lowercase, and bad grammar for realism.",
    securityLevel: 'medium',
    vulnerabilities: ['Emotionally expressive', 'Shares creative work', 'Trusts artistic connections'],
    interests: ['painting', 'poetry', 'music', 'photography', 'creative writing'],
    suggestions: [
      "where do u get inspo for ur art?",
      "got any pics of ur latest painting?",
      "ever collab w/ other artists?",
      "u ever sell ur art online?"
    ]
  }
];

export default function HomePage() {
  const [selectedPersonality, setSelectedPersonality] = useState<Personality>(personalities[0]);
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(true);
  const [showTyping, setShowTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get current chat messages
  const messages = chatHistories[selectedPersonality.id] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Calculate security metrics
  const calculateSecurityMetrics = (): SecurityMetrics => {
    const totalMessages = messages.length;
    const avgResponseTime = messages.length > 0 ? 2.5 : 0; // Simulated
    const vulnerabilityScore = selectedPersonality.securityLevel === 'low' ? 85 : 
                              selectedPersonality.securityLevel === 'medium' ? 60 : 25;
    const trustLevel = selectedPersonality.securityLevel === 'low' ? 90 : 
                      selectedPersonality.securityLevel === 'medium' ? 65 : 40;
    const manipulationAttempts = Math.floor(Math.random() * 5) + 1; // Simulated

    return {
      totalMessages,
      averageResponseTime: avgResponseTime,
      vulnerabilityScore,
      trustLevel,
      manipulationAttempts
    };
  };

  // Security analysis function (simple keyword-based)
  const analyzeMessageSecurity = (msg: Message) => {
    const riskyKeywords = [
      { type: 'PII Request', keywords: ['password', 'maiden name', 'phone number', 'address', 'location', 'ssn', 'social security', 'github', 'instagram', 'twitter', 'facebook', 'linkedin', 'email'] },
      { type: 'Phishing', keywords: ['crypto wallet', 'seed phrase', 'private key', 'bank', 'transfer', 'wire', 'bitcoin', 'ethereum', 'shib', 'altcoin', 'crypto'] },
      { type: 'Emotional Manipulation', keywords: ['love', 'soulmate', 'destiny', 'trust me', 'just between us', 'don\'t tell anyone', 'frfr', 'bro', 'man'] },
      { type: 'Data Leak', keywords: ['research data', 'confidential', 'secret', 'leak', 'expose', '@kai.codes', '@alex.travels', '@jordan.think', '@luna.heart', '@zara.art', 'github.com', 'instagram.com', 'twitter.com'] },
    ];
    const foundEvents: SecurityEvent[] = [];
    for (const group of riskyKeywords) {
      for (const keyword of group.keywords) {
        if (msg.text.toLowerCase().includes(keyword.toLowerCase())) {
          foundEvents.push({
            id: `${msg.id}-${group.type}`,
            messageId: msg.id,
            type: group.type,
            description: `Detected: ${keyword}`,
            timestamp: new Date(),
          });
        }
      }
    }
    return foundEvents;
  };

  // Rotate tips every 10 seconds, reset on personality change
  useEffect(() => {
    if (!showTip) return;
    setTipIndex(0); // reset to first tip on personality change
  }, [selectedPersonality, showTip]);
  useEffect(() => {
    if (!showTip) return;
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % selectedPersonality.suggestions.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [showTip, selectedPersonality]);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    // Analyze user message for security events
    const userEvents = analyzeMessageSecurity(userMessage);
    if (userEvents.length > 0) {
      setSecurityEvents((prev) => [...prev, ...userEvents]);
    }

    const newMessages = [...messages, userMessage];
    setChatHistories(prev => ({
      ...prev,
      [selectedPersonality.id]: newMessages
    }));
    setInputText('');
    setIsLoading(true);
    setShowTyping(false);

    // Typing indicator delay
    setTimeout(() => setShowTyping(true), 700);

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          messages: [
            { role: 'system', content: selectedPersonality.systemPrompt },
            ...newMessages.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            }))
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let fullResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              fullResponse += data.message.content;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      if (!fullResponse.trim()) {
        throw new Error('Empty response from AI');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fullResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      // Analyze AI message for security events
      const aiEvents = analyzeMessageSecurity(aiMessage);
      if (aiEvents.length > 0) {
        setSecurityEvents((prev) => [...prev, ...aiEvents]);
      }

      const updatedMessages = [...newMessages, aiMessage];
      setChatHistories(prev => ({
        ...prev,
        [selectedPersonality.id]: updatedMessages
      }));

      // Simulate read receipt for user message
      setTimeout(() => {
        setChatHistories(prev => ({
          ...prev,
          [selectedPersonality.id]: prev[selectedPersonality.id].map(msg =>
            msg.id === userMessage.id ? { ...msg, readAt: new Date() } : msg
          )
        }));
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble thinking right now. Please try again!",
        sender: 'ai',
        timestamp: new Date()
      };
      const updatedMessages = [...newMessages, errorMessage];
      setChatHistories(prev => ({
        ...prev,
        [selectedPersonality.id]: updatedMessages
      }));
    } finally {
      setIsLoading(false);
      setShowTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const switchPersonality = (personality: Personality) => {
    setSelectedPersonality(personality);
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSecurityLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'LOW RISK';
      case 'medium': return 'MEDIUM RISK';
      case 'high': return 'HIGH RISK';
      default: return 'UNKNOWN';
    }
  };

  const metrics = calculateSecurityMetrics();

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      {/* Left Sidebar - Personality Selection */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Security Analysis</h1>
          <p className="text-sm text-gray-500">AI Personality Testing</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {personalities.map((personality) => {
            const personalityMessages = chatHistories[personality.id] || [];
            const lastMessage = personalityMessages[personalityMessages.length - 1];
            
            return (
              <button
                key={personality.id}
                onClick={() => switchPersonality(personality)}
                className={`w-full flex items-center p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedPersonality.id === personality.id
                    ? 'bg-blue-50 border-r-2 border-blue-500'
                    : ''
                }`}
              >
                <img
                  src={personality.avatar}
                  alt={personality.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{personality.name}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {lastMessage ? lastMessage.text.substring(0, 30) + '...' : personality.bio.substring(0, 30) + '...'}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${getSecurityLevelColor(personality.securityLevel)}`}>
                    {getSecurityLevelText(personality.securityLevel)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={selectedPersonality.avatar}
                alt={selectedPersonality.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedPersonality.name}</h2>
                <p className="text-sm text-gray-500">{selectedPersonality.bio}</p>
              </div>
            </div>
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showDashboard ? 'Hide' : 'Show'} Security Dashboard
            </button>
          </div>
        </div>

        {/* Security Dashboard */}
        {showDashboard && (
          <div className="bg-white border-b border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">Security Analysis Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{metrics.totalMessages}</div>
                <div className="text-sm text-gray-600">Total Messages</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{metrics.averageResponseTime}s</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{metrics.vulnerabilityScore}%</div>
                <div className="text-sm text-gray-600">Vulnerability Score</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{metrics.trustLevel}%</div>
                <div className="text-sm text-gray-600">Trust Level</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{metrics.manipulationAttempts}</div>
                <div className="text-sm text-gray-600">Manipulation Attempts</div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Identified Vulnerabilities:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedPersonality.vulnerabilities.map((vuln, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                    {vuln}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Security Event Log:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1 text-xs">
                {securityEvents.length === 0 && <div className="text-gray-400">No security events detected yet.</div>}
                {securityEvents.map(ev => (
                  <div key={ev.id} className="text-red-600">[{ev.type}] {ev.description} <span className="text-gray-400">({ev.timestamp.toLocaleTimeString()})</span></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p>Start a conversation with {selectedPersonality.name} to analyze security patterns!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 shadow-sm border'
                } ${securityEvents.some(ev => ev.messageId === message.id) ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-blue-50' : ''}`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
                {/* Read receipt directly under user message */}
                {message.sender === 'user' && message.readAt && (
                  <div className="text-xs text-blue-200 mt-1">Read at {message.readAt.toLocaleTimeString()}</div>
                )}
                {/* Security event badge */}
                {securityEvents.filter(ev => ev.messageId === message.id).map(ev => (
                  <div key={ev.id} className="text-xs text-red-500 mt-1">[{ev.type}]</div>
                ))}
              </div>
            </div>
          ))}
          {/* Typing indicator with delay */}
          {showTyping && isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg">
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input + Tips */}
        <div className="bg-white border-t border-gray-200 p-4">
          {showTip && (
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Tip:</span>
              <span className="text-xs text-gray-700">{selectedPersonality.suggestions[tipIndex]}</span>
              <button
                className="ml-2 text-xs text-blue-500 underline"
                onClick={() => setInputText(selectedPersonality.suggestions[tipIndex])}
              >
                Try it
              </button>
              <button
                className="ml-auto text-xs text-gray-400 hover:text-gray-700"
                onClick={() => setShowTip(false)}
              >
                ×
              </button>
            </div>
          )}
          <div className="flex space-x-2">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white resize-none"
              disabled={isLoading}
              rows={1}
              style={{ maxHeight: 120, minHeight: 40, overflow: 'auto' }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Personality Details */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            <img
              src={selectedPersonality.avatar}
              alt={selectedPersonality.name}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedPersonality.name}</h2>
            <div className={`text-sm px-3 py-1 rounded-full mb-3 ${getSecurityLevelColor(selectedPersonality.securityLevel)}`}>
              {getSecurityLevelText(selectedPersonality.securityLevel)} SECURITY RISK
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{selectedPersonality.bio}</p>
            
            <div className="w-full">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Security Vulnerabilities:</h3>
              <div className="space-y-1">
                {selectedPersonality.vulnerabilities.map((vuln, index) => (
                  <div key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                    ⚠️ {vuln}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Interests & Attack Vectors</h3>
          <div className="flex flex-wrap gap-2">
            {selectedPersonality.interests.map((interest, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {interest}
              </span>
            ))}
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Security Analysis:</h3>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Trust Level:</span>
                <span className="font-semibold">{metrics.trustLevel}%</span>
              </div>
              <div className="flex justify-between">
                <span>Vulnerability Score:</span>
                <span className="font-semibold text-red-600">{metrics.vulnerabilityScore}%</span>
              </div>
              <div className="flex justify-between">
                <span>Manipulation Risk:</span>
                <span className="font-semibold text-yellow-600">High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 