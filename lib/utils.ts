import {createTransport } from "nodemailer"

export const transporter = createTransport({
    service: "gmail",
    auth: {
     user: process.env.FROM_EMAIL!,
     pass: process.env.FROM_EMAIL_PASSWORD!,
    }
   });