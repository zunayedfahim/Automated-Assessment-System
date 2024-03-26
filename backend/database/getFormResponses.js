const { google } = require("googleapis");

const handler = {};

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/forms.responses.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive",
  ],
});

const createSpreadsheet = async (email, sheetName) => {
  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });
  const drive = google.drive({ version: "v3", auth: client });

  const {
    data: { spreadsheetId, spreadsheetUrl },
  } = await googleSheets.spreadsheets.create({
    resource: {
      properties: {
        title: `${sheetName} Result`,
      },
    },
  });

  const res = await drive.permissions.create({
    fileId: spreadsheetId,
    emailMessage: `This is your ${sheetName} Result`,
    resource: {
      role: "writer",
      type: "user",
      emailAddress: email,
    },
  });

  const sheet = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:D",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [["Name", "ID", "Email", "Marks"]],
    },
  });

  return { spreadsheetId, spreadsheetUrl };
};

const appendSpreadsheet = async (
  spreadsheetId,
  studentName,
  studentId,
  studentEmail,
  marks
) => {
  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const sheet = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:D",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[studentName, studentId, studentEmail, marks]],
    },
  });
};

handler.getFormResponses = async (formId, assessmentName, email) => {
  const client = await auth.getClient();

  const googleForms = google.forms({ version: "v1", auth: client });

  const {
    data: { items },
  } = await googleForms.forms.get({
    formId,
  });

  let formDetails = [];

  for (let index = 0; index < items.length; index++) {
    const questionId = items[index].questionItem.question.questionId;
    formDetails.push({ questionId, title: items[index].title });
  }

  const res = await googleForms.forms.responses.list({
    formId,
  });

  const { spreadsheetId, spreadsheetUrl } = await createSpreadsheet(
    email,
    assessmentName
  );

  if (res.data.responses) {
    for (let i = 0; i < res.data.responses.length; i++) {
      let responseDetails = { name: "", id: "", email: "", marks: 0 };
      if (res.data.responses[i].answers) {
        const answers = Object.values(res.data.responses[i].answers);

        for (let j = 0; j < answers.length; j++) {
          let answer = answers[j];
          const { questionId, title } = formDetails.find(
            (a) => a.questionId === answer.questionId
          );
          answer = answer.textAnswers.answers[0].value;

          if (title === "Name") {
            responseDetails.name = answer;
          } else if (title === "ID") {
            responseDetails.id = answer;
          } else if (title === "Email") {
            responseDetails.email = answer;
          } else {
            // TODO: Evaluate the answer
            const payload = { question: title, answer };
            const score = await fetch("http://127.0.0.1:8000/", {
              method: "POST",
              body: JSON.stringify(payload),
              headers: {
                "Content-Type": "application/json",
              },
            });

            const data = await score.json();

            responseDetails.marks += data;
            // const marks = Math.floor(Math.random() * 5) + 1;
          }
        }
      }

      const append = await appendSpreadsheet(
        spreadsheetId,
        responseDetails.name,
        responseDetails.id,
        responseDetails.email,
        responseDetails.marks
      );
    }
  }

  return { spreadsheetId, spreadsheetUrl };

  // Object.values(res.data.responses[0].answers)[0].textAnswers.answers[0].value
};

// getFormResponses("1O_YfhTEGVk03a8gJUY7hQaVjnLdcTdQf8Fqv4HjtTO8");

// createSpreadsheet("Quiz 5");

//  https://docs.google.com/spreadsheets/d/1e8ZZrc2miPnPXKSz5Q36_cLrYL_UTV9lF6x06R1_xJA/edit
// 1e8ZZrc2miPnPXKSz5Q36_cLrYL_UTV9lF6x06R1_xJA
module.exports = handler;
