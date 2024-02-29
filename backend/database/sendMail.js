const { google } = require("googleapis");

// Get Google Sheet Data
const getSheetData = async (googleSheet1, googleSheet2) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "../credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const emailSheet = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: googleSheet1,
    range: "Sheet1!C:C",
  });

  const emails = emailSheet.data.values.flat(1);

  const rubricsSheet = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId: googleSheet2,
    range: "Sheet1",
  });

  const rubrics = rubricsSheet.data.values.map((item, index) => ({
    question: item[0],
    level: item[1],
    marks: item[2],
  }));

  //   Remove the first element from question array
  rubrics.shift();

  return {
    emails,
    rubrics,
  };
};

// Create Google Form
const createGoogleForm = async (sheetData, assessmentName) => {
  // testing email
  const emails = ["fahimzunayed@gmail.com", "nuruddin.zunayed@northsouth.edu"];

  const auth = new google.auth.GoogleAuth({
    keyFile: "../credentials.json",
    scopes: "https://www.googleapis.com/auth/forms.body",
  });

  const client = await auth.getClient();

  const googleForms = google.forms({ version: "v1", auth: client });

  const res = await googleForms.forms.create({
    resource: {
      info: {
        title: assessmentName,
        documentTitle: "Automated Assessment",
      },
    },
  });

  // const data = {
  //   formId: "1eNh5VsLSJJ-dfM8h9Y3oZJ5bovc1-6LyFAVb1t8AoLU",
  //   info: { title: "Assessment56", documentTitle: "Automated Assessment" },
  //   revisionId: "00000002",
  //   responderUri:
  //     "https://docs.google.com/forms/d/e/1FAIpQLSf5oJ_eJZ8_-x-H0OuFKsHIROlZl9YxKLsDpvWIUFoHQAZu4Q/viewform",
  // };

  const payload = sheetData.rubrics.map((item, index) => ({
    createItem: {
      item: {
        questionItem: {
          question: {
            textQuestion: {
              paragraph: true,
            },
          },
        },
        title: item.question,
      },
      location: {
        index: index,
      },
    },
  }));

  const resUpdate = await googleForms.forms.batchUpdate({
    formId: res.data.formId,
    resource: {
      requests: payload,
    },
  });

  // Get the form by id
  // const resUpdate = await googleForms.forms.get({
  //   formId: data.formId,
  // });

  return res.data.responderUri;
};

const sendMail = async (googleSheet1, googleSheet2, assessmentName) => {
  // Parse the spreadsheetId
  googleSheet1 = googleSheet1.split("/")[5];
  googleSheet2 = googleSheet2.split("/")[5];

  // Connect to google sheets
  // return sheetData in { emails, rubrics }
  const sheetData = await getSheetData(googleSheet1, googleSheet2);

  // Create the google form
  // const formLink = await createGoogleForm(sheetData, assessmentName);

  const formLink =
    "https://docs.google.com/forms/d/e/1FAIpQLScDnuc_Nhq4sSGNx1yAu9VzsGtfn03Uq4raf-9C6xdJHGSEVQ/viewform";
  // TODO: Mail the form to the students
};

sendMail(
  "https://docs.google.com/spreadsheets/d/18l3z_n03uKZgIU0pcNv-9mjm-ErwPCqLbgzcn1DtOvw/edit#gid=0",
  "https://docs.google.com/spreadsheets/d/1K_TleWr3lIN2AxodRGd_jxF748oqPfxp_bSpONQ2u9U/edit#gid=0",
  "Assessment789"
);

// export default sendMail;

// createGoogleForm();
