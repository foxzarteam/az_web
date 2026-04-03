"use client";

import { useEffect, useState } from "react";

const TEXTS = [
  "Personal Loan",
  "Business Loan",
  "Home Loan",
  "Credit Card",
  "Insurance",
];

const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_DURATION = 2000;

export default function AnimatedText() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(TYPING_SPEED);

  useEffect(() => {
    const currentText = TEXTS[currentIndex];
    
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
          setCurrentIndex((prev) => (prev + 1) % TEXTS.length);
          setTypingSpeed(TYPING_SPEED);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex, typingSpeed]);

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
