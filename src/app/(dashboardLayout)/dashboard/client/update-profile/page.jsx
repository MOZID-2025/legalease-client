"use client";

import { useState } from "react";
import { User, Upload } from "lucide-react";

export default function UpdateProfile() {
  const [name, setName] = useState("John Doe");
  const [image, setImage] = useState("https://i.pravatar.cc/300?img=12");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");

    setTimeout(() => {
      setLoading(false);
      setSuccess("Profile updated successfully!");
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Update Profile</h1>

          <p className="mt-2 text-slate-400">
            Update your personal information.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={image}
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-amber-400 object-cover"
            />

            <label className="cursor-pointer rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-white hover:bg-slate-700">
              <div className="flex items-center gap-2">
                <Upload size={18} />
                Upload Photo
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Full Name
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Success */}
          {success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-green-400">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 font-semibold text-slate-900 transition hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
