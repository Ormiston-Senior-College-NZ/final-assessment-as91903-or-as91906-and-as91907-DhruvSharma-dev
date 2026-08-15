// Teacher Panel for editing StudentNET content.
//
// The panel uses similar forms for several types of content. Announcements and
// curriculum have their own database routes, while smaller sections are saved as
// JSON. The selected curriculum menu decides which level a subject belongs to.
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createDatabaseAnnouncement,
  createDatabaseSubject,
  createId,
  curriculumLevels,
  deleteDatabaseAnnouncement,
  deleteDatabaseSubject,
  getStoredCareersSupport,
  getStoredAnnouncements,
  getStoredNorms,
  getStoredQuickLinks,
  getStoredSubjects,
  getStoredStudentInfoLinks,
  getStoredWebAppLinks,
  getStoredWeekItems,
  loadStoredAnnouncements,
  loadStoredCareersSupport,
  loadStoredNorms,
  loadStoredQuickLinks,
  loadStoredStudentInfoLinks,
  loadStoredSubjects,
  loadStoredWebAppLinks,
  loadStoredWeekItems,
  saveStoredCareersSupport,
  saveStoredNorms,
  saveStoredQuickLinks,
  saveStoredStudentInfoLinks,
  saveStoredWebAppLinks,
  saveStoredWeekItems,
  updateDatabaseAnnouncement,
  updateDatabaseSubject,
} from "../data/studentNetData";

const apiBaseUrl = "http://localhost:5000";

// -----------------------------------------------------------------------------
// Editor configuration and reusable blank form shapes
// -----------------------------------------------------------------------------

// Sidebar menu options choose which part of the website a teacher edits.
const menuSections = [
  {
    heading: "Home Page",
    items: [
      { id: "week", label: "What's on this week?" },
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
    heading: "Web-Based Apps Page",
    items: [{ id: "apps", label: "App Links" }],
  },
  {
    heading: "Careers Page",
    items: [{ id: "careers-support", label: "Careers Support" }],
  },
  {
    heading: "Student Info Page",
    items: [{ id: "student-info", label: "Bottom Links" }],
  },
  {
    heading: "Other",
    items: [
      { id: "norms", label: "Expectations" },
      { id: "quick-links", label: "Quick Links" },
    ],
  },
];

// Empty form values used when adding a new subject.
const blankSubjectForm = {
  name: "",
  description: "",
  pathway: "",
};

// Empty form values used when adding a new weekly item.
const blankWeekForm = {
  day: "",
  title: "",
  time: "",
  location: "",
};

// Empty form values used when adding a new announcement.
const blankAnnouncementForm = {
  title: "",
  message: "",
  date: "",
};

// Empty form values used when adding a new school norm.
const blankNormForm = {
  title: "",
  category: "",
  content: "",
};

// Empty form values used when adding a new editable link.
const blankLinkForm = {
  label: "",
  url: "",
};

function EditorInput({ label, value, onChange, placeholder }) {
  // Small reusable text input used by the different teacher editors.
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
  // Small reusable larger text box for longer editable content.
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

function LinkEditor({ title, links, selectedId, form, onSelect, onChange, onSave, onClear, onDelete }) {
  // Reusable editor for Quick Links, Student Info links, and Web App links.
  return (
    <div className="grid min-h-0 grid-cols-1 gap-4 xl:grid-cols-[20rem_1fr] 2xl:grid-cols-[22rem_1fr]">
      <aside className="flex min-h-0 flex-col rounded-lg border border-[#F2901D] bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-950">
            Links
          </h3>

          <button
            type="button"
            onClick={onClear}
            className="rounded-md bg-[#F2901D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d87d11]"
          >
            Add New
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => onSelect(link)}
              className={`w-full rounded-md border border-[#F2901D] px-3 py-3 text-left text-sm font-semibold transition ${
                selectedId === link.id
                  ? "bg-[#F2901D] text-white"
                  : "bg-white text-gray-950 hover:bg-[#fff5e9]"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      </aside>

      <form
        onSubmit={onSave}
        className="overflow-y-auto rounded-lg border border-[#F2901D] bg-white p-4"
      >
        <h3 className="mb-4 text-lg font-bold text-gray-950">
          {selectedId ? `Edit ${title}` : `Add ${title}`}
        </h3>

        <div className="space-y-4">
          <EditorInput
            label="Button Text"
            value={form.label}
            onChange={(value) => onChange("label", value)}
            placeholder="Example: Kamar Portal"
          />

          <EditorInput
            label="Link URL"
            value={form.url}
            onChange={(value) => onChange("url", value)}
            placeholder="Example: https://example.com"
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="submit"
            className="rounded-md bg-[#F2901D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d87d11]"
          >
            Save Link
          </button>

          <button
            type="button"
            onClick={onClear}
            className="rounded-md border border-[#F2901D] px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-[#fff5e9]"
          >
            Clear
          </button>

          {selectedId && (
            <button
              type="button"
              onClick={() => onDelete(selectedId)}
              className="rounded-md border border-red-500 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function TeacherPanel() {
  // ---------------------------------------------------------------------------
  // Authentication, selected editor, database content and form state
  // ---------------------------------------------------------------------------

  // Teacher Panel state stores the selected editor and all editable form values.
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeEditor, setActiveEditor] = useState("level2");
  const [subjects, setSubjects] = useState(() => getStoredSubjects());
  const [weekItems, setWeekItems] = useState(() => getStoredWeekItems());
  const [announcements, setAnnouncements] = useState(() => getStoredAnnouncements());
  const [norms, setNorms] = useState(() => getStoredNorms());
  const [careersSupport, setCareersSupport] = useState(() =>
    getStoredCareersSupport(),
  );
  const [quickLinks, setQuickLinks] = useState(() => getStoredQuickLinks());
  const [studentInfoLinks, setStudentInfoLinks] = useState(() => getStoredStudentInfoLinks());
  const [webAppLinks, setWebAppLinks] = useState(() => getStoredWebAppLinks());
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjectForm, setSubjectForm] = useState(blankSubjectForm);
  const [selectedWeekItemId, setSelectedWeekItemId] = useState("");
  const [weekForm, setWeekForm] = useState(blankWeekForm);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState("");
  const [announcementForm, setAnnouncementForm] = useState(blankAnnouncementForm);
  const [selectedNormId, setSelectedNormId] = useState("");
  const [normForm, setNormForm] = useState(blankNormForm);
  const [careersSupportForm, setCareersSupportForm] = useState(() =>
    getStoredCareersSupport(),
  );
  const [selectedLinkId, setSelectedLinkId] = useState("");
  const [linkForm, setLinkForm] = useState(blankLinkForm);
  const [saveStatus, setSaveStatus] = useState({ type: "idle", message: "" });

  const activeLevel = curriculumLevels.find((level) => level.id === activeEditor);
  const isSubjectEditor = Boolean(activeLevel);
  const activeSubjects = isSubjectEditor ? subjects[activeEditor] || [] : [];

  // Derive the visible heading rather than storing duplicate title state that
  // could become inconsistent with activeEditor.
  const pageTitle = useMemo(() => {
    // The heading changes based on the selected sidebar menu item.
    if (activeEditor === "week") {
      return "What's on this week?";
    }

    if (activeEditor === "announcements") {
      return "Announcements";
    }

    if (activeEditor === "norms") {
      return "Expectations";
    }

    if (activeEditor === "careers-support") {
      return "Careers Support";
    }

    if (activeLevel) {
      return `${activeLevel.label} Subjects`;
    }

    const allMenuItems = menuSections.flatMap((section) => section.items);
    return allMenuItems.find((item) => item.id === activeEditor)?.label || "Editor";
  }, [activeEditor, activeLevel]);

  // ---------------------------------------------------------------------------
  // Authentication and initial shared-data loading
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // Check with Flask that the teacher is logged in before showing the panel.
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

  useEffect(() => {
    // Load editable content from Flask/SQLite when the panel opens.
    loadStoredSubjects().then(setSubjects);
    loadStoredWeekItems().then(setWeekItems);
    loadStoredAnnouncements().then(setAnnouncements);
    loadStoredNorms().then(setNorms);
    loadStoredCareersSupport().then((content) => {
      setCareersSupport(content);
      setCareersSupportForm(content);
    });
    loadStoredQuickLinks().then(setQuickLinks);
    loadStoredStudentInfoLinks().then(setStudentInfoLinks);
    loadStoredWebAppLinks().then(setWebAppLinks);
  }, []);

  async function handleLogout() {
    // End the Flask session and return to the login page.
    await fetch(`${apiBaseUrl}/api/logout`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/teacher-login");
  }

  async function persistChanges(saveRequest) {
    // Report the real Flask/SQLite result instead of assuming a local update
    // also reaches the shared database successfully.
    setSaveStatus({ type: "saving", message: "Saving to database..." });

    try {
      await saveRequest;
      setSaveStatus({ type: "success", message: "Changes saved to database." });
      return true;
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: error.message || "Database save failed. Please try again.",
      });
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Small form-state helpers shared by the editors below
  // ---------------------------------------------------------------------------

  function confirmDelete(itemName) {
    // Require a deliberate second action before any database record is removed.
    return window.confirm(`Are you sure you want to delete this ${itemName}?`);
  }

  function updateSubjectForm(field, value) {
    // Update one subject form field without changing the other fields.
    setSubjectForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function updateWeekForm(field, value) {
    // Update one weekly event form field.
    setWeekForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function updateAnnouncementForm(field, value) {
    // Update one announcement form field.
    setAnnouncementForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function updateNormForm(field, value) {
    // Update one school norm form field.
    setNormForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function updateCareersSupportForm(field, value) {
    // Update either the careers heading or message.
    setCareersSupportForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function updateLinkForm(field, value) {
    // Update the shared link form used by several editors.
    setLinkForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function selectSubject(subject) {
    // Fill the form with an existing subject so it can be edited.
    setSelectedSubjectId(subject.id);
    setSubjectForm({
      name: subject.name,
      description: subject.description,
      pathway: subject.pathway,
    });
  }

  // ---------------------------------------------------------------------------
  // Normalized Curriculum subject and junction-table operations
  // ---------------------------------------------------------------------------

  async function saveSubject(event) {
    // Add or update a subject in the selected curriculum level.
    event.preventDefault();

    if (!subjectForm.name.trim()) {
      return;
    }

    const savedSubject = {
      name: subjectForm.name.trim(),
      description: subjectForm.description.trim(),
      pathway: subjectForm.pathway.trim(),
      // The open sidebar editor supplies the relationship automatically.
      levels: [activeEditor],
      editing_level: activeEditor,
    };
    const request = selectedSubjectId
      // Existing IDs use relational UPDATE; a blank selection creates a new row.
      ? updateDatabaseSubject(selectedSubjectId, savedSubject)
      : createDatabaseSubject(savedSubject);
    if (await persistChanges(request)) {
      // Reload the JOIN result so every level panel immediately reflects changes.
      setSubjects(await loadStoredSubjects());
      clearSubjectForm();
    }
  }

  function clearSubjectForm() {
    // Reset the subject form back to a blank "add new" state.
    setSelectedSubjectId("");
    setSubjectForm(blankSubjectForm);
  }

  async function deleteSubject(subjectId) {
    // Remove the selected subject from the current level only.
    if (!confirmDelete("subject")) {
      return;
    }

    if (await persistChanges(deleteDatabaseSubject(subjectId, activeEditor))) {
      // A subject may still appear under other levels after this relationship ends.
      setSubjects(await loadStoredSubjects());
      clearSubjectForm();
    }
  }

  function selectWeekItem(item) {
    // Fill the form with an existing weekly item.
    setSelectedWeekItemId(item.id);
    setWeekForm({
      day: item.day,
      title: item.title,
      time: item.time,
      location: item.location,
    });
  }

  // ---------------------------------------------------------------------------
  // Generic JSON weekly-item operations
  // ---------------------------------------------------------------------------

  function saveWeekItem(event) {
    // Add or update an item in the "What's on this week" home card.
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
    persistChanges(saveStoredWeekItems(updatedWeekItems));
    setSelectedWeekItemId(savedItem.id);
  }

  function clearWeekForm() {
    // Reset the weekly item form.
    setSelectedWeekItemId("");
    setWeekForm(blankWeekForm);
  }

  function deleteWeekItem(itemId) {
    // Remove one item from the home page week list.
    if (!confirmDelete("weekly item")) {
      return;
    }

    const updatedWeekItems = weekItems.filter((item) => item.id !== itemId);

    setWeekItems(updatedWeekItems);
    persistChanges(saveStoredWeekItems(updatedWeekItems));
    clearWeekForm();
  }

  function selectAnnouncement(announcement) {
    // Fill the form with an existing announcement.
    setSelectedAnnouncementId(announcement.id);
    setAnnouncementForm({
      title: announcement.title,
      message: announcement.message,
      date: announcement.date,
    });
  }

  // ---------------------------------------------------------------------------
  // Normalized Announcement row operations
  // ---------------------------------------------------------------------------

  async function saveAnnouncement(event) {
    // Add or update an announcement shown on the home page.
    event.preventDefault();

    if (!announcementForm.title.trim()) {
      return;
    }

    const savedAnnouncement = {
      title: announcementForm.title.trim(),
      message: announcementForm.message.trim(),
      date: announcementForm.date.trim(),
    };
    const request = selectedAnnouncementId
      // Integer IDs distinguish an existing announcement from a new form entry.
      ? updateDatabaseAnnouncement(selectedAnnouncementId, savedAnnouncement)
      : createDatabaseAnnouncement(savedAnnouncement);
    if (await persistChanges(request)) {
      setAnnouncements(await loadStoredAnnouncements());
      clearAnnouncementForm();
    }
  }

  function clearAnnouncementForm() {
    // Reset the announcement form.
    setSelectedAnnouncementId("");
    setAnnouncementForm(blankAnnouncementForm);
  }

  async function deleteAnnouncement(announcementId) {
    // Remove one announcement from the home page list.
    if (!confirmDelete("announcement")) {
      return;
    }

    if (await persistChanges(deleteDatabaseAnnouncement(announcementId))) {
      setAnnouncements(await loadStoredAnnouncements());
      clearAnnouncementForm();
    }
  }

  function selectNorm(norm) {
    // Fill the form with an existing norm.
    setSelectedNormId(norm.id);
    setNormForm({
      title: norm.title,
      category: norm.category,
      content: norm.content,
    });
  }

  // ---------------------------------------------------------------------------
  // Generic Expectations and Careers content operations
  // ---------------------------------------------------------------------------

  function saveNorm(event) {
    // Add or update an expectation shown on the Expectations page.
    event.preventDefault();

    if (!normForm.title.trim()) {
      return;
    }

    const savedNorm = {
      id: selectedNormId || createId("norm"),
      title: normForm.title.trim(),
      category: normForm.category.trim() || "General",
      content: normForm.content.trim(),
    };

    const updatedNorms = selectedNormId
      ? norms.map((norm) => (norm.id === selectedNormId ? savedNorm : norm))
      : [...norms, savedNorm];

    setNorms(updatedNorms);
    persistChanges(saveStoredNorms(updatedNorms));
    clearNormForm();
  }

  function clearNormForm() {
    // Reset the school norm form.
    setSelectedNormId("");
    setNormForm(blankNormForm);
  }

  function deleteNorm(normId) {
    // Remove one expectation from the Expectations page list.
    if (!confirmDelete("expectation")) {
      return;
    }

    const updatedNorms = norms.filter((norm) => norm.id !== normId);

    setNorms(updatedNorms);
    persistChanges(saveStoredNorms(updatedNorms));
    clearNormForm();
  }

  function saveCareersSupport(event) {
    // Save the text shown underneath the Careers staff cards.
    event.preventDefault();

    const savedContent = {
      title: careersSupportForm.title.trim() || "Careers Support at OSC",
      message: careersSupportForm.message.trim(),
    };

    setCareersSupport(savedContent);
    persistChanges(saveStoredCareersSupport(savedContent));
  }

  function getActiveLinks() {
    // Pick the correct editable link list based on the selected menu item.
    if (activeEditor === "quick-links") {
      return quickLinks;
    }

    if (activeEditor === "student-info") {
      return studentInfoLinks;
    }

    return webAppLinks;
  }

  // ---------------------------------------------------------------------------
  // Reusable generic link operations for three different site sections
  // ---------------------------------------------------------------------------

  function saveActiveLinks(links) {
    // Save the selected link list back to shared storage and SQLite.
    if (activeEditor === "quick-links") {
      setQuickLinks(links);
      persistChanges(saveStoredQuickLinks(links));
    } else if (activeEditor === "student-info") {
      setStudentInfoLinks(links);
      persistChanges(saveStoredStudentInfoLinks(links));
    } else {
      setWebAppLinks(links);
      persistChanges(saveStoredWebAppLinks(links));
    }
  }

  function selectLink(link) {
    // Fill the link form when a teacher clicks an existing link.
    setSelectedLinkId(link.id);
    setLinkForm({
      label: link.label,
      url: link.url,
    });
  }

  function clearLinkForm() {
    // Reset the link form back to a blank "add new" state.
    setSelectedLinkId("");
    setLinkForm(blankLinkForm);
  }

  function saveLink(event) {
    // Save a new link, or update the selected link if one is already chosen.
    event.preventDefault();

    if (!linkForm.label.trim()) {
      return;
    }

    const activeLinks = getActiveLinks();
    const savedLink = {
      id: selectedLinkId || createId("link"),
      label: linkForm.label.trim(),
      url: linkForm.url.trim(),
      // URLs starting with "/" use React Router; full URLs open as external links.
      isInternal: linkForm.url.trim().startsWith("/"),
    };

    const updatedLinks = selectedLinkId
      ? activeLinks.map((link) => (link.id === selectedLinkId ? savedLink : link))
      : [...activeLinks, savedLink];

    saveActiveLinks(updatedLinks);
    setSelectedLinkId(savedLink.id);
  }

  function deleteLink(linkId) {
    // Delete one link from whichever link editor is currently open.
    if (!confirmDelete("link")) {
      return;
    }

    const updatedLinks = getActiveLinks().filter((link) => link.id !== linkId);
    saveActiveLinks(updatedLinks);
    clearLinkForm();
  }

  if (isCheckingAuth) {
    // Show a simple loading state while Flask checks the teacher session.
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#404040] text-white">
        Checking teacher access...
      </main>
    );
  }

  // Each conditional editor below is mounted only when selected. This keeps one
  // protected page and shared state while avoiding separate nearly-identical routes.
  return (
    <main className="min-h-screen bg-[#404040] p-2 sm:p-5 lg:h-screen lg:overflow-hidden">
      <section className="grid min-h-[calc(100vh-1rem)] grid-cols-1 gap-3 rounded-xl border border-[#F2901D] bg-white p-2 text-base sm:min-h-[calc(100vh-2.5rem)] sm:p-3 lg:h-full lg:min-h-0 lg:grid-cols-[15rem_1fr] lg:overflow-hidden xl:grid-cols-[17rem_1fr]">
        <aside className="rounded-lg border border-[#F2901D] bg-white p-3 lg:overflow-y-auto">
          <h1 className="mb-2 text-xl font-bold text-gray-950 sm:text-2xl">
            Menu:
          </h1>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:block lg:space-y-3">
            {menuSections.map((section) => (
              <div key={section.heading}>
                <h2 className="mb-1 text-base font-medium text-gray-950">
                  {section.heading}:
                </h2>

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        // Reset forms when switching editors so old values do not carry across.
                        setActiveEditor(item.id);
                        clearSubjectForm();
                        clearWeekForm();
                        clearAnnouncementForm();
                        clearNormForm();
                        setCareersSupportForm(careersSupport);
                        clearLinkForm();
                      }}
                      className={`w-full rounded-md border border-[#F2901D] px-3 py-2 text-sm font-medium transition ${
                        activeEditor === item.id
                          ? "bg-[#F2901D] text-white shadow-sm"
                          : "bg-white text-gray-950 hover:bg-[#fff8ec]"
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

        <section className="min-w-0 rounded-lg border border-[#F2901D] bg-white p-3 sm:p-4 lg:flex lg:min-h-0 lg:flex-col lg:overflow-hidden">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 lg:shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-950 sm:text-2xl">
                Edit:
              </h2>
              <p className="text-sm font-medium text-[#F2901D]">
                {pageTitle}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[#F2901D] px-5 py-2 text-sm font-semibold text-gray-950 transition hover:bg-[#fff5e9] sm:px-8"
            >
              Logout
            </button>
          </div>

          {saveStatus.type !== "idle" && (
            <p
              role="status"
              aria-live="polite"
              className={`mb-4 rounded-md border px-3 py-2 text-sm font-semibold lg:shrink-0 ${
                saveStatus.type === "error"
                  ? "border-red-300 bg-red-50 text-red-700"
                  : saveStatus.type === "success"
                    ? "border-green-300 bg-green-50 text-green-700"
                    : "border-[#F2901D] bg-[#fff8ec] text-gray-700"
              }`}
            >
              {saveStatus.message}
            </p>
          )}

          {/* Subject editor is reused for Level 1, Level 2, Level 3, and Scholarships. */}
          {isSubjectEditor && (
            <div className="grid min-h-0 grid-cols-1 gap-4 lg:flex-1 lg:overflow-hidden xl:grid-cols-[20rem_1fr] 2xl:grid-cols-[22rem_1fr]">
              <aside className="flex min-h-0 flex-col rounded-lg border border-[#F2901D] bg-white p-4">
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

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
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
                className="overflow-y-auto rounded-lg border border-[#F2901D] bg-white p-4"
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

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

          {/* This editor controls the "What's on this week?" card on the Home page. */}
          {activeEditor === "week" && (
            <div className="grid min-h-0 grid-cols-1 gap-4 lg:flex-1 lg:overflow-hidden xl:grid-cols-[20rem_1fr] 2xl:grid-cols-[22rem_1fr]">
              <aside className="flex min-h-0 flex-col rounded-lg border border-[#F2901D] bg-white p-4">
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

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
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
                className="overflow-y-auto rounded-lg border border-[#F2901D] bg-white p-4"
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

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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

          {/* This editor controls the Announcements card on the Home page. */}
          {activeEditor === "announcements" && (
            <div className="grid min-h-0 grid-cols-1 gap-4 lg:flex-1 lg:overflow-hidden xl:grid-cols-[20rem_1fr] 2xl:grid-cols-[22rem_1fr]">
              <aside className="flex min-h-0 flex-col rounded-lg border border-[#F2901D] bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-950">
                    Announcements
                  </h3>

                  <button
                    type="button"
                    onClick={clearAnnouncementForm}
                    className="rounded-md bg-[#F2901D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d87d11]"
                  >
                    Add New
                  </button>
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {announcements.map((announcement) => (
                    <button
                      key={announcement.id}
                      type="button"
                      onClick={() => selectAnnouncement(announcement)}
                      className={`w-full rounded-md border border-[#F2901D] px-3 py-3 text-left text-sm font-semibold transition ${
                        selectedAnnouncementId === announcement.id
                          ? "bg-[#F2901D] text-white"
                          : "bg-white text-gray-950 hover:bg-[#fff5e9]"
                      }`}
                    >
                      {announcement.title}
                    </button>
                  ))}
                </div>
              </aside>

              <form
                onSubmit={saveAnnouncement}
                className="overflow-y-auto rounded-lg border border-[#F2901D] bg-white p-4"
              >
                <h3 className="mb-4 text-lg font-bold text-gray-950">
                  {selectedAnnouncementId ? "Edit Announcement" : "Add Announcement"}
                </h3>

                <div className="space-y-4">
                  <EditorInput
                    label="Title"
                    value={announcementForm.title}
                    onChange={(value) => updateAnnouncementForm("title", value)}
                    placeholder="Example: Uniform reminder"
                  />

                  <EditorInput
                    label="Date"
                    value={announcementForm.date}
                    onChange={(value) => updateAnnouncementForm("date", value)}
                    placeholder="Example: Today"
                  />

                  <EditorTextarea
                    label="Message"
                    value={announcementForm.message}
                    onChange={(value) => updateAnnouncementForm("message", value)}
                    placeholder="Write the announcement..."
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="submit"
                    className="rounded-md bg-[#F2901D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d87d11]"
                  >
                    Save Announcement
                  </button>

                  <button
                    type="button"
                    onClick={clearAnnouncementForm}
                    className="rounded-md border border-[#F2901D] px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-[#fff5e9]"
                  >
                    Clear
                  </button>

                  {selectedAnnouncementId && (
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(selectedAnnouncementId)}
                      className="rounded-md border border-red-500 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* This editor controls the expectations shown on the Expectations page. */}
          {activeEditor === "norms" && (
            <div className="grid min-h-0 grid-cols-1 gap-4 lg:flex-1 lg:overflow-hidden xl:grid-cols-[20rem_1fr] 2xl:grid-cols-[22rem_1fr]">
              <aside className="flex min-h-0 flex-col rounded-lg border border-[#F2901D] bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-gray-950">
                    Expectations
                  </h3>

                  <button
                    type="button"
                    onClick={clearNormForm}
                    className="rounded-md bg-[#F2901D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#d87d11]"
                  >
                    Add New
                  </button>
                </div>

                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {norms.map((norm) => (
                    <button
                      key={norm.id}
                      type="button"
                      onClick={() => selectNorm(norm)}
                      className={`w-full rounded-md border border-[#F2901D] px-3 py-3 text-left text-sm font-semibold transition ${
                        selectedNormId === norm.id
                          ? "bg-[#F2901D] text-white"
                          : "bg-white text-gray-950 hover:bg-[#fff5e9]"
                      }`}
                    >
                      <span className="block">{norm.title}</span>
                      <span className="text-xs font-medium opacity-80">
                        {norm.category}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              <form
                onSubmit={saveNorm}
                className="overflow-y-auto rounded-lg border border-[#F2901D] bg-white p-4"
              >
                <h3 className="mb-4 text-lg font-bold text-gray-950">
                  {selectedNormId ? "Edit Expectation" : "Add Expectation"}
                </h3>

                <div className="space-y-4">
                  <EditorInput
                    label="Title"
                    value={normForm.title}
                    onChange={(value) => updateNormForm("title", value)}
                    placeholder="Example: Attendance Expectations"
                  />

                  <EditorInput
                    label="Category / Tab Name"
                    value={normForm.category}
                    onChange={(value) => updateNormForm("category", value)}
                    placeholder="Example: Attendance"
                  />

                  <EditorTextarea
                    label="Content"
                    value={normForm.content}
                    onChange={(value) => updateNormForm("content", value)}
                    placeholder="Write the expectation..."
                  />
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="submit"
                    className="rounded-md bg-[#F2901D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d87d11]"
                  >
                    Save Expectation
                  </button>

                  <button
                    type="button"
                    onClick={clearNormForm}
                    className="rounded-md border border-[#F2901D] px-6 py-3 text-sm font-semibold text-gray-950 hover:bg-[#fff5e9]"
                  >
                    Clear
                  </button>

                  {selectedNormId && (
                    <button
                      type="button"
                      onClick={() => deleteNorm(selectedNormId)}
                      className="rounded-md border border-red-500 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* This editor controls the editable text section on the Careers page. */}
          {activeEditor === "careers-support" && (
            <form
              onSubmit={saveCareersSupport}
              className="overflow-y-auto rounded-lg border border-[#F2901D] bg-white p-4 lg:flex-1"
            >
              <h3 className="mb-4 text-lg font-bold text-gray-950">
                Edit Careers Support Section
              </h3>

              <div className="space-y-4">
                <EditorInput
                  label="Heading"
                  value={careersSupportForm.title}
                  onChange={(value) => updateCareersSupportForm("title", value)}
                  placeholder="Example: Careers Support at OSC"
                />

                <EditorTextarea
                  label="Message"
                  value={careersSupportForm.message}
                  onChange={(value) => updateCareersSupportForm("message", value)}
                  placeholder="Write what the Careers team wants students to know..."
                />
              </div>

              <button
                type="submit"
                className="mt-5 rounded-md bg-[#F2901D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d87d11]"
              >
                Save Careers Support
              </button>
            </form>
          )}

          {/* One shared link editor handles app links, student info links, and quick links. */}
          {["apps", "student-info", "quick-links"].includes(activeEditor) && (
            <LinkEditor
              title={pageTitle}
              links={getActiveLinks()}
              selectedId={selectedLinkId}
              form={linkForm}
              onSelect={selectLink}
              onChange={updateLinkForm}
              onSave={saveLink}
              onClear={clearLinkForm}
              onDelete={deleteLink}
            />
          )}

        </section>
      </section>
    </main>
  );
}
