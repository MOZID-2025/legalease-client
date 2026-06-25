"use client";

const hiringData = [
  {
    id: 1,
    lawyerName: "Sarah Ahmed",
    specialization: "Corporate Law",
    fee: 5000,
    hiringDate: "2026-06-15",
    status: "pending",
  },
  {
    id: 2,
    lawyerName: "David Smith",
    specialization: "Criminal Law",
    fee: 8000,
    hiringDate: "2026-06-12",
    status: "accepted",
  },
  {
    id: 3,
    lawyerName: "Emma Wilson",
    specialization: "Family Law",
    fee: 4000,
    hiringDate: "2026-06-10",
    status: "rejected",
  },
];

export default function HiringHistory() {
  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-900/40 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Hiring History</h1>

        <p className="mt-2 text-slate-400">
          Track all your lawyer hiring requests.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full ">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="px-4 py-4 text-slate-300">Lawyer</th>
              <th className="px-4 py-4 text-slate-300">Specialisation</th>
              <th className="px-4 py-4 text-slate-300">Fee</th>
              <th className="px-4 py-4 text-slate-300">Hiring Date</th>
              <th className="px-4 py-4 text-slate-300">Status</th>
              <th className="px-4 py-4 text-slate-300">Action</th>
            </tr>
          </thead>

          <tbody>
            {hiringData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="px-4 py-4 text-white">{item.lawyerName}</td>

                <td className="px-4 py-4 text-slate-300">
                  {item.specialization}
                </td>

                <td className="px-4 py-4 text-slate-300">৳{item.fee}</td>

                <td className="px-4 py-4 text-slate-300">{item.hiringDate}</td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusStyle(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-4">
                  {item.status === "accepted" ? (
                    <button className="rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2 font-medium text-slate-900">
                      Pay Now
                    </button>
                  ) : item.status === "rejected" ? (
                    <button
                      disabled
                      className="cursor-not-allowed rounded-lg bg-red-500/20 px-4 py-2 text-red-400"
                    >
                      Rejected
                    </button>
                  ) : (
                    <button
                      disabled
                      className="cursor-not-allowed rounded-lg bg-yellow-500/20 px-4 py-2 text-yellow-400"
                    >
                      Waiting...
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
