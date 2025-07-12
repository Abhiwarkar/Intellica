import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Team Members</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="border p-4 rounded">
                <h3 className="font-medium">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;