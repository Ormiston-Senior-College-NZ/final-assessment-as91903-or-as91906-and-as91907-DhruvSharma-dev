// Authentication form for the protected Teacher Panel. Credentials are sent only
// to Flask, which checks the salted database hash and returns a signed session
// cookie. React stores neither the submitted password nor teacher account records.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/osc-logo.png";

const apiBaseUrl = "http://localhost:5000";

export default function TeacherLogin() {
  // useNavigate lets the page send a teacher to the panel after logging in.
  const navigate = useNavigate();

  // These states keep track of what has been typed into the form.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // The error starts empty and is only filled in when login does not work.
  const [errorMessage, setErrorMessage] = useState("");

  // This stops the button being clicked many times while Flask is responding.
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    // Stop the form from refreshing the whole page when it is submitted.
    event.preventDefault();

    // Clear the previous error and change the button to "Logging in...".
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Send the form as JSON. credentials includes the login session cookie.
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Flask returns a non-success status when the details are incorrect.
        throw new Error("Invalid email or password.");
      }

      // A successful login sends the teacher into the protected panel.
      navigate("/teacher-panel");
    } catch (error) {
      // Show a friendly message instead of crashing the page.
      setErrorMessage(error.message);
    } finally {
      // finally runs after success or failure, so the button always resets.
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#404040] px-3 py-6 sm:px-4 sm:py-8">
      {/* Blurred background keeps the login modal visually connected to the panel. */}
      <div className="absolute inset-0 overflow-hidden opacity-45 blur-sm">
        <div className="mx-auto mt-4 max-w-7xl rounded-xl border border-[#F2901D] bg-white p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[16rem_1fr]">
            <aside className="min-h-150 rounded-lg border border-[#F2901D] bg-white p-4" />
            <section className="min-h-150 rounded-lg border border-[#F2901D] bg-white p-4" />
          </div>
        </div>
      </div>

      <section className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        {/* Login form displayed above the blurred panel background. */}
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-3xl rounded-xl border border-[#F2901D] bg-white px-5 py-8 shadow-2xl sm:px-12 sm:py-10"
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
            {/* Both inputs are controlled by React and must be completed. */}
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
            {/* Disable the button while waiting to prevent duplicate requests. */}
            <button
              type="submit"
              disabled={isSubmitting}
            className="w-full rounded-md bg-[#F2901D] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#d87d11] focus:outline-none focus:ring-2 focus:ring-[#F2901D] focus:ring-offset-2 sm:w-auto sm:px-18"
            >
              {/* Give the teacher feedback while the request is running. */}
              {isSubmitting ? "Logging in..." : "Login ->"}
            </button>
          </div>

          <div className="mt-8 flex justify-center">
            {/* The school logo makes it clear this is the OSC login page. */}
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
