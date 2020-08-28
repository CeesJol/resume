export const TEMPLATES = [
  // {
  // 	id: The unique identifier for this resume (String, unique, no spaces)
  //  name: The name displayed for this resume (String)
  //  sidebar: Does this resume use a sidebar? (Boolean)
  //  contactInfo: where contact info is placed (TOP | SIDEBAR)
  // },
  {
    id: "MyTemplate",
    name: "My Template",
    sidebar: true,
    contactInfo: "TOP",
  },
  {
    id: "AnotherTemplate",
    name: "Another Template",
    sidebar: true,
    contactInfo: "SIDEBAR",
  },
];

export const getTemplate = (templateId) => {
  return TEMPLATES.find((template) => template.id === templateId);
};
