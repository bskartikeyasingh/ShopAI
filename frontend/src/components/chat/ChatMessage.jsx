import React from 'react';

export const ChatMessage = ({ message }) => {
  const isUser = message?.sender === 'user';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3`}>
      <div
        className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
          isUser
            ? 'bg-forest-900 text-white rounded-tr-none font-medium shadow-xs'
            : 'bg-white text-surface-900 border border-surface-200 rounded-tl-none shadow-2xs'
        }`}
      >
        <p className="whitespace-pre-wrap">{message?.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
