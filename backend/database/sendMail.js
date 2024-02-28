const { google } = require("googleapis");

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

// FIXME: create form method
const createGoogleForm = async () => {
  // testing email
  const emails = ["fahimzunayed@gmail.com", "nuruddin.zunayed@northsouth.edu"];

  const auth = new google.auth.GoogleAuth({
    keyFile: "../credentials.json",
    scopes: "https://www.googleapis.com/auth/forms.body",
  });

  const client = await auth.getClient();

  const googleForms = google.forms({ version: "v1", auth: client });

  // Define your form structure
  const formDefinition = {
    title: "Assessment1",
  };

  const res = await googleForms.forms.create({
    resource: {
      info: {
        title: "Assessment56",
        documentTitle: "Automated Assessment",
      },
    },
  });
  console.log(res.data);
};

const sendMail = async (googleSheet1, googleSheet2) => {
  // TODO: Parse the spreadsheetId
  googleSheet1 = googleSheet1.split("/")[5];
  googleSheet2 = googleSheet2.split("/")[5];

  // TODO: Connect to google sheets
  const sheetData = await getSheetData(googleSheet1, googleSheet2);

  // TODO: Create the google form
  // TODO: Mail the form to the students
};

// sendMail(
//   "https://docs.google.com/spreadsheets/d/18l3z_n03uKZgIU0pcNv-9mjm-ErwPCqLbgzcn1DtOvw/edit#gid=0",
//   "https://docs.google.com/spreadsheets/d/1K_TleWr3lIN2AxodRGd_jxF748oqPfxp_bSpONQ2u9U/edit#gid=0"
// );

// export default sendMail;

createGoogleForm();
