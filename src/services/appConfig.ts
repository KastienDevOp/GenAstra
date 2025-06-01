import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { Config, db } from './database'

export const currentModel = useLocalStorage('currentModel', 'none')
export const historyMessageLength = useLocalStorage('historyMessageLength', 10)
export const enableMarkdown = useLocalStorage('markdown', true)
export const showSystem = useLocalStorage('systemMessages', true)
export const baseUrl = useLocalStorage('baseUrl', 'http://localhost:11434/api')
export const isDarkMode = useLocalStorage('darkMode', true)
export const isSettingsOpen = useLocalStorage('settingsPanelOpen', true)
export const isSystemPromptOpen = useLocalStorage('systemPromptOpen', false)
export const avatarUrl = useLocalStorage('avatarUrl', '')
export const gravatarEmail = useLocalStorage('gravatarEmail', '')
export const toggleSettingsPanel = () => (isSettingsOpen.value = !isSettingsOpen.value)
export const toggleSystemPromptPanel = () =>
  (isSystemPromptOpen.value = !isSystemPromptOpen.value)

// Database Layer
export const configDbLayer = {
  async getConfig(model: string) {
    const filteredConfig = await db.config.where('model').equals(model).limit(1)
    return filteredConfig.first()
  },

  async getCurrentConfig(model: string) {
    let config = await this.getConfig(model)
    if (!config?.systemPrompt) {
      config = await this.getConfig('default')
    }
    return config
  },

  async setConfig(config: Config) {
    await db.config.put(config)
  },

  async clearConfig() {
    return db.config.clear()
  },
}

export function useConfig() {
  const setConfig = async (newConfig: Config) => {
    newConfig.id = await generateIdFromModel(newConfig.model)
    await configDbLayer.setConfig(newConfig)
  }

  const getCurrentSystemMessage = async () => {
    let config = await configDbLayer.getCurrentConfig(currentModel.value)
    if (!config) {
      // If no config exists, create a default one
      await configDbLayer.setConfig({
        model: 'default',
        systemPrompt: '',
        createdAt: new Date(),
      })
      return ''
    }
    return config.systemPrompt ?? ''
  }

  const generateIdFromModel = async (model: string): Promise<number> => {
    let hash = 0
    for (let i = 0; i < model.length; i++) {
      hash += model.charCodeAt(i)
    }
    return hash
  }

  const initializeConfig = async (model: string) => {
    try {
      let modelConfig = await configDbLayer.getConfig(model)
      let defaultConfig = await configDbLayer.getConfig('default')

      // If no model config exists, create a default one
      if (!modelConfig) {
        modelConfig = {
          model: model,
          systemPrompt: '',
          createdAt: new Date(),
        }
        modelConfig.id = await generateIdFromModel(model)
        await configDbLayer.setConfig(modelConfig)
      }

      // If no default config exists, create one
      if (!defaultConfig) {
        defaultConfig = {
          model: 'default',
          systemPrompt: '',
          createdAt: new Date(),
        }
        defaultConfig.id = await generateIdFromModel('default')
        await configDbLayer.setConfig(defaultConfig)
      }

      return { modelConfig: modelConfig, defaultConfig: defaultConfig }
    } catch (error) {
      console.error('Failed to initialize config:', error)
    }
    return null
  }

  return {
    initializeConfig,
    setConfig,
    getCurrentSystemMessage,
  }
}
