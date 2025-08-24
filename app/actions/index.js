"use server";

import EmailTemplate from "@/components/payments/EmailTemplate";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

import {
  createUser,
  findUserByCredentials,
  getEventById,
  updateGoing,
  updateInterest,
} from "@/db/queries";

async function registerUser(formData) {
  const user = Object.fromEntries(formData);
  const created = await createUser(user);

  redirect("/login");
}

async function performLogin(formData) {
  try {
    const credential = {};
    credential.email = formData.get("email");
    credential.password = formData.get("password");
    const found = await findUserByCredentials(credential);
    return found;
  } catch (error) {
    throw error;
  }
}

async function addInterestedEvent(eventId, authId) {
  try {
    await updateInterest(eventId, authId);
  } catch (error) {
    throw error;
  }
  revalidatePath("/");
}

async function addGoingEvent(eventId, user) {
  try {
    await updateGoing(eventId, user?.id);
    await sendEmail(eventId, user);
  } catch (error) {
    throw error;
  }

  revalidatePath("/");
  redirect("/");
}

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

async function sendEmail(eventId, user) {
  try {
    const event = await getEventById(eventId);
    // const resend = new Resend(process.env.RESEND_API_KEY);
    const message = `Dear ${user?.name}, you have been successfully registered for the event, ${event?.name}. Please carry this email and your official id to the venue. We are excited to have you here.`;
    // resend.emails.send({
    //   from: "onboarding@resend.dev",
    //   to: user?.email,
    //   subject: "Successfully Registered for the event!",
    //   react: EmailTemplate({ message }),
    // });

    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: user?.email,
      subject: "Successfully Registered for the event!",
      text: message,
      react: EmailTemplate({ message }),
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    throw error;
  }
}

export { addGoingEvent, addInterestedEvent, performLogin, registerUser };
