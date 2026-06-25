export default function CommentTable({ comments, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Lawyer</th>
            <th className="p-2">Comment</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {comments?.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.lawyerName}</td>

              <td className="p-2">{c.text}</td>

              <td className="p-2">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>

              <td className="p-2 flex gap-2">
                <button
                  onClick={() => onEdit(c)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(c._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
