"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";

const ManageLegalProfile = () => {
  const { data: session, isPending } = useSession();
  const [services, setServices] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const user = session?.user;

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    fee: "",
    bio: "",
    image: "",
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/lawyers/my-profile/${user.email}`);

        const data = await res.json();

        if (data) {
          setServices([data]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, [user?.email]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      specialization: "",
      fee: "",
      bio: "",
      image: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      alert("User not logged in");
      return;
    }

    if (!API_URL) {
      alert("API URL is missing");
      return;
    }

    try {
      const serviceData = {
        ...form,
        fee: Number(form.fee),
        email: user.email,
        role: "lawyer",
        published: true,
      };

      let res;

      // EDIT
      if (editing) {
        res = await fetch(`${API_URL}/lawyers/${editing}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        });
      }

      // CREATE
      else {
        res = await fetch(`${API_URL}/lawyers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serviceData),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      if (editing) {
        // Update existing service in UI
        setServices((prev) =>
          prev.map((item) =>
            item._id === editing
              ? {
                  ...item,
                  ...serviceData,
                }
              : item,
          ),
        );

        alert("Profile updated successfully!");
      } else {
        // Add new service
        setServices((prev) => [
          ...prev,
          {
            ...serviceData,
            _id: data.insertedId,
          },
        ]);

        alert("Profile created successfully!");
      }

      resetForm();
      setEditing(null);
      setOpenModal(false);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEdit = (service) => {
    setEditing(service._id);

    setForm({
      name: service.name,
      specialization: service.specialization,
      fee: service.fee,
      bio: service.bio,
      image: service.image,
    });

    setOpenModal(true);
  };

  //handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this profile?")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/lawyers/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete profile");
      }

      setServices((prev) => prev.filter((item) => item._id !== id));

      alert("Profile deleted successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Manage Legal Services</h2>
          <p className="text-gray-500 mt-1">
            Add, edit or delete your legal services.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setEditing(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700  px-5 py-3 rounded-lg"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="table w-full">
          <thead className="bg-slate-100 text-black">
            <tr>
              <th>Image</th>
              <th>Service</th>
              <th>Specialization</th>
              <th>Fee</th>
              <th>Bio</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>
                  <img
                    src={service.image}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </td>

                <td className="font-semibold">{service.name}</td>

                <td>{service.specialization}</td>

                <td>${service.fee}</td>

                <td className="max-w-xs truncate">{service.bio}</td>

                <td>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(service)}
                      className="btn btn-sm btn-warning"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(service._id)}
                      className="btn btn-sm btn-error"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-8 relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-5 top-5 text-black"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-6 text-black">
              {editing ? "Edit Service" : "Add Service"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 text-black">
              <input
                name="name"
                placeholder="Service Name"
                className="input input-bordered w-full"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                name="specialization"
                placeholder="Specialization"
                className="input input-bordered w-full"
                value={form.specialization}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="fee"
                placeholder="Consultation Fee"
                className="input input-bordered w-full"
                value={form.fee}
                onChange={handleChange}
                required
              />

              <textarea
                name="bio"
                placeholder="Service Description"
                className="textarea textarea-bordered w-full h-32"
                value={form.bio}
                onChange={handleChange}
                required
              />

              <input
                name="image"
                placeholder="Paste imgBB Image URL"
                className="input input-bordered w-full"
                value={form.image}
                onChange={handleChange}
                required
              />

              {form.image && (
                <img
                  src={form.image}
                  className="w-40 h-28 object-cover rounded-lg bg-white text-black"
                  alt=""
                />
              )}

              <button className="btn btn-primary w-full bg-amber-400 text-black font-bold">
                {editing ? "Update Service" : "Add Service"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLegalProfile;
