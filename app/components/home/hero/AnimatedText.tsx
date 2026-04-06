"use client";

import { useEffect, useState } from "react";

const DEFAULT_TITLES = ["Personal Loan", "Insurance"];

const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_DURATION = 2000;

type AnimatedTextProps = {
  /** Typing animation phrases (e.g. service titles from API). */
  titles?: string[];
};

export default function AnimatedText({ titles }: AnimatedTextProps) {
  const texts = titles && titles.length > 0 ? titles : DEFAULT_TITLES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(TYPING_SPEED);

  useEffect(() => {
    if (texts.length === 0) return;
    const currentText = texts[currentIndex % texts.length];

    const handleTyping = () => {
      if (!isDeleting) {
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.substring(0, displayText.length + 1));
          setTypingSpeed(TYPING_SPEED);
        } else {
          setTypingSpeed(PAUSE_DURATION);
          setIsDeleting(true);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.substring(0, displayText.length - 1));
          setTypingSpeed(DELETING_SPEED);
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          setTypingSpeed(TYPING_SPEED);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex, typingSpeed, texts]);

  return (
    <span className="inline-block min-w-[6ch] xs:min-w-[8ch] sm:min-w-[10ch] md:min-w-[180px] text-left shrink-0">
      <span 
        className="inline-block font-bold"
        style={{ 
          color: '#FFDF2A',
          fontWeight: 700,
          textShadow: '0 2px 8px rgba(255, 223, 42, 0.5)',
        }}
      >
        {displayText}
        <span className="animate-pulse">|</span>
      </span>
    </span>
  );
}
