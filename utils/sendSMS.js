import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const sendSMS = async (to, message) => {
  if (!to) return;
  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to,
  });
};

export default sendSMS;
