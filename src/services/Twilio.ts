import twilio from 'twilio'
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message'

const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILLIO_AUTH_TOKEN

const twilioClient = twilio(accountSid, authToken)

export interface TwilioMessage {
    body: string
}

export default class TwilioService {
    sendSms = async (message: TwilioMessage): Promise<MessageInstance> =>
        twilioClient.messages.create({
            body: message.body,
            from: '+17192497041',
            to: '+17192444351',
        })
}
