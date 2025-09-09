import React from "react";
import { useUsers } from "../hooks/useUsers";

const UserList: React.FC = () => {
  const { users, loading, error } = useUsers();

  if (loading) return <div className="text-center text-lg mt-8">Loading users...</div>;
  if (error) return <div className="text-center text-lg text-red-500 mt-8">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>
      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-5 py-5 text-sm text-gray-900">{user.name}</td>
                  <td className="px-5 py-5 text-sm text-gray-900">{user.email}</td>
                  <td className="px-5 py-5 text-sm text-gray-900">{user.phoneNumber || "N/A"}</td>
                  <td className="px-5 py-5 text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
