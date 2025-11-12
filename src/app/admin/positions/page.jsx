'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PositionsPage() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const res = await fetch('/api/positions');
      const data = await res.json();
      setPositions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching positions:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this position? This will also delete all associated quizzes.')) {
      try {
        await fetch(`/api/positions/${id}`, {
          method: 'DELETE'
        });
        fetchPositions();
      } catch (error) {
        console.error('Error deleting position:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading positions...</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Positions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage job positions for interviews
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/positions/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Position
          </Link>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No positions created yet.</p>
          <Link
            href="/admin/positions/new"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Your First Position
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {positions.map((position) => (
              <li key={position.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {position.name}
                      </h3>
                      {position.description && (
                        <p className="mt-1 text-sm text-gray-500">{position.description}</p>
                      )}
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>
                          {position.quizzes?.length || 0} quiz{position.quizzes?.length !== 1 ? 'zes' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/admin/positions/${position.id}`)}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(position.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}