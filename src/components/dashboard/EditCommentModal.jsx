"use client";

import { useState, useEffect } from "react";

export default function EditCommentModal({ comment, onClose, onSave }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (comment) setText(comment.text);
  }, [comment]);

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...comment,
      text,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-xl font-bold mb-3">Edit Comment</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
