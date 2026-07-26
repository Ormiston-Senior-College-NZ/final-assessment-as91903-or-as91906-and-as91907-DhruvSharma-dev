export const curriculumLevels = [
  { id: "level1", label: "LEVEL 1" },
  { id: "level2", label: "LEVEL 2" },
  { id: "level3", label: "LEVEL 3" },
  { id: "scholarships", label: "Scholarships" },
];

export const defaultSubjects = {
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
  {
    id: "week-assembly",
    day: "Monday",
    title: "Whanau assembly",
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
  {
    id: "announcement-welcome",
    title: "Welcome to StudentNET",
    message: "Check this dashboard for key school updates and notices.",
    date: "Today",
  },
  {
    id: "announcement-reminder",
    title: "Bring your device",
    message: "Students should bring a charged device to school each day.",
    date: "This week",
  },
];

export const defaultQuickLinks = [
  { id: "norms", label: "Norms", url: "/norms", isInternal: true },
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
  { id: "leadership", label: "Student Leadership", url: "" },
  { id: "doe", label: "DoE at OSC", url: "" },
  {
    id: "sports",
    label: "Sports",
    url: "https://sites.google.com/ormiston.school.nz/oscsports/welcome",
  },
];

export const defaultWebAppLinks = [
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
  title: "Careers Support at OSC",
  message:
    "The Careers Department supports students with pathways, university planning, apprenticeships, scholarships, Gateway, and career decision making.",
};

export const eventCalendarSheet = {
  spreadsheetId: "173F-7IVXVgB9K0Cfz_GAPs5iFL6sfYq3Pi0-Ulhq794",
  gid: "660379046",
};

export const eventCalendarViewUrl = `https://docs.google.com/spreadsheets/d/${eventCalendarSheet.spreadsheetId}/view?gid=${eventCalendarSheet.gid}`;

export const eventCalendarEmbedUrl = `https://docs.google.com/spreadsheets/d/${eventCalendarSheet.spreadsheetId}/preview?gid=${eventCalendarSheet.gid}`;

const apiBaseUrl = "http://localhost:5000";
const subjectsStorageKey = "studentnet-curriculum-subjects";
const weekStorageKey = "studentnet-whats-on-this-week";
const announcementsStorageKey = "studentnet-announcements";
const quickLinksStorageKey = "studentnet-quick-links";
const studentInfoLinksStorageKey = "studentnet-student-info-links";
const webAppLinksStorageKey = "studentnet-web-app-links";
const careersSupportStorageKey = "studentnet-careers-support";

function readStoredValue(key, fallbackValue) {
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
    return fallbackValue;
  }
}

function writeStoredValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
  saveContentToDatabase(key, value);
}

async function loadContentFromDatabase(key, fallbackValue) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/content/${key}`);

    if (!response.ok) {
      return fallbackValue;
    }

    const data = await response.json();
    const value = data.value ?? fallbackValue;
    window.localStorage.setItem(key, JSON.stringify(value));

    return value;
  } catch {
    return fallbackValue;
  }
}

function saveContentToDatabase(key, value) {
  fetch(`${apiBaseUrl}/api/content/${key}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value }),
  }).catch(() => {});
}

export function getStoredSubjects() {
  return readStoredValue(subjectsStorageKey, defaultSubjects);
}

export function loadStoredSubjects() {
  return loadContentFromDatabase(subjectsStorageKey, getStoredSubjects());
}

export function saveStoredSubjects(subjects) {
  writeStoredValue(subjectsStorageKey, subjects);
}

export function getStoredWeekItems() {
  return readStoredValue(weekStorageKey, defaultWeekItems);
}

export function loadStoredWeekItems() {
  return loadContentFromDatabase(weekStorageKey, getStoredWeekItems());
}

export function saveStoredWeekItems(weekItems) {
  writeStoredValue(weekStorageKey, weekItems);
}

export function getStoredAnnouncements() {
  return readStoredValue(announcementsStorageKey, defaultAnnouncements);
}

export function loadStoredAnnouncements() {
  return loadContentFromDatabase(announcementsStorageKey, getStoredAnnouncements());
}

export function saveStoredAnnouncements(announcements) {
  writeStoredValue(announcementsStorageKey, announcements);
}

export function getStoredQuickLinks() {
  return readStoredValue(quickLinksStorageKey, defaultQuickLinks);
}

export function loadStoredQuickLinks() {
  return loadContentFromDatabase(quickLinksStorageKey, getStoredQuickLinks());
}

export function saveStoredQuickLinks(links) {
  writeStoredValue(quickLinksStorageKey, links);
}

export function getStoredStudentInfoLinks() {
  return readStoredValue(studentInfoLinksStorageKey, defaultStudentInfoLinks);
}

export function loadStoredStudentInfoLinks() {
  return loadContentFromDatabase(studentInfoLinksStorageKey, getStoredStudentInfoLinks());
}

export function saveStoredStudentInfoLinks(links) {
  writeStoredValue(studentInfoLinksStorageKey, links);
}

export function getStoredWebAppLinks() {
  return readStoredValue(webAppLinksStorageKey, defaultWebAppLinks);
}

export function loadStoredWebAppLinks() {
  return loadContentFromDatabase(webAppLinksStorageKey, getStoredWebAppLinks());
}

export function saveStoredWebAppLinks(links) {
  writeStoredValue(webAppLinksStorageKey, links);
}

export function getStoredCareersSupport() {
  return readStoredValue(careersSupportStorageKey, defaultCareersSupport);
}

export function loadStoredCareersSupport() {
  return loadContentFromDatabase(careersSupportStorageKey, getStoredCareersSupport());
}

export function saveStoredCareersSupport(content) {
  writeStoredValue(careersSupportStorageKey, content);
}

export function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}
