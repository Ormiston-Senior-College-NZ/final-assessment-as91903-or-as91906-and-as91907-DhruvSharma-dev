// Shared content and database functions used by the React pages.
//
// Default values appear while content is loading, and localStorage keeps a recent
// copy in the browser. Smaller sections are saved as JSON, while announcements and
// curriculum have separate database routes so records can be edited individually.
export const curriculumLevels = [
  // These IDs connect each button to the right group of subjects.
  { id: "level1", label: "LEVEL 1" },
  { id: "level2", label: "LEVEL 2" },
  { id: "level3", label: "LEVEL 3" },
  { id: "scholarships", label: "Scholarships" },
];

// -----------------------------------------------------------------------------
// Safe initial values used before shared database content is available
// -----------------------------------------------------------------------------

export const defaultSubjects = {
  // Show these subjects until a teacher saves their own changes.
  level1: [
    {
      id: "l1-english",
      name: "English",
      description:
        "Build reading, writing, speaking, and visual language skills for NCEA Level 1.",
      pathway: "Supports every future pathway because communication is used across all subjects.",
    },
    {
      id: "l1-mathematics",
      name: "Mathematics",
      description:
        "Develop number, algebra, measurement, statistics, and problem-solving skills.",
      pathway: "Useful for science, business, technology, trades, and university pathways.",
    },
    {
      id: "l1-science",
      name: "Science",
      description:
        "Explore biology, chemistry, physics, and scientific thinking through practical learning.",
      pathway: "Leads into senior science subjects and STEM-related careers.",
    },
  ],
  level2: [
    {
      id: "l2-english",
      name: "English",
      description:
        "Analyse texts, craft writing, and develop stronger critical thinking and communication skills.",
      pathway: "Supports university entrance literacy and many academic pathways.",
    },
    {
      id: "l2-calculus",
      name: "Mathematics with Calculus",
      description:
        "Study algebra, graphs, calculus concepts, and mathematical modelling.",
      pathway: "Recommended for engineering, physics, computer science, and mathematics pathways.",
    },
    {
      id: "l2-digital-tech",
      name: "Digital Technologies",
      description:
        "Design, develop, test, and evaluate digital outcomes using programming and web technologies.",
      pathway: "Leads toward software development, UX design, data, and technology careers.",
    },
  ],
  level3: [
    {
      id: "l3-statistics",
      name: "Statistics",
      description:
        "Use probability, data analysis, and statistical reports to investigate real-world questions.",
      pathway: "Useful for health science, business, psychology, data science, and research.",
    },
    {
      id: "l3-chemistry",
      name: "Chemistry",
      description:
        "Investigate chemical reactions, structures, and practical chemistry concepts.",
      pathway: "Supports health science, engineering, laboratory, and environmental pathways.",
    },
    {
      id: "l3-digital-tech",
      name: "Digital Technologies",
      description:
        "Create advanced digital outcomes and document the development process for assessment.",
      pathway: "Supports computer science, software engineering, design, and IT pathways.",
    },
  ],
  scholarships: [
    {
      id: "scholarship-info",
      name: "Scholarship Preparation",
      description:
        "Information about extension learning, scholarship assessment, and preparation support.",
      pathway: "Best suited for students aiming for high academic achievement and university study.",
    },
  ],
};

export const defaultWeekItems = [
  // Starter notices for the Home page.
  {
    id: "week-assembly",
    day: "Monday",
    title: "Mokoroa assembly",
    time: "9:00 AM",
    location: "Theatre",
  },
  {
    id: "week-itime",
    day: "Wednesday",
    title: "I-Time tutorials",
    time: "1:30 PM",
    location: "Learning Commons",
  },
  {
    id: "week-sport",
    day: "Friday",
    title: "Sports sign-ups close",
    time: "3:00 PM",
    location: "Student Services",
  },
];

export const defaultAnnouncements = [
  // Starter announcements for the Home page.
  {
    id: "announcement-welcome",
    title: "Welcome to StudentNET",
    message: "Check this dashboard for key school updates and notices.",
    date: "Today",
  },
  {
    id: "announcement-reminder",
    title: "UEG Exams",
    message: "Students should bring a charged device to school each day.",
    date: "This week",
  },
];

export const defaultQuickLinks = [
  // Starter links for the bar at the bottom.
  { id: "expectations", label: "Expectations", url: "/expectations", isInternal: true },
  { id: "kamar", label: "Kamar Portal", url: "https://ormiston.school.kiwi/" },
  {
    id: "wifi",
    label: "Wi-Fi Setup",
    url: "https://drive.google.com/drive/folders/132RJOXYCqDDaKhRiS3AfWgMS6K676BiE?usp=sharing",
  },
  {
    id: "clubs",
    label: "School Clubs",
    url: "https://docs.google.com/spreadsheets/d/1gjfaDCoq37gcznVxVUboHnfdCc43wJjR5Z-bd2BQcgQ/edit?gid=1149952797#gid=1149952797",
  },
  {
    id: "itime",
    label: "I-Time Tutorials",
    url: "https://docs.google.com/spreadsheets/d/1_qqpln-KH4U-Iuwl46oOmiXY58sk4GyxAgSK0MMilKM/edit?gid=105554696#gid=105554696",
  },
];

export const defaultStudentInfoLinks = [
  // Starter cards for the Student Info page.
  { id: "leadership", label: "Student Leadership", url: "" },
  { id: "doe", label: "DoE at OSC", url: "" },
  {
    id: "sports",
    label: "Sports",
    url: "https://sites.google.com/ormiston.school.nz/oscsports/welcome",
  },
];

export const defaultWebAppLinks = [
  // Starter cards for the Web Apps page.
  {
    id: "best-choice",
    label: "Best Choice for Chemistry",
    url: "https://www.bestchoice.net.nz/",
  },
  { id: "classroom", label: "Google Classroom", url: "https://classroom.google.com/" },
  { id: "gmail", label: "Gmail", url: "https://mail.google.com/" },
  { id: "myportfolio", label: "MyPortfolio", url: "https://myportfolio.school.nz/" },
  { id: "refseek", label: "RefSeek", url: "https://www.refseek.com/" },
];

export const defaultCareersSupport = {
  // Starter text for the Careers section.
  title: "Careers Support at OSC",
  message:
    "The Careers Department supports students with pathways, university planning, apprenticeships, scholarships, Gateway, and career decision making.",
};

export const defaultNorms = [
  // Show these expectations until a teacher changes them.
  {
    id: "norm-attendance",
    title: "Attendance Expectations",
    category: "Attendance",
    content:
      "Students are expected to attend school each day and arrive to learning on time.",
  },
  {
    id: "norm-uniform",
    title: "Uniform",
    category: "Uniform",
    content:
      "Students should wear the correct school uniform and present themselves respectfully.",
  },
  {
    id: "norm-devices",
    title: "Devices",
    category: "Devices",
    content:
      "Students should bring a charged device and use it responsibly for learning.",
  },
];

export const eventCalendarSheet = {
  // These details are used to show the calendar Google Sheet.
  spreadsheetId: "173F-7IVXVgB9K0Cfz_GAPs5iFL6sfYq3Pi0-Ulhq794",
  gid: "660379046",
};

export const eventCalendarViewUrl = `https://docs.google.com/spreadsheets/d/${eventCalendarSheet.spreadsheetId}/view?gid=${eventCalendarSheet.gid}`;

export const eventCalendarEmbedUrl = `https://docs.google.com/spreadsheets/d/${eventCalendarSheet.spreadsheetId}/preview?gid=${eventCalendarSheet.gid}`;

// Storage keys deliberately match the generic content-table keys. That makes it
// easy to identify the same category in browser storage, requests and SQLite.
const apiBaseUrl = "http://localhost:5000";
const subjectsStorageKey = "studentnet-curriculum-subjects";
const weekStorageKey = "studentnet-whats-on-this-week";
const announcementsStorageKey = "studentnet-announcements";
const quickLinksStorageKey = "studentnet-quick-links";
const studentInfoLinksStorageKey = "studentnet-student-info-links";
const webAppLinksStorageKey = "studentnet-web-app-links";
const careersSupportStorageKey = "studentnet-careers-support";
const normsStorageKey = "studentnet-school-norms";

// -----------------------------------------------------------------------------
// Cache and HTTP helpers
// -----------------------------------------------------------------------------

function readStoredValue(key, fallbackValue) {
  // Read local storage synchronously so content appears on the first render.
  // fallbackValue is used for a new browser, server rendering, or damaged JSON.
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  const storedValue = window.localStorage.getItem(key);

  if (!storedValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    // Invalid saved JSON should not stop the rest of the website from loading.
    return fallbackValue;
  }
}

async function writeStoredValue(key, value) {
  // Update local storage immediately, then send the same value to SQLite. This
  // makes edits feel instant while still sharing them with other devices.
  window.localStorage.setItem(key, JSON.stringify(value));
  return saveContentToDatabase(key, value);
}

async function loadContentFromDatabase(key, fallbackValue) {
  // Try to load the shared database value. If Flask is unavailable, use the
  // saved browser copy or default value so the page can still load.
  try {
    const response = await fetch(`${apiBaseUrl}/api/content/${key}`);

    if (!response.ok) {
      // This also handles a 404 when no teacher has saved this content yet.
      return fallbackValue;
    }

    const data = await response.json();
    const value = data.value ?? fallbackValue;
    // Cache the shared value so it can appear instantly on the next visit.
    window.localStorage.setItem(key, JSON.stringify(value));

    return value;
  } catch {
    return fallbackValue;
  }
}

async function saveContentToDatabase(key, value) {
  const response = await fetch(`${apiBaseUrl}/api/content/${key}`, {
    method: "PUT",
    // The session cookie proves to Flask that a logged-in teacher made the edit.
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "The database save failed.");
  }

  return data;
}

async function relationalRequest(path, options = {}) {
  // Normalized tables use REST routes rather than the older generic JSON route.
  // Keep authentication and error handling in one place for every CRUD request.
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "The database request failed.");
  }
  return data;
}

// -----------------------------------------------------------------------------
// Normalized Curriculum data access
// -----------------------------------------------------------------------------

export function getStoredSubjects() {
  // The cached/default curriculum appears immediately while SQLite is loading.
  return readStoredValue(subjectsStorageKey, defaultSubjects);
}

export function loadStoredSubjects() {
  // Replace the cached curriculum with the grouped result of Flask's JOIN query.
  return fetch(`${apiBaseUrl}/api/curriculum`)
    .then(async (response) => {
      if (!response.ok) {
        return getStoredSubjects();
      }
      const data = await response.json();
      window.localStorage.setItem(subjectsStorageKey, JSON.stringify(data.subjects));
      return data.subjects;
    })
    .catch(() => getStoredSubjects());
}

export function createDatabaseSubject(subject) {
  // POST creates the subject and all selected subject-level relationships.
  return relationalRequest("/api/subjects", {
    method: "POST",
    body: JSON.stringify(subject),
  });
}

export function updateDatabaseSubject(subjectId, subject) {
  // PUT synchronizes the subject's selected curriculum levels in one transaction.
  return relationalRequest(`/api/subjects/${subjectId}`, {
    method: "PUT",
    body: JSON.stringify(subject),
  });
}

export function deleteDatabaseSubject(subjectId, levelId) {
  // The level query removes only the relationship currently shown in the editor.
  return relationalRequest(`/api/subjects/${subjectId}?level=${encodeURIComponent(levelId)}`, {
    method: "DELETE",
  });
}

// -----------------------------------------------------------------------------
// Generic weekly content data access
// -----------------------------------------------------------------------------

export function getStoredWeekItems() {
  return readStoredValue(weekStorageKey, defaultWeekItems);
}

export function loadStoredWeekItems() {
  return loadContentFromDatabase(weekStorageKey, getStoredWeekItems());
}

export function saveStoredWeekItems(weekItems) {
  return writeStoredValue(weekStorageKey, weekItems);
}

// -----------------------------------------------------------------------------
// Normalized Announcement data access
// -----------------------------------------------------------------------------

export function getStoredAnnouncements() {
  // Keep a local copy available while the normalized table is being requested.
  return readStoredValue(announcementsStorageKey, defaultAnnouncements);
}

export function loadStoredAnnouncements() {
  // Announcements now come from individual relational rows rather than JSON.
  return fetch(`${apiBaseUrl}/api/announcements`)
    .then(async (response) => {
      if (!response.ok) {
        return getStoredAnnouncements();
      }
      const data = await response.json();
      window.localStorage.setItem(
        announcementsStorageKey,
        JSON.stringify(data.announcements),
      );
      return data.announcements;
    })
    .catch(() => getStoredAnnouncements());
}

export function createDatabaseAnnouncement(announcement) {
  // The database assigns the new announcement's integer primary key.
  return relationalRequest("/api/announcements", {
    method: "POST",
    body: JSON.stringify(announcement),
  });
}

export function updateDatabaseAnnouncement(announcementId, announcement) {
  // Update only the row selected in the Teacher Panel.
  return relationalRequest(`/api/announcements/${announcementId}`, {
    method: "PUT",
    body: JSON.stringify(announcement),
  });
}

export function deleteDatabaseAnnouncement(announcementId) {
  // DELETE removes one normalized record rather than rewriting a full list.
  return relationalRequest(`/api/announcements/${announcementId}`, {
    method: "DELETE",
  });
}

// -----------------------------------------------------------------------------
// Remaining generic editable sections
// -----------------------------------------------------------------------------

export function getStoredQuickLinks() {
  return readStoredValue(quickLinksStorageKey, defaultQuickLinks);
}

export function loadStoredQuickLinks() {
  return loadContentFromDatabase(quickLinksStorageKey, getStoredQuickLinks());
}

export function saveStoredQuickLinks(links) {
  return writeStoredValue(quickLinksStorageKey, links);
}

export function getStoredStudentInfoLinks() {
  return readStoredValue(studentInfoLinksStorageKey, defaultStudentInfoLinks);
}

export function loadStoredStudentInfoLinks() {
  return loadContentFromDatabase(studentInfoLinksStorageKey, getStoredStudentInfoLinks());
}

export function saveStoredStudentInfoLinks(links) {
  return writeStoredValue(studentInfoLinksStorageKey, links);
}

export function getStoredWebAppLinks() {
  return readStoredValue(webAppLinksStorageKey, defaultWebAppLinks);
}

export function loadStoredWebAppLinks() {
  return loadContentFromDatabase(webAppLinksStorageKey, getStoredWebAppLinks());
}

export function saveStoredWebAppLinks(links) {
  return writeStoredValue(webAppLinksStorageKey, links);
}

export function getStoredCareersSupport() {
  return readStoredValue(careersSupportStorageKey, defaultCareersSupport);
}

export function loadStoredCareersSupport() {
  return loadContentFromDatabase(careersSupportStorageKey, getStoredCareersSupport());
}

export function saveStoredCareersSupport(content) {
  return writeStoredValue(careersSupportStorageKey, content);
}

export function getStoredNorms() {
  return readStoredValue(normsStorageKey, defaultNorms);
}

export function loadStoredNorms() {
  return loadContentFromDatabase(normsStorageKey, getStoredNorms());
}

export function saveStoredNorms(norms) {
  return writeStoredValue(normsStorageKey, norms);
}

export function createId(prefix) {
  // randomUUID gives new items a reliable unique key for React and the editor.
  // Date.now is a fallback for older browsers that do not support randomUUID.
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}
