import { EmailDeliveryRequest } from '../lib/types'
import { publishMessage } from '../lib/upstash'

const server = Bun.serve({
  port: 3010,
  async fetch(req: Request) {
    const emailRequest = await req.json<EmailDeliveryRequest>()
    // we're awaiting because we're concerned about dispatch result
    // so we don't complete the request until we know it's been dispatched
    const topic = emailRequest.highPriority
      ? 'EmailDeliveryService_importantEmailsToSanitize'
      : 'EmailDeliveryService_importantEmailsToSend'
    const message = await publishMessage(topic, emailRequest)
    return new Response(
      `Message ${message.messageId} created and dispatched to URL ${message.url}.`
    )
  }
})

console.log(`Server running on ${server.hostname}:${server.port}`)
