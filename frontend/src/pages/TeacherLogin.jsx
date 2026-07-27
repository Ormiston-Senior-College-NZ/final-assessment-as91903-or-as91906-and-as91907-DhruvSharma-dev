import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/osc-logo.png";

const apiBaseUrl = "http://localhost:5000";

export default function TeacherLogin() {
  // Form state for the teacher login fields and messages.
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    // Send the teacher login details to Flask.
    event.preventDefault();
    // Clear old errors before trying a new login.
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // credentials: "include" lets Flask set/read the session cookie.
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      // A successful login sends the teacher into the protected panel.
      navigate("/teacher-panel");
    } catch (error) {
      // Show a friendly message instead of crashing the page.
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#404040] px-4 py-8">
      {/* Blurred background keeps the login modal visually connected to the panel. */}
      <div className="absolute inset-0 overflow-hidden opacity-45 blur-sm">
        <div className="mx-auto mt-4 max-w-7xl rounded-xl border border-[#F2901D] bg-white p-4">
          <div className="grid grid-cols-[16rem_1fr] gap-3">
            <aside className="min-h-150 rounded-lg border border-[#F2901D] bg-white p-4" />
            <section className="min-h-150 rounded-lg border border-[#F2901D] bg-white p-4" />
          </div>
        </div>
      </div>

      <section className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        {/* Login form displayed above the blurred panel background. */}
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-3xl rounded-xl border border-[#F2901D] bg-white px-12 py-10 shadow-2xl"
        >
          <Link
            to="/"
            aria-label="Close and return to home"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F2901D]"
          >
            {/* Simple close icon that returns users to the home dashboard. */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </Link>

          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-gray-800">
              <span className="h-5 w-5 rounded-full border-2 border-gray-800" />
            </div>

            <h1 className="text-2xl font-bold text-gray-950">
              Teacher Login
            </h1>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              aria-label="Email"
              required
              className="w-full rounded-md border border-[#F2901D] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2901D]"
            />

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              aria-label="Password"
              required
              className="w-full rounded-md border border-[#F2901D] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2901D]"
            />
          </div>

          {/* Only show the error box after a failed login. */}
          {errorMessage && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-[#F2901D] px-18 py-3 text-sm font-semibold text-white transition hover:bg-[#d87d11] focus:outline-none focus:ring-2 focus:ring-[#F2901D] focus:ring-offset-2"
            >
              {isSubmitting ? "Logging in..." : "Login ->"}
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            <img
              src={logo}
              alt="Ormiston Senior College"
              className="h-10 w-auto object-contain opacity-70"
            />
          </div>
        </form>
      </section>
    </main>
  );
}
