export const TEMPLATES = [
  // {
  //   id: The unique identifier for this resume (String, unique, no spaces)
  //   name: The name displayed for this resume (String)
  //   sidebar: Does this resume use a sidebar? (Boolean)
  //   skillsWithValue: Should skills display a value?
  //   contactInfo: where contact info is placed (TOP | SIDEBAR)
  //   styles: customizable layout styles (Object)
  // },
  {
    id: "SimpleGreen",
    name: "Simple Green",
    sidebar: true,
    skillsWithValue: false,
    contactInfo: "TOP",
    styles: {
      primaryColor: "rgb(62, 207, 142)",
      backgroundColor: "white",
    },
  },
  {
    id: "NavyBlue",
    name: "Navy Blue",
    sidebar: true,
    skillsWithValue: true,
    contactInfo: "SIDEBAR",
    styles: {
      primaryColor: "rgb(46, 49, 69)",
      backgroundColor: "rgb(46, 49, 69)",
    },
  },
];

export const getTemplate = (templateId) => {
  return TEMPLATES.find((template) => template.id === templateId);
};
