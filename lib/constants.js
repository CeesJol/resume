export const defaultCategories = ["Work experience", "Education"];

export const contactpickerOptions = {
  Linkedin: "linkedin",
  Github: "github",
  Email: "envelope",
  "Phone number": "phone",
};

export const dummyResume = {
  _id: "-1",
  title: "DummyResume",
  jobTitle: "Job Title",
  bio: "This is an example resume. It is made to demonstrate what your resume will look like if you choose this template. You can always change the template later.",
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
  contactInfo: {
		data: [
			{
				name: "linkedin.com/in/janedoe",
				priority: 1,
				resume: {_id: "-1"},
				value: "Linkedin",
				_id: "-100",
			},
			{
				name: "github.com/janedoe",
				priority: 2,
				resume: {_id: "-1"},
				value: "Github",
				_id: "-101",
			},
			{
				name: "janedoe@example.com",
				priority: 3,
				resume: {_id: "-1"},
				value: "Email",
				_id: "-102",
			}
		]
	},
  template: {
    _id: "-1000",
    name: "MyTemplate",
    style:
      ".MyTemplate .resume__category--name, .MyTemplate .…__contact-info--icon {↵ color: rgb(220, 90, 45)↵}",
  },
};

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
