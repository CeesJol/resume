export const MAX_NUMBER_OF_RESUMES = 10;
export const COOKIE_MAX_AGE = 3600 * 24 * 30; // 30 days, in seconds

export const RESUME_DEFAULTS = {
  fontSize: "9px",
};

// Default contact info options with their corresponding font awesome icon
export const CONTACTPICKER_OPTIONS = {
  Address: "map-pin",
  Email: "envelope",
  Github: "github",
  Linkedin: "linkedin",
  "Phone number": "phone",
  Website: "globe",
  "": "id-card",
};

export const getContactIcon = (value) => {
  return CONTACTPICKER_OPTIONS[value] || "id-card";
};

export const DEFAULT_CONTACT_INFO = [
  {
    name: "linkedin.com/in/janedoe",
    resume: { _id: "-1" },
    value: "Linkedin",
    id: "-100",
    items: [],
  },
  {
    name: "github.com/janedoe",
    resume: { _id: "-1" },
    value: "Github",
    id: "-101",
    items: [],
  },
  {
    name: "janedoe@example.com",
    resume: { _id: "-1" },
    value: "Email",
    id: "-102",
    items: [],
  },
];

// All categories that can be picked from
export const ALL_CATEGORIES = [
  {
    title: "Accomplishments",
    type: "Full",
    isGoingText: "I am currently working on this",
  },
  {
    title: "Certificates",
    type: "Title and date",
  },
  {
    title: "Education",
    type: "Full",
    isGoingText: "I am currently studying here",
  },
  {
    title: "Hobbies",
    type: "Title only",
  },
  {
    title: "Languages",
    type: "Title and value",
  },
  {
    title: "Personal Projects",
    type: "Full",
    isGoingText: "I am currently working on this",
  },
  {
    title: "Skills",
    type: "Title and value",
  },
  {
    title: "Volunteer experience",
    type: "Full",
    isGoingText: "I am currently volunteering here",
  },
  {
    title: "Work experience",
    type: "Full",
    isGoingText: "I am currently working here",
  },
];

export const getCategoryIsGoingText = (title) => {
  const na = ALL_CATEGORIES.find((x) => x.title === title);
  return na ? na.isGoingText : "I am currently working here";
};

export const getCategoryType = (title) => {
  const na = ALL_CATEGORIES.find((x) => x.title === title);
  return na ? na.type : "Full";
};

// Used when creating a new resume
export const DEFAULT_CATEGORIES = [
  {
    title: "Work experience",
    type: "Full",
    sidebar: false,
    items: [],
    id: 1,
  },
  {
    title: "Education",
    type: "Full",
    sidebar: false,
    items: [],
    id: 2,
  },
  {
    title: "Certificates",
    type: "Title and date",
    sidebar: false,
    items: [],
    id: 3,
  },
  {
    title: "Skills",
    type: "Title and value",
    sidebar: true,
    items: [],
    id: 4,
  },
  {
    title: "Languages",
    type: "Title and value",
    sidebar: true,
    items: [],
    id: 5,
  },
];

// Category types, that is, which fields they should have
export const CATEGORY_TYPES = [
  "Full",
  "Title and date",
  "Title and value",
  "Description only",
];

export const getCategoryItems = (category) => {
  const DEFAULT_ITEMS = ["id", "categoryId", "items"];
  switch (category.toLowerCase()) {
    case "title and date":
      return [...DEFAULT_ITEMS, "title", "month1", "year1"];
    case "title and value":
      return [...DEFAULT_ITEMS, "title", "value"];
    case "description only":
      return [...DEFAULT_ITEMS, "description"];
    case "title without value":
    case "title only":
      return [...DEFAULT_ITEMS, "title"];
    default:
      return [
        ...DEFAULT_ITEMS,
        "title",
        "location",
        "month1",
        "year1",
        "month2",
        "year2",
        "description",
      ];
  }
};

// Dummy item to display when a category has no item yet
export const getDummyItem = (category) => {
  switch (category.toLowerCase()) {
    case "work experience":
      return {
        title: "Sample Job",
        location: "Pear Inc.",
        description:
          "This is an example of a resume item. Click on this item to set your own item!",
      };
    case "education":
      return {
        title: "Sample School",
        location: "Orange & Apple Public School",
        description:
          "This is an example of a resume item. Click on this item to set your own item!",
      };
    case "certificates":
      return {
        title: "Certificate name",
      };
    case "skills":
      return {
        title: "Skill",
        value: "4",
      };
    case "languages":
      return {
        title: "Language",
        value: "4",
      };
    case "volunteer experience":
      return {
        title: "Title",
        location: "Location",
      };
    case "awards":
      return {
        title: "Award",
        location: "Institution",
      };
    case "contact info":
      return {
        title: "Click to add",
        value: "Contact information",
      };
    default:
      return {
        title: "Sample item",
      };
  }
};

// Dummy resume to show in previews when the user has no resume yet
export const DUMMY_RESUME = {
  ...RESUME_DEFAULTS,
  _id: "-1",
  title: "DummyResume",
  jobTitle: "Job Title",
  bio:
    "This is an example resume. It is made to demonstrate what your resume will look like if you choose this template. You can always change the template later.",
  primaryColor: "",
  templateId: "TEMPLATE0",
  data: {
    categories: DEFAULT_CATEGORIES,
    contactInfo: DEFAULT_CONTACT_INFO,
  },
};

export const getDummyResume = (template) => {
  // Deep copy to prevent bugs :/
  let result = JSON.parse(JSON.stringify(DUMMY_RESUME));
  result = convertToTemplate(result, template);
  return result;
};

export const convertToTemplate = (resume, template) => {
  return {
    ...resume,
    data: {
      ...resume.data,
      categories: resume.data.categories.map((cat) => {
        if (cat.type === "Title and value") {
          return { ...cat, type: template.skills.type };
        } else {
          return cat;
        }
      }),
    },
  };
};

export const VALUE_DESCRIPTIONS = [
  {
    value: "1",
    description: "Basic",
  },
  {
    value: "2",
    description: "Skilled",
  },
  {
    value: "3",
    description: "Intermediate",
  },
  {
    value: "4",
    description: "Advanced",
  },
  {
    value: "5",
    description: "Expert",
  },
];

// Give description for each value (1-5)
export const getValueDescription = (value) => {
  const val = VALUE_DESCRIPTIONS.find((x) => x.value === value);
  return val
    ? val.description
    : VALUE_DESCRIPTIONS.find((x) => x.value === "3").description;
};
