import { useState, cloneElement, isValidElement } from 'react';

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
    
    // Match Korean text (including sentences with spaces between Korean words)
    const koreanRegex = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u4E00-\u9FFF]+(?:\s+[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u4E00-\u9FFF]+)*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = koreanRegex.exec(text)) !== null) {
      // Add text before Korean match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      
      // Create clickable Korean span
      const koreanSequence = match[0];
      const isPlaying = playingText === koreanSequence;
      
      parts.push(
        <span
          key={`${match.index}-${koreanSequence}`}
          onClick={() => playAudio(koreanSequence)}
          className={`
            korean-text cursor-pointer inline-block
            hover:bg-blue-100 hover:text-blue-800 hover:shadow-sm
            transition-all duration-100 ease-in-out
            rounded px-1 py-0.5 -mx-1 -my-0.5
            ${isPlaying ? 'bg-blue-200 text-blue-900 animate-pulse' : ''}
            hover: hover:-translate-y-0.25
          `}
          title={`Click to hear pronunciation: ${koreanSequence}`}
        >
          {koreanSequence}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
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
        // Recursively process React elements using cloneElement
        if (isValidElement(child)) {
          return cloneElement(child, {
            ...child.props,
            children: processChildren(child.props.children),
            key: child.key || index
          });
        }
        return child;
      });
    }
    
    // Handle single React element
    if (isValidElement(children)) {
      return cloneElement(children, {
        ...children.props,
        children: processChildren(children.props.children)
      });
    }
    
    return children;
  };

  return <>{processChildren(children)}</>;
}
