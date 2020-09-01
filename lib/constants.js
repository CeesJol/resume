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

// Default layout options for a resume
export const DEFAULT_LAYOUT_ITEMS = [
  {
    name: "Primary Color",
    value: "",
  },
];

// All categories that can be picked from
export const ALL_CATEGORIES = [
  {
    name: "Accomplishments",
    type: "Full",
  },
  {
    name: "Accomplishments",
    type: "Full",
  },
  {
    name: "Certificates",
    type: "Title and date",
  },
  {
    name: "Education",
    type: "Full",
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
    type: "Title and date",
  },
  {
    name: "Skills",
    type: "Title and value",
  },
  {
    name: "Volunteer experience",
    type: "Full",
  },
];

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
    name: "Volunteer experience",
    type: "Full",
    sidebar: true,
    priority: 2,
  },
];

// Category types, that is, which fields they should have
export const CATEGORY_TYPES = ["Full", "Title and date", "Title and value"];

export const GET_CATEGORY_ITEMS = (category) => {
  const DEFAULT_ITEMS = ["_id", "category", "title"];
  switch (category.toLowerCase()) {
    case "title and date":
      return [...DEFAULT_ITEMS, "month1", "year1"];
    case "title and value":
      return [...DEFAULT_ITEMS, "value"];
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
export const GET_DUMMY_ITEM = (category) => {
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
  layout: {
    data: DEFAULT_LAYOUT_ITEMS,
  },
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
  layout: {
    data: DEFAULT_LAYOUT_ITEMS,
  },
  contactInfo: {
    data: [
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
    ],
  },
  templateId: "MyTemplate",
};
