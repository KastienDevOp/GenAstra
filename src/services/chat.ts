import { computed, ref } from 'vue'
import { Chat, Message } from './database'
import { historyMessageLength, currentModel, useConfig } from './appConfig'
import { useAI } from './useAI.ts'
import { ChatCompletedResponse, ChatPartResponse, useApi } from './api.ts'
import { dbAdapter, initDbAdapter } from './dbAdapter'

interface ChatExport extends Chat {
  messages: Message[]
}

// State
const chats = ref<Chat[]>([])
const activeChat = ref<Chat | null>(null)
const messages = ref<Message[]>([])
const systemPrompt = ref<Message>()
const ongoingAiMessages = ref<Map<number, Message>>(new Map())

// Database Layer - Now using dbAdapter which handles both IndexedDB and Qdrant
const dbLayer = {
  // Initialize the database adapter
  async init() {
    try {
      await initDbAdapter();
      return true;
    } catch (error) {
      console.error('Failed to initialize database adapter:', error);
      return false;
    }
  },

  // Chat operations
  async getAllChats() {
    return dbAdapter.getAllChats();
  },

  async getChat(chatId: number) {
    return dbAdapter.getChat(chatId);
  },

  async getMessages(chatId: number) {
    return dbAdapter.getMessages(chatId);
  },

  async addChat(chat: Chat) {
    return dbAdapter.addChat(chat);
  },

  async updateChat(chatId: number, updates: Partial<Chat>) {
    return dbAdapter.updateChat(chatId, updates);
  },

  async addMessage(message: Message) {
    return dbAdapter.addMessage(message);
  },

  async updateMessage(messageId: number, updates: Partial<Message>) {
    return dbAdapter.updateMessage(messageId, updates);
  },

  async deleteChat(chatId: number) {
    return dbAdapter.deleteChat(chatId);
  },

  async deleteMessage(messageId: number) {
    return dbAdapter.deleteMessage(messageId);
  },

  async deleteMessagesOfChat(chatId: number) {
    return dbAdapter.deleteMessagesOfChat(chatId);
  },

  async clearChats() {
    return dbAdapter.clearAllData();
  },

  async clearMessages() {
    return dbAdapter.clearAllData();
  },

  // Migration utility
  async migrateToQdrant() {
    try {
      await dbAdapter.migrateToQdrant();
      return true;
    } catch (error) {
      console.error('Migration to Qdrant failed:', error);
      return false;
    }
  }
}

export function useChats() {
  const { generate } = useAI()
  const { abort } = useApi()

  // Computed
  const sortedChats = computed<Chat[]>(() =>
    [...chats.value].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  )
  const hasActiveChat = computed(() => activeChat.value !== null)
  const hasMessages = computed(() => messages.value.length > 0)

  // Methods for state mutations
  const setActiveChat = (chat: Chat) => (activeChat.value = chat)
  const setMessages = (newMessages: Message[]) => (messages.value = newMessages)

  const initialize = async () => {
    try {
      chats.value = await dbLayer.getAllChats()
      if (chats.value.length > 0) {
        await switchChat(sortedChats.value[0].id!)
      } else {
        await startNewChat('New chat')
      }
    } catch (error) {
      console.error('Failed to initialize chats:', error)
    }
  }

  const switchChat = async (chatId: number) => {
    try {
      const chat = await dbLayer.getChat(chatId)
      if (chat) {
        setActiveChat(chat)
        const chatMessages = await dbLayer.getMessages(chatId)
        setMessages(chatMessages)
        if (activeChat.value) {
          await switchModel(activeChat.value.model)
        }
      }
    } catch (error) {
      console.error(`Failed to switch to chat with ID ${chatId}:`, error)
    }
  }

  const switchModel = async (model: string) => {
    currentModel.value = model
    if (!activeChat.value) return

    try {
      await dbLayer.updateChat(activeChat.value.id!, { model })
      activeChat.value.model = model
    } catch (error) {
      console.error(`Failed to switch model to ${model}:`, error)
    }
  }

  const renameChat = async (newName: string) => {
    if (!activeChat.value) return

    activeChat.value.name = newName
    await dbLayer.updateChat(activeChat.value.id!, { name: newName })
    chats.value = await dbLayer.getAllChats()
  }

  const startNewChat = async (name: string) => {
    const newChat: Chat = {
      name,
      model: currentModel.value,
      createdAt: new Date(),
    }

    try {
      newChat.id = await dbLayer.addChat(newChat)
      chats.value.push(newChat)
      setActiveChat(newChat)
      setMessages([])
      await addSystemMessage(await useConfig().getCurrentSystemMessage())
    } catch (error) {
      console.error('Failed to start a new chat:', error)
    }
  }

  const addSystemMessage = async (content: string | null, meta?: any) => {
    if (!activeChat.value) return
    if (!content) return

    const systemPromptMessage: Message = {
      chatId: activeChat.value.id!,
      role: 'system',
      content,
      meta,
      createdAt: new Date(),
    }

    systemPromptMessage.id = await dbLayer.addMessage(systemPromptMessage)
    messages.value.push(systemPromptMessage)

    systemPrompt.value = systemPromptMessage
  }

  const addUserMessage = async (content: string) => {
    if (!activeChat.value) {
      console.warn('There was no active chat.')
      return
    }

    const currentChatId = activeChat.value.id!
    const message: Message = {
      chatId: activeChat.value.id!,
      role: 'user',
      content,
      createdAt: new Date(),
    }

    try {
      message.id = await dbLayer.addMessage(message)
      messages.value.push(message)

      await generate(
        currentModel.value,
        messages.value,
        systemPrompt.value,
        historyMessageLength.value,
        (data) => handleAiPartialResponse(data, currentChatId),
        (data) => handleAiCompletion(data, currentChatId),
      )
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          ongoingAiMessages.value.delete(currentChatId)
          return
        }
      }

      console.error('Failed to add user message:', error)
    }
  }

  const regenerateResponse = async () => {
    if (!activeChat.value) return
    const currentChatId = activeChat.value.id!
    const message = messages.value[messages.value.length - 1]
    if (message && message.role === 'assistant') {
      if (message.id) await dbLayer.deleteMessage(message.id)
      messages.value.pop()
    }
    try {
      await generate(
        currentModel.value,
        messages.value,
        systemPrompt.value,
        historyMessageLength.value,
        (data) => handleAiPartialResponse(data, currentChatId),
        (data) => handleAiCompletion(data, currentChatId),
      )
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          ongoingAiMessages.value.delete(currentChatId)
          return
        }
      }
      console.error('Failed to regenerate response:', error)
    }
  }

  const handleAiPartialResponse = (data: ChatPartResponse, chatId: number) => {
    ongoingAiMessages.value.has(chatId)
      ? appendToAiMessage(data.message.content, chatId)
      : startAiMessage(data.message.content, chatId)
  }

  const handleAiCompletion = async (data: ChatCompletedResponse, chatId: number) => {
    const aiMessage = ongoingAiMessages.value.get(chatId)
    if (aiMessage) {
      try {
        ongoingAiMessages.value.delete(chatId)
      } catch (error) {
        console.error('Failed to finalize AI message:', error)
      }
    } else {
      console.error('no ongoing message to finalize:')
      debugger
    }
  }

  const wipeDatabase = async () => {
    try {
      await dbLayer.clearChats()
      await dbLayer.clearMessages()

      // Reset local state
      chats.value = []
      activeChat.value = null
      messages.value = []
      ongoingAiMessages.value.clear()

      await startNewChat('New chat')
    } catch (error) {
      console.error('Failed to wipe the database:', error)
    }
  }

  const deleteChat = async (chatId: number) => {
    try {
      await dbLayer.deleteChat(chatId)
      await dbLayer.deleteMessagesOfChat(chatId)

      chats.value = chats.value.filter((chat) => chat.id !== chatId)

      if (activeChat.value?.id === chatId) {
        if (sortedChats.value.length) {
          await switchChat(sortedChats.value[0].id!)
        } else {
          await startNewChat('New chat')
        }
      }
    } catch (error) {
      console.error(`Failed to delete chat with ID ${chatId}:`, error)
    }
  }

  const deleteMessage = async (messageId: number) => {
    if (!activeChat.value) return

    try {
      await dbLayer.deleteMessage(messageId)

      // Remove the message from the current chat's messages
      messages.value = messages.value.filter((message) => message.id !== messageId)

      // If this was the last message in the chat, clear the chat
      if (messages.value.length === 0) {
        await startNewChat('New chat')
      }
    } catch (error) {
      console.error(`Failed to delete message with ID ${messageId}:`, error)
    }
  }

  const startAiMessage = async (initialContent: string, chatId: number) => {
    const message: Message = {
      chatId: chatId,
      role: 'assistant',
      content: initialContent,
      createdAt: new Date(),
    }

    try {
      message.id = await dbLayer.addMessage(message)
      ongoingAiMessages.value.set(chatId, message)
      messages.value.push(message)
    } catch (error) {
      console.error('Failed to start AI message:', error)
    }
  }

  const appendToAiMessage = async (content: string, chatId: number) => {
    const aiMessage = ongoingAiMessages.value.get(chatId)
    if (aiMessage) {
      aiMessage.content += content
      try {
        await dbLayer.updateMessage(aiMessage.id!, { content: aiMessage.content })

        // Only "load the messages" if we are on this chat atm.
        if (chatId == activeChat.value?.id) {
          setMessages(await dbLayer.getMessages(chatId))
        }
      } catch (error) {
        console.error('Failed to append to AI message:', error)
      }
    } else {
      console.log('No ongoing AI message?')
    }
  }

  const exportChats = async () => {
    const chats = await dbLayer.getAllChats()
    const exportData: ChatExport[] = []
    await Promise.all(chats.map(async chat => {
      if (!chat?.id) return
      const messages = await dbLayer.getMessages(chat.id)
      exportData.push(Object.assign({ messages }, chat))
    }))
    return exportData
  }

  const importChats = async (jsonData: ChatExport[]) => {
    jsonData.forEach(async chatData => {
      const chat: Chat = {
        name: chatData?.name,
        model: chatData?.model,
        createdAt: new Date(chatData?.createdAt || chatData.messages[0].createdAt),
      }
      chat.id = await dbLayer.addChat(chat)
      chats.value.push(chat)
      chatData.messages.forEach(async messageData => {
        const message: Message = {
          chatId: chat.id!,
          role: messageData.role,
          content: messageData.content,
          createdAt: new Date(messageData.createdAt),
        }
        await dbLayer.addMessage(message)
      })
    })
  }

  return {
    chats,
    sortedChats,
    activeChat,
    messages,
    hasMessages,
    hasActiveChat,
    renameChat,
    switchModel,
    startNewChat,
    switchChat,
    deleteChat,
    deleteMessage,
    addUserMessage,
    regenerateResponse,
    addSystemMessage,
    initialize,
    wipeDatabase,
    abort,
    exportChats,
    importChats,
  }
}
