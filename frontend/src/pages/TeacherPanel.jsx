import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createId,
  curriculumLevels,
  getStoredSubjects,
  getStoredWeekItems,
  saveStoredSubjects,
  saveStoredWeekItems,
} from "../data/studentNetData";

const apiBaseUrl = "http://localhost:5000";

const menuSections = [
  {
    heading: "Home Page",
    items: [
      { id: "week", label: "What's on this week?" },
      { id: "map", label: "Map of School" },
      { id: "announcements", label: "Announcement" },
    ],
  },
  {
    heading: "Curriculum Page",
    items: [
      { id: "level1", label: "NCEA Level 1 Subjects" },
      { id: "level2", label: "NCEA Level 2 Subjects" },
      { id: "level3", label: "NCEA Level 3 Subjects" },
      { id: "scholarships", label: "Scholarships" },
    ],
  },
  {
    heading: "Web-Based Apps",
    items: [{ id: "apps", label: "App Links" }],
  },
  {
    heading: "Student Info",
    items: [{ id: "student-info", label: "Bottom Links" }],
  },
  {
    heading: "Other",
    items: [{ id: "quick-links", label: "Quick Links" }],
  },
];

const blankSubjectForm = {
  name: "",
  description: "",
  pathway: "",
};

const blankWeekForm = {
  day: "",
  title: "",
  time: "",
  location: "",
};

function EditorInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-950">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#F2901D] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F2901D]"
      />
    </label>
  );
}

function EditorTextarea({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-gray-950">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows="5"
        className="w-full resize-none rounded-md border border-[#F2901D] px-3 py-2 outline-none focus:ring-2 focus:ring-[#F2901D]"
      />
    </label>
  );
}

function PlaceholderPanel({ title }) {
  return (
    <div className="rounded-lg border border-[#F2901D] bg-white p-6">
      <h2 className="text-2xl font-bold text-gray-950">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl leading-7 text-gray-600">
        This editor is ready to be built later. For now, the working admin tools are curriculum subjects and What's on this week.
      </p>
    </div>
  );
}

export default function TeacherPanel() {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeEditor, setActiveEditor] = useState("level2");
  const [subjects, setSubjects] = useState(() => getStoredSubjects());
  const [weekItems, setWeekItems] = useState(() => getStoredWeekItems());
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjectForm, setSubjectForm] = useState(blankSubjectForm);
  const [selectedWeekItemId, setSelectedWeekItemId] = useState("");
  const [weekForm, setWeekForm] = useState(blankWeekForm);

  const activeLevel = curriculumLevels.find((level) => level.id === activeEditor);
  const isSubjectEditor = Boolean(activeLevel);
  const activeSubjects = isSubjectEditor ? subjects[activeEditor] || [] : [];

  const pageTitle = useMemo(() => {
    if (activeEditor === "week") {
      return "What's on this week?";
    }

    if (activeLevel) {
      return `${activeLevel.label} Subjects`;
    }

    const allMenuItems = menuSections.flatMap((section) => section.items);
    return allMenuItems.find((item) => item.id === activeEditor)?.label || "Editor";
  }, [activeEditor, activeLevel]);

  useEffect(() => {
    let isMounted = true;

    async function checkTeacherSession() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Not logged in");
        }
      } catch {
        navigate("/teacher-login");
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    }

    checkTeacherSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  async function handleLogout() {
    await fetch(`${apiBaseUrl}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/teacher-login");
  }

  function updateSubjectForm(field, value) {
    setSubjectForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function updateWeekForm(field, value) {
    setWeekForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function selectSubject(subject) {
    setSelectedSubjectId(subject.id);
    setSubjectForm({
      name: subject.name,
      description: subject.description,
      pathway: subject.pathway,
    });
  }

  function saveSubject(event) {
    event.preventDefault();

    if (!subjectForm.name.trim()) {
      return;
    }

    const savedSubject = {
      id: selectedSubjectId || createId(activeEditor),
      name: subjectForm.name.trim(),
      description: subjectForm.description.trim(),
      pathway: subjectForm.pathway.trim(),
    };

    const updatedSubjects = {
      ...subjects,
      [activeEditor]: selectedSubjectId
        ? activeSubjects.map((subject) =>
            subject.id === selectedSubjectId ? savedSubject : subject,
          )
        : [...activeSubjects, savedSubject],
    };

    setSubjects(updatedSubjects);
    saveStoredSubjects(updatedSubjects);
    setSelectedSubjectId(savedSubject.id);
  }

  function clearSubjectForm() {
    setSelectedSubjectId("");
    setSubjectForm(blankSubjectForm);
  }

  function deleteSubject(subjectId) {
    const updatedSubjects = {
      ...subjects,
      [activeEditor]: activeSubjects.filter((subject) => subject.id !== subjectId),
    };

    setSubjects(updatedSubjects);
    saveStoredSubjects(updatedSubjects);
    clearSubjectForm();
  }

  function selectWeekItem(item) {
    setSelectedWeekItemId(item.id);
    setWeekForm({
      day: item.day,
      title: item.title,
      time: item.time,
      location: item.location,
    });
  }

  function saveWeekItem(event) {
    event.preventDefault();

    if (!weekForm.title.trim()) {
      return;
    }

    const savedItem = {
      id: selectedWeekItemId || createId("week"),
      day: weekForm.day.trim(),
      title: weekForm.title.trim(),
      time: weekForm.time.trim(),
      location: weekForm.location.trim(),
    };

    const updatedWeekItems = selectedWeekItemId
      ? weekItems.map((item) => (item.id === selectedWeekItemId ? savedItem : item))
      : [...weekItems, savedItem];

    setWeekItems(updatedWeekItems);
    saveStoredWeekItems(updatedWeekItems);
    setSelectedWeekItemId(savedItem.id);
  }

  function clearWeekForm() {
    setSelectedWeekItemId("");
    setWeekForm(blankWeekForm);
  }

  function deleteWeekItem(itemId) {
    const updatedWeekItems = weekItems.filter((item) => item.id !== itemId);

    setWeekItems(updatedWeekItems);
    saveStoredWeekItems(updatedWeekItems);
    clearWeekForm();
  }

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#404040] text-white">
        Checking teacher access...
      </main>
    );
  }

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
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveEditor(item.id);
                        clearSubjectForm();
                        clearWeekForm();
                      }}
                      className={`w-full rounded-md border border-[#F2901D] px-3 py-2 text-xs transition hover:bg-[#fff5e9] ${
                        activeEditor === item.id
                          ? "bg-[#F2901D] text-white hover:bg-[#d87d11]"
                          : "bg-white text-gray-950"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-lg border border-[#F2901D] bg-white p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-950">
                Edit:
              </h2>
              <p className="text-sm font-medium text-[#F2901D]">
                {pageTitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[#F2901D] px-8 py-2 text-sm font-semibold text-gray-950 transition hover:bg-[#fff5e9]"
            >
              Logout
            </button>
          </div>

          {isSubjectEditor && (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[22rem_1fr]">
              <aside className="rounded-lg border border-[#F2901D] bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-950">
                    Subjects
                  </h3>

                  <button
                    type="button"
                    onClick={clearSubjectForm}
                    className="rounded-md bg-[#F2901D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d87d11]"
                  >
                    Add New
                  </button>
                </div>

                <div className="space-y-2">
                  {activeSubjects.map((subject) => (
                    <button
                      key={subject.id}
                      type="button"
                      onClick={() => selectSubject(subject)}
                      className={`w-full rounded-md border border-[#F2901D] px-3 py-3 text-left text-sm font-semibold transition ${
                        selectedSubjectId === subject.id
                          ? "bg-[#F2901D] text-white"
                          : "bg-white text-gray-950 hover:bg-[#fff5e9]"
                      }`}
                    >
                      {subject.name}
                    </button>
                  ))}
                </div>
              </aside>

              <form
                onSubmit={saveSubject}
                className="rounded-lg border border-[#F2901D] bg-white p-4"
              >
                <h3 className="mb-4 text-lg font-bold text-gray-950">
                  {selectedSubjectId ? "Edit Subject" : "Add Subject"}
                </h3>

                <div className="space-y-4">
                  <EditorInput
                    label="Subject Name"
                    value={subjectForm.name}
                    onChange={(value) => updateSubjectForm("name", value)}
                    placeholder="Example: Digital Technologies"
                  />

                  <EditorTextarea
                    label="Description"
                    value={subjectForm.description}
                    onChange={(value) => updateSubjectForm("description", value)}
                    placeholder="What students learn in this subject..."
                  />

                  <EditorTextarea
                    label="Pathway"
                    value={subjectForm.pathway}
                    onChange={(value) => updateSubjectForm("pathway", value)}
                    placeholder="Where this subject can lead..."
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-md bg-[#F2901D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d87d11]"
                  >
                    Save Subject
                  </button>

                  <button
                    type="button"
                    onClick={clearSubjectForm}
                    className="rounded-md border border-[#F2901D] px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-[#fff5e9]"
                  >
                    Clear
                  </button>

                  {selectedSubjectId && (
                    <button
                      type="button"
                      onClick={() => deleteSubject(selectedSubjectId)}
                      className="rounded-md border border-red-500 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {activeEditor === "week" && (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[22rem_1fr]">
              <aside className="rounded-lg border border-[#F2901D] bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-950">
                    Week Items
                  </h3>

                  <button
                    type="button"
                    onClick={clearWeekForm}
                    className="rounded-md bg-[#F2901D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d87d11]"
                  >
                    Add New
                  </button>
                </div>

                <div className="space-y-2">
                  {weekItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectWeekItem(item)}
                      className={`w-full rounded-md border border-[#F2901D] px-3 py-3 text-left text-sm font-semibold transition ${
                        selectedWeekItemId === item.id
                          ? "bg-[#F2901D] text-white"
                          : "bg-white text-gray-950 hover:bg-[#fff5e9]"
                      }`}
                    >
                      <span className="block">{item.title}</span>
                      <span className="text-xs font-medium opacity-80">
                        {item.day} {item.time}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              <form
                onSubmit={saveWeekItem}
                className="rounded-lg border border-[#F2901D] bg-white p-4"
              >
                <h3 className="mb-4 text-lg font-bold text-gray-950">
                  {selectedWeekItemId ? "Edit Week Item" : "Add Week Item"}
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <EditorInput
                    label="Day"
                    value={weekForm.day}
                    onChange={(value) => updateWeekForm("day", value)}
                    placeholder="Example: Monday"
                  />

                  <EditorInput
                    label="Time"
                    value={weekForm.time}
                    onChange={(value) => updateWeekForm("time", value)}
                    placeholder="Example: 9:00 AM"
                  />

                  <EditorInput
                    label="Title"
                    value={weekForm.title}
                    onChange={(value) => updateWeekForm("title", value)}
                    placeholder="Example: Whanau assembly"
                  />

                  <EditorInput
                    label="Location"
                    value={weekForm.location}
                    onChange={(value) => updateWeekForm("location", value)}
                    placeholder="Example: Theatre"
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="rounded-md bg-[#F2901D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d87d11]"
                  >
                    Save Week Item
                  </button>

                  <button
                    type="button"
                    onClick={clearWeekForm}
                    className="rounded-md border border-[#F2901D] px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-[#fff5e9]"
                  >
                    Clear
                  </button>

                  {selectedWeekItemId && (
                    <button
                      type="button"
                      onClick={() => deleteWeekItem(selectedWeekItemId)}
                      className="rounded-md border border-red-500 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {!isSubjectEditor && activeEditor !== "week" && (
            <PlaceholderPanel title={pageTitle} />
          )}
        </section>
      </section>
    </main>
  );
}
