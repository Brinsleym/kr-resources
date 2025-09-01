import { useState } from 'react';

// Korean text detection regex - matches Hangul characters, Hanja, and Korean punctuation
const KOREAN_REGEX = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u4E00-\u9FFF]+/g;

export default function ClickableKoreanText({ children }) {
  const [playingText, setPlayingText] = useState(null);

  const playAudio = async (text) => {
    if (!text || playingText === text) return;
    
    try {
      setPlayingText(text);
      const audio = new Audio(`/api/tts?text=${encodeURIComponent(text.trim())}`);
      audio.volume = 0.8;
      
      audio.onended = () => setPlayingText(null);
      audio.onerror = () => {
        setPlayingText(null);
        console.error('Error playing audio for:', text);
      };
      
      await audio.play();
    } catch (error) {
      setPlayingText(null);
      console.error('Error playing audio:', error);
    }
  };

  const processText = (text) => {
    if (typeof text !== 'string') return text;
    
    const parts = [];
    let lastIndex = 0;
    let match;

    // Reset regex
    KOREAN_REGEX.lastIndex = 0;
    
    while ((match = KOREAN_REGEX.exec(text)) !== null) {
      // Add text before Korean match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Add clickable Korean text
      const koreanText = match[0];
      const isPlaying = playingText === koreanText;
      
      parts.push(
        <span
          key={`${match.index}-${koreanText}`}
          onClick={() => playAudio(koreanText)}
          className={`
            korean-text cursor-pointer inline-block
            hover:bg-blue-100 hover:text-blue-800 hover:shadow-sm
            transition-all duration-200 ease-in-out
            rounded px-1 py-0.5 -mx-1 -my-0.5
            ${isPlaying ? 'bg-blue-200 text-blue-900 animate-pulse' : ''}
            hover:scale-105 hover:-translate-y-0.5
          `}
          title={`Click to hear pronunciation: ${koreanText}`}
        >
          {koreanText}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts.length > 1 ? parts : text;
  };

  const processChildren = (children) => {
    if (typeof children === 'string') {
      return processText(children);
    }
    
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        if (typeof child === 'string') {
          return processText(child);
        }
        return child;
      });
    }
    
    return children;
  };

  return <>{processChildren(children)}</>;
}
