export const TEMPLATES = [
  // {
  // 	id: The unique identifier for this resume (String, unique, no spaces)
  //  name: The name displayed for this resume (String)
  //  sidebar: Does this resume use a sidebar? (Boolean)
  //  skillsWithValue: Should skills display a value?
  //  contactInfo: where contact info is placed (TOP | SIDEBAR)
  // },
  {
    id: "SimpleGreen",
    name: "Simple Green",
    sidebar: true,
    skillsWithValue: false,
    contactInfo: "TOP",
  },
  {
    id: "NavyBlue",
    name: "Navy Blue",
    sidebar: true,
    skillsWithValue: true,
    contactInfo: "SIDEBAR",
  },
];

export const getTemplate = (templateId) => {
  return TEMPLATES.find((template) => template.id === templateId);
};
