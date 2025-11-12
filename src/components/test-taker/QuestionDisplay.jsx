'use client';

import { useState } from 'react';

export function QuestionDisplay({ question, answer, onAnswer }) {
  const [selectedOptions, setSelectedOptions] = useState(
    answer?.selectedOptions ? JSON.parse(answer.selectedOptions) : []
  );
  const [textAnswer, setTextAnswer] = useState(answer?.answerText || '');

  const handleOptionToggle = (optionId) => {
    const updated = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    
    setSelectedOptions(updated);
    onAnswer({ selectedOptions: JSON.stringify(updated) });
  };

  if (question.type === 'open') {
    return (
      <div className="space-y-2">
        <textarea
          value={textAnswer}
          onChange={(e) => {
            setTextAnswer(e.target.value);
            onAnswer({ answerText: e.target.value });
          }}
          className="w-full p-3 border rounded-lg min-h-[150px]"
          placeholder="Type your answer here..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {question.options.map((option) => (
        <label 
          key={option.id} 
          className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selectedOptions.includes(option.id)}
            onChange={() => handleOptionToggle(option.id)}
            className="w-4 h-4"
          />
          <span>{option.text}</span>
        </label>
      ))}
    </div>
  );
}