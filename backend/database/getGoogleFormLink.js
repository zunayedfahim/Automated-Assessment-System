const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const handler = {};

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/gmail.send",
  ],
});

// Create Google Form
const createGoogleForm = async (sheetData, assessmentName) => {
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

  return { formLink: res.data.responderUri, formId: res.data.formId };
};

// Get Google Sheet Data
const getSheetData = async (googleSheet1, googleSheet2) => {
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

  let rubrics = rubricsSheet.data.values.map((item, index) => ({
    question: item[0],
    level: item[1],
    marks: item[2],
  }));

  //   Remove the first element from question array
  rubrics.shift();

  rubrics = [
    {
      question: "Name",
      level: 0,
      marks: 0,
    },
    {
      question: "ID",
      level: 0,
      marks: 0,
    },
    {
      question: "Email",
      level: 0,
      marks: 0,
    },
    ...rubrics,
  ];

  return {
    emails,
    rubrics,
  };
};

const sendMail = async (emails, formLink, assessmentName, deadline) => {
  const CLIENT_ID =
    "1033870808730-fl6905bcqfrijcn5l6sbmfhcjeqt11cq.apps.googleusercontent.com";
  const CLIENT_SECRET = "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";
  const REDIRECT_URI = "https://developers.google.com/oauthplayground/";
  const REFRESH_TOKEN =
    "1//046GRRSUP3_GtCgYIARAAGAQSNwF-L9IrDpRsHp9Hp8-rBo_bTJV5n9bdTFK46kurKJL_uQfwGYTKBqcDP-q7vt4_hAKwI1ax04M";

  // Set up OAuth2 client
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN,
  });

  const accessToken = await oAuth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "fahimzunayed@gmail.com",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: "Automated Assessment <automated-assessments@automated-assessment.iam.gserviceaccount.com>",
    to: `${emails.join(", ")}`,
    subject: "Fillup the Assessment Form",
    text: `This is your ${assessmentName} form. Submit it before ${new Date(
      deadline
    ).toDateString()}. ${formLink}`,
  };

  const info = await transport.sendMail(mailOptions);
  return info.messageId;
};

// sendMail();

handler.getGoogleFormLink = async (
  googleSheet1,
  googleSheet2,
  assessmentName,
  deadline
) => {
  // Parse the spreadsheetId
  googleSheet1 = googleSheet1.split("/")[5];
  googleSheet2 = googleSheet2.split("/")[5];

  // Connect to google sheets
  // return sheetData in { emails, rubrics }
  const sheetData = await getSheetData(googleSheet1, googleSheet2);

  // Create the google form
  const formRes = await createGoogleForm(sheetData, assessmentName);

  // Mail the form to the students
  const mailSent = await sendMail(
    sheetData.emails,
    formRes.formLink,
    assessmentName,
    deadline
  );
  return { formLink: formRes.formLink, formId: formRes.formId };
};

module.exports = handler;
