export const MAX_NUMBER_OF_RESUMES = 10;
export const SIDEBAR_INCREMENT = 1000;
export const COOKIE_MAX_AGE = 3600 * 24 * 30; // 30 days, in seconds

export const DEFAULT_LAYOUT_ITEMS = [
  {
    name: "Primary Color",
    value: "",
  },
];

export const CONTACTPICKER_OPTIONS = {
  Linkedin: "linkedin",
  Github: "github",
  Email: "envelope",
  "Phone number": "phone",
};

export const DUMMY_RESUME = {
  _id: "-1",
  title: "DummyResume",
  jobTitle: "Job Title",
  bio:
    "This is an example resume. It is made to demonstrate what your resume will look like if you choose this template. You can always change the template later.",
  categories: {
    data: [
      {
        items: null,
        name: "Education",
        priority: 1,
        _id: "-10",
      },
      {
        items: null,
        name: "Work experience",
        priority: 2,
        _id: "-11",
      },
    ],
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
  template: {
    _id: "-1000",
    name: "MyTemplate",
    style:
      ".MyTemplate .resume__category--name, .MyTemplate .…__contact-info--icon {↵ color: rgb(220, 90, 45)↵}",
  },
};

export const DEFAULT_CATEGORIES = [
  {
    name: "Work experience",
    type: "Full",
  },
  {
    name: "Education",
    type: "Full",
  },
  {
    name: "Certificates",
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
export const CATEGORY_TYPES = ["Full", "Title and date", "Title and value"];
export const DEFAULT_CATEGORIES_SIDEBAR_CUTOFF = 3; // Move categories to sidebar starting from this index

export const GET_CATEGORY_ITEMS = (category) => {
  switch (category.toLowerCase()) {
    case "title and date":
      return ["title", "month1", "year1"];
    case "title and value":
      return ["title", "value"];
    default:
      return [
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
