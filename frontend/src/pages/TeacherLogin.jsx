import { useNavigate } from "react-router-dom";
import logo from "../assets/osc-logo.png";

export default function TeacherLogin() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/teacher-panel");
  }

  return (
    <main className="min-h-screen bg-[#404040] px-4 py-8">
      <div className="absolute inset-0 overflow-hidden opacity-45 blur-sm">
        <div className="mx-auto mt-4 max-w-7xl rounded-xl border border-[#F2901D] bg-white p-4">
          <div className="grid grid-cols-[16rem_1fr] gap-3">
            <aside className="min-h-150 rounded-lg border border-[#F2901D] bg-white p-4" />
            <section className="min-h-150 rounded-lg border border-[#F2901D] bg-white p-4" />
          </div>
        </div>
      </div>

      <section className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl rounded-xl border border-[#F2901D] bg-white px-12 py-10 shadow-2xl"
        >
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
              placeholder="Email"
              aria-label="Email"
              className="w-full rounded-md border border-[#F2901D] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2901D]"
            />

            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              className="w-full rounded-md border border-[#F2901D] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F2901D]"
            />
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="rounded-md bg-[#F2901D] px-18 py-3 text-sm font-semibold text-white transition hover:bg-[#d87d11] focus:outline-none focus:ring-2 focus:ring-[#F2901D] focus:ring-offset-2"
            >
              Login -&gt;
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
