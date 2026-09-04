"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  MessageSquare,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  UserRound,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const CommentsPage = () => {
  const { data: session, isPending: sessionLoading } = useSession();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch user's comments
  const fetchComments = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/comments/user/${encodeURIComponent(session.user.email)}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load your comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchComments();
    }
  }, [session?.user?.email]);

  // Open edit modal
  const handleEdit = (comment) => {
    setEditingComment(comment);
    setEditText(comment.comment);
  };

  // Update comment
  const handleUpdate = async () => {
    if (!editText.trim()) return;

    try {
      setUpdating(true);

      const res = await fetch(`${API_URL}/comments/${editingComment._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: editText.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update comment");
      }

      const updatedComment = await res.json();

      setComments((prev) =>
        prev.map((item) =>
          item._id === editingComment._id
            ? { ...item, ...updatedComment }
            : item,
        ),
      );

      setEditingComment(null);
      setEditText("");
    } catch (error) {
      console.error(error);
      alert("Failed to update comment.");
    } finally {
      setUpdating(false);
    }
  };

  // Delete comment
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/comments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments((prev) => prev.filter((comment) => comment._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete comment.");
    }
  };

  // Session loading
  if (sessionLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 px-6 py-10 shadow-2xl sm:px-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300">
            <MessageSquare size={17} />
            Comment Management
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            My Comments
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Manage your comments and reviews on lawyer profiles.
          </p>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-3xl border border-white/10 bg-slate-900/60"
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 px-6 py-16 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10">
            <MessageSquare className="text-indigo-400" size={30} />
          </div>

          <h2 className="text-xl font-bold text-white">No Comments Yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Your comments on lawyer profiles will appear here.
          </p>
        </div>
      ) : (
        /* Comments Grid */
        <div className="grid gap-6 md:grid-cols-2">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="group rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/30 p-6 shadow-xl transition hover:border-indigo-400/20"
            >
              {/* Lawyer Info */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/10">
                  <UserRound className="text-indigo-400" size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
                    Lawyer
                  </p>

                  <h2 className="truncate text-lg font-bold text-white">
                    {comment.lawyerName || "Lawyer"}
                  </h2>
                </div>
              </div>

              {/* Comment */}
              <div className="mt-5 rounded-2xl border border-white/5 bg-slate-950/40 p-4">
                <p className="text-sm leading-7 text-slate-300">
                  {comment.comment}
                </p>
              </div>

              {/* Date + Actions */}
              <div className="mt-5 flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays size={15} />

                  <span>
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "Date unavailable"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/20"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/20"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl sm:p-8">
            {/* Close */}
            <button
              onClick={() => {
                setEditingComment(null);
                setEditText("");
              }}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <p className="text-sm font-medium text-indigo-400">
                Edit Comment
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Update your comment
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Lawyer:{" "}
                <span className="text-slate-300">
                  {editingComment.lawyerName || "Lawyer"}
                </span>
              </p>
            </div>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={5}
              placeholder="Write your comment..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-500"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingComment(null);
                  setEditText("");
                }}
                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={updating || !editText.trim()}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
