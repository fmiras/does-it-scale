import { sleep } from 'bun'
import { EmailDeliveryRequest } from '../lib/types'
import { publishMessage } from '../lib/upstash'

async function applyOrthographyFix(
  emailRequest: EmailDeliveryRequest
): Promise<EmailDeliveryRequest> {
  // TODO do async http request to OpenAI GPT instead
  await sleep(3000)
  return emailRequest
}

async function sanitizeAndPublish(emailRequest: EmailDeliveryRequest): Promise<void> {
  const sanitizedEmailRequest = await applyOrthographyFix(emailRequest)
  console.log('Email sanitized. ', sanitizedEmailRequest)
  const message = await publishMessage('EmailDeliveryService_emailsToSend', sanitizedEmailRequest)
  console.log(`Message ${message.messageId} created and dispatched to URL ${message.url}.`)
}

const server = Bun.serve({
  port: 3011,
  async fetch(req: Request) {
    const emailRequest = await req.json<EmailDeliveryRequest>()
    // we don't await here because we don't care about the result
    // of the dispatch, we just want to queue it up and move on
    // if failure is possible, we should queue it up in a dead letter queue
    sanitizeAndPublish(emailRequest)
    return new Response('Sanitizing email.')
  }
})

console.log(`Server running on ${server.hostname}:${server.port}`)
