// "use server";
// import { google } from "googleapis";

// export async function getSheetData(
//   gclid: string,
//   value: string,
//   email: string,
//   phone: string,
//   sessionId: string
// ) {
//   const glAuth = await google.auht.getClient({
//     projectID: process.env.GOOGLE_PROJECT_ID,
//     credentials: process.env.GOOGLE_SHEETS_ACCOUNT_KEY,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//   });

//   const sheets = google.sheets({ version: "v4", auth: glAuth });

//   const data = await sheets.spreadsheets.values.append({
//     spreadsheetId: process.env.GOOGLE_SHEET_ID,
//     range: "Sheet1!A1",
//     valueInputOption: "USER_ENTERED",
//     resource: {
//       values: [[gclid, value, email, phone, sessionId]],
//     },
//   });
// }

// type Props = {
//   gclid: string;
//   value: string;
//   email: string;
//   phone: string;
//   sessionId: string;
// };

// export async function addToGoogleSheets(
//   gclid: string,
//   value: string,
//   email: string,
//   phone: string,
//   sessionId: string
// ) {
//   const data = await sheets.spreadsheets.values.append({
//     spreadsheetId: process.env.GOOGLE_SHEET_ID,
//     range: "Sheet1!A1",
//     valueInputOption: "USER_ENTERED",
//     resource: {
//       values: [[gclid, value, email, phone, sessionId]],
//     },
//   });
// }
