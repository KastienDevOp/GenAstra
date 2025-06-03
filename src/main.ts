import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { initDbAdapter } from './services/dbAdapter'

// Initialize the database adapter
initDbAdapter().then(() => {
  console.log('Database adapter initialized')
}).catch(error => {
  console.error('Failed to initialize database adapter:', error)
})

createApp(App).mount('#app')
