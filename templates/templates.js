export const TEMPLATES = [
  {
    id: "MyTemplate",
    name: "My Template",
    sidebar: 50,
  },
  {
    id: "AnotherTemplate",
    name: "Another Template",
    sidebar: 50,
  },
];

export const getTemplate = (templateId) => {
  return TEMPLATES.find((template) => template.id === templateId);
};
