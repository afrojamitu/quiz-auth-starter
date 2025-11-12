'use client';

import { useEffect, useState } from 'react';

export default function TestResultsPage({ params }) {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/tests/${params.id}/results`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching results:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading results...</div>;
  if (!results) return <div className="p-8">Results not found</div>;

  const mcqQuestions = results.answers.filter(a => a.testQuestion.question.type === 'mcq');
  const openQuestions = results.answers.filter(a => a.testQuestion.question.type === 'open');
  const gradedQuestions = results.answers.filter(a => a.score !== null && a.score !== undefined);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold mb-4">{results.test.name}</h1>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-2xl font-bold text-blue-600 capitalize">{results.status}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-green-600">
                {results.score !== null ? `${results.score}/${gradedQuestions.length}` : 'Pending'}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-gray-600">Submitted At</p>
              <p className="text-sm font-semibold text-purple-600">
                {new Date(results.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          {openQuestions.length > 0 && results.status === 'submitted' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-yellow-800">
                ⏳ Your test contains open-ended questions that are being reviewed by an admin. 
                Final score will be available soon.
              </p>
            </div>
          )}
        </div>
        
        {/* MCQ Results */}
        {mcqQuestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Multiple Choice Questions</h2>
            
            {mcqQuestions.map((answer, index) => {
              const question = answer.testQuestion.question;
              const selectedIds = JSON.parse(answer.selectedOptions || '[]');
              
              return (
                <div key={answer.id} className="border-b last:border-b-0 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">Q{index + 1}. {question.text}</h3>
                    {answer.isCorrect ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        ✓ Correct
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                        ✗ Incorrect
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2 ml-4">
                    {question.options.map((option) => {
                      const isSelected = selectedIds.includes(option.id);
                      const isCorrect = option.isCorrect;
                      
                      return (
                        <div 
                          key={option.id}
                          className={`p-2 rounded ${
                            isCorrect ? 'bg-green-50 border border-green-200' :
                            isSelected ? 'bg-red-50 border border-red-200' :
                            'bg-gray-50'
                          }`}
                        >
                          <span>
                            {isSelected && '→ '}
                            {option.text}
                            {isCorrect && ' ✓'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Open Questions */}
        {openQuestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Open-Ended Questions</h2>
            
            {openQuestions.map((answer, index) => {
              const question = answer.testQuestion.question;
              
              return (
                <div key={answer.id} className="border-b last:border-b-0 py-4">
                  <h3 className="font-semibold mb-2">
                    Q{mcqQuestions.length + index + 1}. {question.text}
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded mb-2">
                    <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                    <p className="whitespace-pre-wrap">{answer.answerText || 'No answer provided'}</p>
                  </div>
                  
                  {answer.score !== null && answer.score !== undefined ? (
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="text-sm text-gray-600">Score: <span className="font-bold">{answer.score}</span></p>
                      {answer.feedback && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Admin Feedback:</p>
                          <p className="text-sm">{answer.feedback}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-yellow-600">Awaiting review...</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}