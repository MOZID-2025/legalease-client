"use client";

import { useEffect, useState } from "react";
import {
  User,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Camera,
  Mail,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";

import { Input, Textarea, Card, Button } from "@heroui/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function UpdateProfile() {
  const { data: session, isPending } = useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load logged-in user information
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");

      setImage(
        session.user.image ||
          `https://i.pravatar.cc/300?u=${session.user.email}`,
      );

      setBio(session.user.bio || "");
    }
  }, [session]);

  // -----------------------------------------
  // Image Upload
  // -----------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSuccess("");
    setError("");

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);
  };

  // -----------------------------------------
  // Upload image to ImgBB
  // -----------------------------------------
  const uploadImageToImgBB = async () => {
    if (!selectedFile) {
      return image;
    }

    if (!IMGBB_API_KEY) {
      throw new Error("ImgBB API key is missing.");
    }

    const formData = new FormData();

    formData.append("image", selectedFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error("Failed to upload profile picture.");
    }

    return data.data.url;
  };

  // -----------------------------------------
  // Submit
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!session?.user?.email) {
      setError("You must be logged in to update your profile.");
      return;
    }

    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }

    try {
      setLoading(true);

      // Upload image if user selected a new one
      const imageUrl = await uploadImageToImgBB();

      // Update backend
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          name: name.trim(),
          image: imageUrl || "",
          bio: bio.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update your profile.");
      }

      setImage(imageUrl);
      setSelectedFile(null);

      setSuccess("Your profile has been updated successfully!");

      // Optional: remove message after 4 seconds
      setTimeout(() => {
        setSuccess("");
      }, 4000);
    } catch (err) {
      console.error(err);

      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Loading
  // -----------------------------------------
  if (isPending) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={35} className="animate-spin text-amber-400" />

          <p className="text-sm text-slate-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // Not logged in
  // -----------------------------------------
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <AlertCircle size={40} className="mx-auto mb-4 text-red-400" />

        <h2 className="text-xl font-bold text-white">
          Authentication Required
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Please login to update your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-300">
          <User size={16} />
          Profile Settings
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Update Profile
        </h1>

        <p className="mt-2 max-w-2xl text-slate-400">
          Manage your personal information, profile picture and biography.
        </p>
      </div>

      {/* =====================================
          MAIN CARD
      ====================================== */}
      <Card
        radius="lg"
        className="overflow-hidden border border-white/10 bg-slate-900/70 shadow-2xl shadow-black/20 backdrop-blur-xl"
      >
        {/* Card Header */}
        <div className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-6 md:px-8">
          <h2 className="text-xl font-bold text-white">Personal Information</h2>

          <p className="mt-1 text-sm text-slate-400">
            Keep your profile information accurate and up to date.
          </p>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* =====================================
                PROFILE IMAGE
            ====================================== */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* Image */}
                <div className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 p-1 shadow-2xl shadow-amber-500/10">
                  <img
                    src={image}
                    alt="Profile"
                    className="h-36 w-36 rounded-full border-4 border-slate-900 object-cover md:h-40 md:w-40"
                  />
                </div>

                {/* Camera button */}
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-1 right-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-4 border-slate-900 bg-amber-400 text-slate-900 shadow-lg transition hover:scale-110 hover:bg-yellow-300"
                >
                  <Camera size={19} />

                  <input
                    id="profile-image"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                Profile Picture
              </h3>

              <p className="mt-1 text-center text-xs text-slate-500">
                JPG, PNG or WEBP • Maximum 5MB
              </p>

              {/* Change photo */}
              <label
                htmlFor="profile-image"
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-amber-400/30 hover:bg-amber-400/10 hover:text-amber-300"
              >
                <Upload size={17} />
                Change Photo
              </label>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* =====================================
                FORM FIELDS
            ====================================== */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div>
                <Input
                  isRequired
                  type="text"
                  label="Full Name"
                  labelPlacement="outside"
                  placeholder="Enter your full name"
                  value={name}
                  onValueChange={setName}
                  startContent={<User size={18} className="text-slate-500" />}
                  classNames={{
                    label: "text-slate-300 font-medium",
                    input: "text-white placeholder:text-slate-600",
                    inputWrapper:
                      "bg-white/5 border border-white/10 shadow-none hover:border-amber-400/40 data-[focus=true]:border-amber-400",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <Input
                  type="email"
                  label="Email Address"
                  labelPlacement="outside"
                  value={session.user.email || ""}
                  isDisabled
                  startContent={<Mail size={18} className="text-slate-500" />}
                  classNames={{
                    label: "text-slate-300 font-medium",
                    input: "text-slate-500",
                    inputWrapper:
                      "bg-slate-800/50 border border-white/10 shadow-none",
                  }}
                />

                <p className="mt-2 text-xs text-slate-600">
                  Email cannot be changed here.
                </p>
              </div>
            </div>

            {/* =====================================
                AVATAR URL
            ====================================== */}
            <Input
              type="url"
              label="Avatar URL"
              labelPlacement="outside"
              placeholder="https://example.com/profile.jpg"
              value={selectedFile ? "" : image?.includes("blob:") ? "" : image}
              onValueChange={(value) => {
                setSelectedFile(null);
                setImage(value);
              }}
              startContent={<ImageIcon size={18} className="text-slate-500" />}
              description="You can use an image URL instead of uploading a photo."
              classNames={{
                label: "text-slate-300 font-medium",
                input: "text-white placeholder:text-slate-600",
                description: "text-slate-600",
                inputWrapper:
                  "bg-white/5 border border-white/10 shadow-none hover:border-amber-400/40 data-[focus=true]:border-amber-400",
              }}
            />

            {/* =====================================
                MESSAGES
            ====================================== */}
            {success && (
              <div className="flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">
                <CheckCircle size={20} className="shrink-0" />

                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                <AlertCircle size={20} className="shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* =====================================
                FOOTER
            ====================================== */}
            <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-600">
                Your profile information will be updated immediately.
              </p>

              <Button
                type="submit"
                isDisabled={loading}
                radius="lg"
                className="h-12 bg-gradient-to-r from-amber-400 to-yellow-500 px-7 font-bold text-slate-900 shadow-lg shadow-amber-500/10 transition hover:scale-[1.02] hover:shadow-amber-500/20"
                startContent={
                  loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )
                }
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
