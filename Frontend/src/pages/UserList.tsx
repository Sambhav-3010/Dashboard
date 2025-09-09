import React from "react";
import { useUsers } from "../hooks/useUsers";
import { motion } from "framer-motion"; // Import motion

const UserList: React.FC = () => {
  const { users, loading, error } = useUsers();

  if (loading) return <div className="text-center text-lg mt-8">Loading users...</div>;
  if (error) return <div className="text-center text-lg text-red-500 mt-8">Error: {error}</div>;

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      {users.length === 0 ? (
        <p className="text-center text-gray-600 py-8">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone Number</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="px-4 py-4 text-sm text-gray-700">{user.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{user.phoneNumber || "N/A"}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UserList;
