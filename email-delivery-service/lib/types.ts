export interface EmailDeliveryRequest {
  to: string
  from: string
  subject: string
  body: string
  highPriority?: boolean
}

export interface QStashMessage {
  messageId: string
  url: string
}
