export const TEMPLATES = [
  // {
  // 	id: The unique identifier for this resume (String, unique, no spaces)
  //  name: The name displayed for this resume (String)
  //  sidebar: The percentage of the width of the sidebar (0-100)
  //  contactInfo: where contact info is placed (TOP | SIDEBAR)
  // },
  {
    id: "MyTemplate",
    name: "My Template",
    sidebar: 50,
    contactInfo: "TOP",
  },
  {
    id: "AnotherTemplate",
    name: "Another Template",
    sidebar: 33,
    contactInfo: "SIDEBAR",
  },
];

export const getTemplate = (templateId) => {
  return TEMPLATES.find((template) => template.id === templateId);
};
