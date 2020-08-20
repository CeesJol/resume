export const TEMPLATES = [
  {
    id: "MyTemplate",
    name: "My Template",
    style:
      ".MyTemplate .resume__category--name, .MyTemplate .resume__contact-info--icon { color: rgb(62, 207, 142) } \n .MyTemplate .resume__item--title-and-value { background-color: rgb(62, 207, 142) }",
    sidebar: 0,
  },
  {
    id: "AnotherTemplate",
    name: "Another Template",
    style:
      ".AnotherTemplate .resume__category--name, .AnotherTemplate .resume__contact-info--icon { color: red }",
    sidebar: 50,
  },
];

export const getTemplate = (templateId) => {
  return TEMPLATES.find((template) => template.id === templateId);
};
