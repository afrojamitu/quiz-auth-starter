'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PositionDetailPage({ params }) {
  const router = useRouter();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchPosition();
  }, []);

  const fetchPosition = async () => {
    try {
      const res = await fetch(`/api/positions/${params.id}`);
      const data = await res.json();
      setPosition(data);
      setFormData({
        name: data.name,
        description: data.description || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching position:', error);
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/positions/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setEditing(false);
        fetchPosition();
      }
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading position...</div>;
  }

  if (!position) {
    return <div className="text-center py-8">Position not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Positions
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{position.name}</h1>
            {position.description && (
              <p className="mt-2 text-gray-600">{position.description}</p>
            )}
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleUpdate} className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Position Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : null}

    </div>
  )
}