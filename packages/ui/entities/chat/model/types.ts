/** 백엔드 ChatRoomResponse와 1:1. companionId로 어떤 동행의 방인지 식별. */
export interface ChatRoom {
  roomId: number
  companionId: number
}

/** 백엔드 ChatMessageResponse와 1:1. */
export interface ChatMessage {
  id: number
  roomId: number
  senderId: number
  content: string
  createdAt: string
}
