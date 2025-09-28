import { Worker } from "bullmq";
import IORedis from "ioredis";
import nodemailer from "nodemailer";

const connection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

new Worker(
    "emails",
    async(job) => {
        if(job.name==="sendAcceptance") {
            const { email, jobTitle } = job.data;


            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
               subject: "Your Application was Accepted 🎉",
               text: `Congrats! Your application for "${jobTitle}" has been accepted by the admin.`,
            })

            console.log(`✅ Email sent to ${email}`)
        }
    },
    { connection }
)