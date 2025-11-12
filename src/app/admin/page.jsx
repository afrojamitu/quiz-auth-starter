'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    positions: 0,
    quizzes: 0,
    tests: 0,
    testTakers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch stats one by one to see which one fails
      const positionsRes = await fetch('/api/positions');
      if (!positionsRes.ok) throw new Error('Failed to fetch positions');
      const positions = await positionsRes.json();

      const quizzesRes = await fetch('/api/quizzes');
      if (!quizzesRes.ok) throw new Error('Failed to fetch quizzes');
      const quizzes = await quizzesRes.json();

      const testsRes = await fetch('/api/tests');
      if (!testsRes.ok) throw new Error('Failed to fetch tests');
      const tests = await testsRes.json();

      const testTakersRes = await fetch('/api/test-takers');
      if (!testTakersRes.ok) throw new Error('Failed to fetch test takers');
      const testTakers = await testTakersRes.json();

      setStats({
        positions: Array.isArray(positions) ? positions.length : 0,
        quizzes: Array.isArray(quizzes) ? quizzes.length : 0,
        tests: Array.isArray(tests) ? tests.length : 0,
        testTakers: Array.isArray(testTakers) ? testTakers.length : 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-600">Error loading dashboard: {error}</p>
        <p className="text-sm text-red-500 mt-2">Make sure your API routes are set up correctly.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Positions"
          value={stats.positions}
          color="blue"
          icon="briefcase"
          link="/admin/positions"
        />
        <StatCard
          title="Quizzes"
          value={stats.quizzes}
          color="green"
          icon="document"
          link="/admin/quizzes"
        />
        <StatCard
          title="Tests"
          value={stats.tests}
          color="purple"
          icon="clipboard"
          link="/admin/tests"
        />
        <StatCard
          title="Test Takers"
          value={stats.testTakers}
          color="orange"
          icon="users"
          link="/admin/test-takers"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/positions/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Position
          </Link>
          <Link
            href="/admin/quizzes/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Create Quiz
          </Link>
          <Link
            href="/admin/tests/new"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Create Test
          </Link>
          <Link
            href="/admin/test-takers/assign"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            Assign Test
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, link }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  const linkColorClasses = {
    blue: 'text-blue-600 hover:text-blue-500',
    green: 'text-green-600 hover:text-green-500',
    purple: 'text-purple-600 hover:text-purple-500',
    orange: 'text-orange-600 hover:text-orange-500'
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`rounded-md ${colorClasses[color]} p-3`}>
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-3xl font-semibold text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <Link href={link} className={`text-sm font-medium ${linkColorClasses[color]}`}>
          View all
        </Link>
      </div>
    </div>
  );
}