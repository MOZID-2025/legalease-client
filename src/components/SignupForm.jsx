"use client";

import Link from "next/link";
import {
  Scale,
  Mail,
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function SignupForm() {
  const router = useRouter();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("client");

  // Image
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Terms
  const [agree, setAgree] = useState(false);

  // =========================================
  // IMAGE SELECT
  // =========================================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    // Image type validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    // 5MB validation
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setImage(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // =========================================
  // UPLOAD IMAGE TO IMGBB
  // =========================================
  const uploadImage = async () => {
    // No image selected
    if (!image) {
      return "";
    }

    if (!IMGBB_API_KEY) {
      throw new Error("ImgBB API key is missing.");
    }

    const formData = new FormData();

    formData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error("Failed to upload profile image.");
    }

    return data.data.url;
  };

  // =========================================
  // SIGNUP
  // =========================================
  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validation
    if (!agree) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);

      // -------------------------------------
      // 1. Upload image to ImgBB
      // -------------------------------------
      const imageUrl = await uploadImage();

      console.log("Uploaded image URL:", imageUrl);

      // -------------------------------------
      // 2. Create Better Auth account
      // -------------------------------------
      const { data, error: authError } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,

        // IMPORTANT
        image: imageUrl,

        callbackURL: "/signin",
      });

      if (authError) {
        setError(authError.message || "Signup failed.");
        return;
      }

      console.log("Signup response:", data);

      // -------------------------------------
      // 3. Success
      // -------------------------------------
      setSuccess("Account created successfully! Redirecting...");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("client");
      setImage(null);
      setImagePreview("");
      setAgree(false);

      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (err) {
      console.error("Signup error:", err);

      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 px-6 py-12">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Scale className="mx-auto mb-3 text-amber-400" size={50} />

          <h1 className="text-4xl font-extrabold text-white">
            Legal<span className="text-amber-400">Ease</span>
          </h1>

          <p className="mt-2 text-slate-400">
            Create your account and connect with legal professionals.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            Create Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-start gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                <CheckCircle size={18} className="mt-0.5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Full Name
              </label>

              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Profile Image */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Profile Image
              </label>

              <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-5">
                <div className="flex flex-col items-center gap-4">
                  {/* Preview */}
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-28 w-28 rounded-full border-4 border-amber-400 object-cover shadow-lg"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-500">
                      <User size={40} />
                    </div>
                  )}

                  {/* Upload */}
                  <label
                    htmlFor="profile-image"
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                  >
                    <Upload size={17} />

                    {image ? "Change Photo" : "Upload Photo"}

                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <p className="text-xs text-slate-500">
                    JPG, PNG or WEBP • Maximum 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Register As
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="client" className="bg-slate-900">
                  Client
                </option>

                <option value="lawyer" className="bg-slate-900">
                  Lawyer
                </option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-12 text-white outline-none focus:border-amber-400"
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Confirm Password
              </label>

              <div className="relative">
                <Shield
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-12 text-white outline-none focus:border-amber-400"
                  placeholder="••••••••"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 accent-amber-400"
              />

              <span>
                I agree to the <span className="text-amber-400">Terms</span> and{" "}
                <span className="text-amber-400">Privacy Policy</span>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 font-bold text-slate-900 shadow-lg shadow-amber-500/10 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login */}
            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-amber-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
