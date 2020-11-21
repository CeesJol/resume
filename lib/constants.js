export const MAX_NUMBER_OF_RESUMES = 10;
export const COOKIE_MAX_AGE = 3600 * 24 * 30; // 30 days, in seconds

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
    priority: 1,
    resume: { _id: "-1" },
    value: "Linkedin",
    _id: "-100",
  },
  {
    name: "github.com/janedoe",
    priority: 2,
    resume: { _id: "-1" },
    value: "Github",
    _id: "-101",
  },
  {
    name: "janedoe@example.com",
    priority: 3,
    resume: { _id: "-1" },
    value: "Email",
    _id: "-102",
  },
];

// All categories that can be picked from
export const ALL_CATEGORIES = [
  {
    name: "Accomplishments",
    type: "Full",
    isGoingText: "I am currently working on this",
  },
  {
    name: "Certificates",
    type: "Title and date",
  },
  {
    name: "Education",
    type: "Full",
    isGoingText: "I am currently studying here",
  },
  {
    name: "Hobbies",
    type: "Title only",
  },
  {
    name: "Languages",
    type: "Title and value",
  },
  {
    name: "Personal Projects",
    type: "Full",
    isGoingText: "I am currently working on this",
  },
  {
    name: "Skills",
    type: "Title and value",
  },
  {
    name: "Volunteer experience",
    type: "Full",
    isGoingText: "I am currently volunteering here",
  },
  {
    name: "Work experience",
    type: "Full",
    isGoingText: "I am currently working here",
  },
];

export const getCategoryIsGoingText = (name) => {
  const na = ALL_CATEGORIES.find((x) => x.name === name);
  return na ? na.isGoingText : "I am currently working here";
};

export const getCategoryType = (name) => {
  const na = ALL_CATEGORIES.find((x) => x.name === name);
  return na ? na.type : "Full";
};

// Used when creating a new resume
export const DEFAULT_CATEGORIES = [
  {
    name: "Work experience",
    type: "Full",
    sidebar: false,
    priority: 1,
  },
  {
    name: "Education",
    type: "Full",
    sidebar: false,
    priority: 2,
  },
  {
    name: "Certificates",
    type: "Title and date",
    sidebar: false,
    priority: 3,
  },
  {
    name: "Skills",
    type: "Title and value",
    sidebar: true,
    priority: 1,
  },
  {
    name: "Languages",
    type: "Title and value",
    sidebar: true,
    priority: 2,
  },
];

// Category types, that is, which fields they should have
export const CATEGORY_TYPES = ["Full", "Title and date", "Title and value"];

export const getCategoryItems = (category) => {
  const DEFAULT_ITEMS = ["_id", "category", "title", "priority"];
  switch (category.toLowerCase()) {
    case "title and date":
      return [...DEFAULT_ITEMS, "month1", "year1"];
    case "title and value":
      return [...DEFAULT_ITEMS, "value"];
    case "title without value":
    case "title only":
      return DEFAULT_ITEMS;
    default:
      return [
        ...DEFAULT_ITEMS,
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
        name: "Click to add",
        value: "Contact information",
      };
    default:
      return {
        title: "Sample item",
      };
  }
};

// Added to each new resume
export const RESUME_SKELETON = {
  categories: {
    data: DEFAULT_CATEGORIES,
  },
  primaryColor: "",
  contactInfo: {
    data: [],
  },
};

// Dummy resume to show in previews when the user has no resume yet
export const DUMMY_RESUME = {
  _id: "-1",
  title: "DummyResume",
  jobTitle: "Job Title",
  bio:
    "This is an example resume. It is made to demonstrate what your resume will look like if you choose this template. You can always change the template later.",
  categories: {
    data: DEFAULT_CATEGORIES,
  },
  primaryColor: "",
  contactInfo: {
    data: DEFAULT_CONTACT_INFO,
  },
  templateId: "TEMPLATE0",
};

export const convertToTemplate = (array, template) => {
  return array.map((cat) => {
    if (template.skillsWithValue === false && cat.type === "Title and value") {
      return { ...cat, type: "Title without value" };
    } else {
      return cat;
    }
  });
};

export const getDummyResume = (template) => {
  return {
    ...DUMMY_RESUME,
    categories: {
      data: convertToTemplate(DUMMY_RESUME.categories.data, template),
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

export const sortByPriority = (list) => {
  return list.sort((item1, item2) => {
    return item1.priority < item2.priority ? -1 : 1;
  });
};
