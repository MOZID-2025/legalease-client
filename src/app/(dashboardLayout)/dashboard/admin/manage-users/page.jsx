"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserRound,
  Trash2,
  Edit3,
  Loader2,
  X,
  Check,
} from "lucide-react";

const ManageUsers = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // =========================
  // Get Client Users
  // =========================
  const fetchClients = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/users/clients");

      if (!res.ok) {
        throw new Error("Failed to fetch clients");
      }

      const data = await res.json();

      setClients(data);
    } catch (error) {
      console.error("Fetch clients error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // =========================
  // Open Role Modal
  // =========================
  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
  };

  // =========================
  // Change Role
  // =========================
  const handleChangeRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      setUpdating(true);

      const res = await fetch(
        `http://localhost:8080/users/${selectedUser._id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: newRole,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change role");
      }

      if (newRole !== "client") {
        setClients((prev) =>
          prev.filter((user) => user._id !== selectedUser._id),
        );
      } else {
        setClients((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id ? { ...user, role: newRole } : user,
          ),
        );
      }

      setSelectedUser(null);
      setNewRole("");
    } catch (error) {
      console.error("Role change error:", error);
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // Delete User
  // =========================
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const res = await fetch(`http://localhost:8080/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete client");
      }

      setClients((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Delete user error:", error);
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={40} className="animate-spin text-indigo-600" />

          <p className="text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* ================= Header ================= */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
            <Users size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold md:text-3xl">Manage Users</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage all registered clients.
            </p>
          </div>
        </div>

        {/* Total Clients */}
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-3 shadow-sm">
          <p className="text-xs text-gray-500">Total Clients</p>

          <p className="text-2xl font-bold text-indigo-600">{clients.length}</p>
        </div>
      </div>

      {/* ================= Table ================= */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  #
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No clients found.
                  </td>
                </tr>
              ) : (
                clients.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    {/* Number */}
                    <td className="px-6 py-5 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.name || "Unknown User"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {user.email}
                    </td>

                    {/* Role */}
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <UserRound size={14} />
                        Client
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        {/* Change Role */}
                        <button
                          onClick={() => handleOpenRoleModal(user)}
                          className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
                        >
                          <Edit3 size={16} />

                          <span className="hidden sm:inline">Change Role</span>
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={deletingId === user._id}
                          className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId === user._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}

                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= Change Role Modal ================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Change User Role
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update role for {selectedUser.name}
                </p>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* User */}
            <div className="mb-5 rounded-xl bg-gray-50 p-4">
              <p className="font-semibold text-gray-900">{selectedUser.name}</p>

              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>

            {/* Role */}
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Select Role
            </label>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="mb-6 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="client">Client</option>

              <option value="lawyer">Lawyer</option>

              <option value="admin">Admin</option>
            </select>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleChangeRole}
                disabled={updating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {updating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Update Role
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
