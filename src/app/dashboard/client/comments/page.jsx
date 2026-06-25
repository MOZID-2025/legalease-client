"use client";

import { useEffect, useState } from "react";
import CommentTable from "@/components/dashboard/CommentTable";
import EditCommentModal from "@/components/dashboard/EditCommentModal";

export default function UserCommentsPage() {
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH COMMENTS
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/comments");

        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data = await res.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // DELETE COMMENT
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // OPEN EDIT MODAL
  const handleEdit = (comment) => {
    setSelectedComment(comment);
    setIsOpen(true);
  };

  // UPDATE COMMENT
  const handleUpdate = async (updatedComment) => {
    try {
      const res = await fetch(`/api/comments/${updatedComment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedComment),
      });

      if (!res.ok) {
        throw new Error("Update failed");
      }

      setComments((prev) =>
        prev.map((c) =>
          c._id === updatedComment._id ? { ...c, ...updatedComment } : c,
        ),
      );

      setIsOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    );
  }

  // ERROR UI
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Comments</h1>

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments found.</p>
      ) : (
        <CommentTable
          comments={comments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isOpen && selectedComment && (
        <EditCommentModal
          comment={selectedComment}
          onClose={() => setIsOpen(false)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
