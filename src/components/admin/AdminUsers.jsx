import React, { useEffect, useState } from "react";
import { getAllUsers, editUser, deleteUser } from "../../api/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ✅ OPEN EDIT MODAL
  const handleEdit = (user) => {
    setEditData({ ...user });
  };

  // ✅ SAVE EDIT
  const handleSave = async () => {
    try {
      const updated = await editUser(editData._id, {
        name: editData.name,
        email: editData.email,
        role: editData.role,
      });

      setUsers(users.map((u) => (u._id === updated._id ? updated : u)));
      setEditData(null);
      alert("User updated successfully");
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="pt-14 px-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">All Users</h2>
        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
          Total: {users.length}
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold uppercase">
                    {u.name?.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-800">{u.name}</span>
                </td>

                <td className="py-3 px-4 text-gray-600">{u.email}</td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === "admin"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="py-3 px-4 text-gray-600">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                <td className="py-3 px-4 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(u)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center py-6 text-gray-500">No users found.</p>
        )}
      </div>

      {/* ✅ EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[350px]">
            <h3 className="text-xl font-bold mb-4">Edit User</h3>

            <input
              className="border w-full p-2 mb-2 rounded"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              className="border w-full p-2 mb-2 rounded"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              placeholder="Email"
            />

            <select
              className="border w-full p-2 mb-4 rounded"
              value={editData.role}
              onChange={(e) =>
                setEditData({ ...editData, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditData(null)}
                className="px-4 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsers;
