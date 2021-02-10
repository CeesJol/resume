export const TEMPLATES = [
  // {
  //   id: The unique identifier for this resume (String, unique, no spaces)
  //   name: The name displayed for this resume (String)
  //   sidebar: Sidebar percentage (Int) (Duplicated in SCSS file)
  //   skillsWithValue: Should skills display a value?
  //   contactInfo: where contact info is placed (TOP | SIDEBAR)
  //   styles: customizable layout styles (Object)
  // },
  {
    id: "Classic",
    name: "Classic",
    sidebar: 0,
    skills: {
      type: "Description only",
    },
    header: {
      bioBelowContactInfo: true,
    },
    contactInfo: {
      place: "TOP",
      drawName: false,
      drawIcons: false,
    },
    styles: {
      primaryColor: "black",
      backgroundColor: "white",
    },
  },
  {
    id: "FireRed",
    name: "Fire Red",
    sidebar: 50,
    skills: {
      type: "Title without value",
    },
    header: {
      headerBelowContactInfo: false,
    },
    contactInfo: {
      place: "TOP",
      drawName: false,
      drawIcons: true,
    },
    styles: {
      primaryColor: "rgb(200, 20, 50)",
      backgroundColor: "white",
    },
  },
  {
    id: "NavyBlue",
    name: "Navy Blue",
    sidebar: 33,
    skills: {
      type: "Title and value",
    },
    header: {
      headerBelowContactInfo: false,
    },
    contactInfo: {
      place: "SIDEBAR",
      drawName: true,
      drawIcons: false,
    },
    styles: {
      primaryColor: "rgb(46, 49, 69)",
      backgroundColor: "rgb(46, 49, 69)",
    },
  },
];

export const getTemplate = (templateId) => {
  return TEMPLATES.find((template) => template.id === templateId);
};
