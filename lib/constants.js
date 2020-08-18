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
  "Work experience",
  "Education",
  "Certificates",
  "Skills",
  "Volunteer experience",
  "Awards",
];
export const DEFAULT_CATEGORIES_SIDEBAR_CUTOFF = 3; // Move categories to sidebar starting from this index

export const GET_DUMMY_ITEM = (category) => {
  switch (category.toLowerCase()) {
    case "work experience":
      return {
        title: "Sample Job",
        location: "Pear Inc.",
        from: "07/2017",
        to: "Present",
        description:
          "This is an example of a resume item. Click on this item to set your own item!",
      };
    case "education":
      return {
        title: "Sample School",
        location: "Orange & Apple Public School",
        from: "08/2018",
        to: "Present",
        description:
          "This is an example of a resume item. Click on this item to set your own item!",
      };
    default:
      return {
        title: "Sample item",
        location: "Sample location",
        from: "07/2017",
        to: "Present",
        description:
          "This is an example of a resume item. Click on this item to set your own item!",
      };
  }
};
