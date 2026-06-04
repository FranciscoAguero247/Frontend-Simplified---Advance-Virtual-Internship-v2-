"use client";

import React from "react";


interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export default function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="accordion__card">
      <div className="accordion__header" onClick={onClick} style={{ cursor: "pointer" }}>
        <div className="accordion__title">{question}</div>
        <svg 
          stroke="currentColor" 
          fill="currentColor" 
          strokeWidth="0" 
          viewBox="0 0 16 16" 
          className={`accordion__icon ${isOpen ? "accordion__icon--rotate" : ""}`} 
          height="1em" 
          width="1em"
          style={{ transition: "transform 0.2s ease-in-out" }}
        >
          <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"></path>
        </svg>
      </div>
      
      <div 
        className={`collapse ${isOpen ? "show" : ""}`} 
        style={{ 
          height: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
          overflow: "hidden",
          transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}
      >
        <div ref={contentRef} className="accordion__body" style={{ padding: "16px 0" }}>
          {answer}
        </div>
      </div>
    </div>
  );
}