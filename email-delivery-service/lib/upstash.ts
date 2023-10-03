import { EmailDeliveryRequest, QStashMessage } from './types'

const { QSTASH_TOKEN, QSTASH_URL } = Bun.env

if (!QSTASH_TOKEN) {
  throw new Error('QSTASH_TOKEN is required')
}

if (!QSTASH_URL) {
  throw new Error('QSTASH_URL is required')
}

type Topic =
  | 'EmailDeliveryService_emailsToSanitize'
  | 'EmailDeliveryService_emailsToSend'
  | 'EmailDeliveryService_importantEmailsToSanitize'
  | 'EmailDeliveryService_importantEmailsToSend'

export async function publishMessage(
  topic: Topic,
  message: EmailDeliveryRequest
): Promise<QStashMessage> {
  return await fetch(`${QSTASH_URL}/${topic}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${QSTASH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  }).then((res) => res.json())
}
