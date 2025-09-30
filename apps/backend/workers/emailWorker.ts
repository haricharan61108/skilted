import { Queue, Worker } from "bullmq";
import { redis } from "../utils/redis.ts";
import nodemailer from "nodemailer";

export const emailQueue = new Queue("emailQueue", { connection: redis as any});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

new Worker(
  "emailQueue",
  async (job) => {
    if (job.name === "sendAcceptance") {
      const { email, jobTitle } = job.data;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Application was Accepted 🎉",
        text: `Congrats! Your application for "${jobTitle}" has been accepted by the admin.`,
      });

      console.log(`✅ Email sent to ${email}`);
    }
  },
  { connection: redis as any }
);