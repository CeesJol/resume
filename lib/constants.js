export const defaultCategories = ["Work experience", "Education"];

export const contactpickerOptions = {
	"Linkedin": "linkedin",
	"Github": "github",
	"Email": "envelope",
	"Phone number": "phone"
}

export const getDummyItem = (category) => {
  switch (category) {
    case "work experience":
      return {
        title: "Sample Job",
        location: "Pear Inc.",
        from: "07/2017",
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

// export const dummyItems = {
//   "work experience": {
//     title: "Sample Job",
//     location: "Pear Inc.",
//     from: "07/2017",
//     to: "Present",
//     description:
//       "This is an example of a resume item. Click on this item to set your own item!",
//   },
//   other: {
//     title: "Sample item",
//     location: "Sample location",
//     from: "07/2017",
//     to: "Present",
//     description:
//       "This is an example of a resume item. Click on this item to set your own item!",
//   },
// };
