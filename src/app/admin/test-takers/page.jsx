'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TestsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchTests();
    }
  }, [session]);

  const fetchTests = async () => {
    try {
      const res = await fetch('/api/test-takers/my-tests');
      const data = await res.json();
      setTests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading your tests...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Assigned Tests</h1>
        
        {tests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No tests assigned yet.
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((testTaker) => (
              <div key={testTaker.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{testTaker.test.name}</h2>
                    <p className="text-gray-600">
                      Position: {testTaker.test.quiz.position.name}
                    </p>
                    <p className="text-gray-600">
                      Duration: {testTaker.test.duration} minutes
                    </p>
                    <p className="text-sm text-gray-500">
                      Test Date: {new Date(testTaker.test.testDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    {testTaker.status === 'pending' && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Not Started
                      </span>
                    )}
                    {testTaker.status === 'in_progress' && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        In Progress
                      </span>
                    )}
                    {testTaker.status === 'submitted' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Submitted
                      </span>
                    )}
                    {testTaker.status === 'graded' && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        Graded
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  {testTaker.status === 'pending' && (
                    <button
                      onClick={() => router.push(`/test/${testTaker.test.id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Start Test
                    </button>
                  )}
                  {testTaker.status === 'in_progress' && (
                    <button
                      onClick={() => router.push(`/test/${testTaker.test.id}/take`)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Continue Test
                    </button>
                  )}
                  {(testTaker.status === 'submitted' || testTaker.status === 'graded') && (
                    <button
                      onClick={() => router.push(`/test/${testTaker.test.id}/results`)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      View Results
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}