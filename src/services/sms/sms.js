import twilio from "twilio";

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = new twilio(accountSid, authToken);

const sendSms = async ({ body }) =>
  twilioClient.messages.create({
    body,
    from: "+17192497041",
    to: "+17192444351"
  });

const sms = {
  sendSms
};

export default sms;
