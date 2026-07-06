import { Link } from "react-router-dom";
import logo from "../assets/osc-logo.png";

const menuSections = [
  {
    heading: "Home Page",
    items: ["What on this week?", "Map of School", "Announcement"],
  },
  {
    heading: "Curriculum Page",
    items: ["NCEA Level 1 Subjects", "NCEA Level 2 Subjects", "NCEA Level 3 Subjects", "Scholarships"],
  },
  {
    heading: "Web-Based Apps",
    items: ["App Links"],
  },
  {
    heading: "Student Info",
    items: ["Bottom Links"],
  },
  {
    heading: "Other",
    items: ["Quick Links", "Logo/Colours"],
  },
];

const colourFields = ["Primary gold", "Orange accent", "Card border", "Page background"];

export default function TeacherPanel() {
  return (
    <main className="min-h-screen bg-[#404040] p-5">
      <section className="grid min-h-[calc(100vh-2.5rem)] grid-cols-1 gap-3 rounded-xl border border-[#F2901D] bg-white p-3 lg:grid-cols-[16rem_1fr]">
        <aside className="rounded-lg border border-[#F2901D] bg-white p-3">
          <h1 className="mb-2 text-2xl font-bold text-gray-950">
            Menu:
          </h1>

          <div className="space-y-3">
            {menuSections.map((section) => (
              <div key={section.heading}>
                <h2 className="mb-1 text-sm font-medium text-gray-950">
                  {section.heading}:
                </h2>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`w-full rounded-md border border-[#F2901D] px-3 py-2 text-xs transition hover:bg-[#fff5e9] ${
                        item === "Logo/Colours"
                          ? "bg-[#F2901D] text-white hover:bg-[#d87d11]"
                          : "bg-white text-gray-950"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-lg border border-[#F2901D] bg-white p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-gray-950">
              Edit:
            </h2>

            <Link
              to="/"
              className="rounded-full border border-[#F2901D] px-8 py-2 text-sm font-semibold text-gray-950 transition hover:bg-[#fff5e9]"
            >
              Teacher's Panel
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[26rem_1fr]">
            <div className="space-y-3">
              <article className="rounded-lg border border-[#F2901D] bg-white p-6">
                <h3 className="mb-8 text-center text-3xl font-medium text-gray-950">
                  Current Logo
                </h3>

                <img
                  src={logo}
                  alt="Current Ormiston Senior College logo"
                  className="mx-auto h-36 w-auto object-contain"
                />
              </article>

              <article className="rounded-lg border border-[#F2901D] bg-white p-6">
                <h3 className="mb-4 text-center text-3xl font-medium text-gray-950">
                  Colour Palette
                </h3>

                <div className="space-y-3">
                  {colourFields.map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field}
                      className="w-full rounded-md border border-[#F2901D] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F2901D]"
                    />
                  ))}
                </div>
              </article>
            </div>

            <div className="flex min-h-120 flex-col justify-between">
              <div>
                <button
                  type="button"
                  className="rounded-md border border-[#F2901D] bg-white px-12 py-4 text-sm font-medium transition hover:bg-[#fff5e9]"
                >
                  Upload ^
                </button>

                <div className="mt-4 text-sm text-gray-950">
                  <p>Supported File Type</p>
                  <ul className="ml-5 list-disc">
                    <li>PNG</li>
                    <li>JPG</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/"
                  className="rounded-full border border-[#F2901D] px-8 py-3 text-xl font-semibold text-gray-950 transition hover:bg-[#fff5e9]"
                >
                  Exit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
