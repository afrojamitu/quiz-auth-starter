'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestDetailsPage({ params }) {
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTest();
  }, []);

  const fetchTest = async () => {
    try {
      const res = await fetch(`/api/tests/${params.id}/details`);
      const data = await res.json();
      setTest(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching test:', error);
      setLoading(false);
    }
  };

  const handleStartTest = async () => {
    if (confirm('Once you start, the timer will begin. Are you ready?')) {
      try {
        await fetch(`/api/tests/${params.id}/start`, {
          method: 'POST'
        });
        router.push(`/test/${params.id}/take`);
      } catch (error) {
        console.error('Error starting test:', error);
      }
    }
  };

  if (loading) return <div className="p-8">Loading test details...</div>;
  if (!test) return <div className="p-8">Test not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">{test.name}</h1>
        
        <div className="space-y-4 mb-8">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700">Position</h2>
            <p className="text-gray-600">{test.quiz.position.name}</p>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700">Quiz</h2>
            <p className="text-gray-600">{test.quiz.title}</p>
            {test.quiz.description && (
              <p className="text-sm text-gray-500 mt-1">{test.quiz.description}</p>
            )}
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700">Duration</h2>
            <p className="text-gray-600">{test.duration} minutes</p>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700">Total Questions</h2>
            <p className="text-gray-600">{test.testQuestions.length} questions</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Instructions</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Once you start, the timer will begin immediately</li>
              <li>You can navigate between questions freely</li>
              <li>Your answers are auto-saved</li>
              <li>The test will auto-submit when time expires</li>
              <li>You cannot change answers after submission</li>
            </ul>
          </div>
        </div>
        
        <button
          onClick={handleStartTest}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-lg"
        >
          Start Test Now
        </button>
      </div>
    </div>
  );
}
