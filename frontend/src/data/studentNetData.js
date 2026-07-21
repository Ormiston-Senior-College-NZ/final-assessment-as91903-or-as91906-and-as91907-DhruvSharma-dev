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

export const eventCalendarSheet = {
  spreadsheetId: "173F-7IVXVgB9K0Cfz_GAPs5iFL6sfYq3Pi0-Ulhq794",
  gid: "660379046",
};

export const eventCalendarViewUrl = `https://docs.google.com/spreadsheets/d/${eventCalendarSheet.spreadsheetId}/view?gid=${eventCalendarSheet.gid}`;

export const eventCalendarEmbedUrl = `https://docs.google.com/spreadsheets/d/${eventCalendarSheet.spreadsheetId}/preview?gid=${eventCalendarSheet.gid}`;

const subjectsStorageKey = "studentnet-curriculum-subjects";
const weekStorageKey = "studentnet-whats-on-this-week";

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
}

export function getStoredSubjects() {
  return readStoredValue(subjectsStorageKey, defaultSubjects);
}

export function saveStoredSubjects(subjects) {
  writeStoredValue(subjectsStorageKey, subjects);
}

export function getStoredWeekItems() {
  return readStoredValue(weekStorageKey, defaultWeekItems);
}

export function saveStoredWeekItems(weekItems) {
  writeStoredValue(weekStorageKey, weekItems);
}

export function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}
