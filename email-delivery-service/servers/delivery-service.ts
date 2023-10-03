import { sleep } from 'bun'
import { EmailDeliveryRequest } from '../lib/types'

// Mock email delivery
async function sendEmail(emailRequest: EmailDeliveryRequest): Promise<void> {
  await sleep(1000)
  console.log('Email sent. ', emailRequest)
}

const server = Bun.serve({
  port: 3012,
  async fetch(req: Request) {
    const emailRequest = await req.json<EmailDeliveryRequest>()
    // we don't await here because we don't care about the result
    // of the dispatch, we just want to queue it up and move on
    // if failure is possible, we should queue it up in a dead letter queue
    sendEmail(emailRequest)
    return new Response('Email processing.')
  }
})

console.log(`Server running on ${server.hostname}:${server.port}`)
