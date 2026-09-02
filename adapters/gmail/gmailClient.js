import { google } from "googleapis";
import oauth2Client from "./gmailAuth.js";

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client
});

export default gmail;