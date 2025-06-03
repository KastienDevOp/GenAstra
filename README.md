# GenAstra: AI-Powered Chatbot with Vector Search

![GenAstra Logo](public/logo.png)

GenAstra is an advanced chatbot application that enables seamless conversations with AI. It features multiple chat sessions, local storage with IndexedDB, and powerful vector-based semantic search using Qdrant. Built with modern web technologies, GenAstra offers a clean, intuitive interface with enhanced search capabilities.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Technologies Used](#technologies-used)
5. [Project Structure](#project-structure)
6. [Contributing](#contributing)
7. [License](#license)
8. [Contact](#contact)

## Features

- **Conversation Management**
  - Multiple, independent chat sessions
  - Delete individual chats or clear all history
  - Responsive design for all devices

- **Advanced Search**
  - Semantic search across all conversations
  - Vector similarity search powered by Qdrant
  - Fast and accurate message retrieval

- **Data Storage**
  - Local storage with IndexedDB (Dexie.js)
  - Optional Qdrant vector database integration
  - Automatic data migration between storage backends

- **Developer Friendly**
  - TypeScript support
  - Modern Vue 3 composition API
  - Easy configuration via environment variables

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- (Optional) Docker for local Qdrant instance

### Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
# Qdrant Configuration
VITE_QDRANT_URL=http://localhost:6333  # Default local Qdrant URL

# For Qdrant Cloud (uncomment and update)
# VITE_QDRANT_URL=https://your-cluster-url.aws.qdrant.cloud
# VITE_QDRANT_API_KEY=your-api-key-here

# Optional: Override default collection names
# VITE_QDRANT_CHAT_COLLECTION=chats
# VITE_QDRANT_MESSAGE_COLLECTION=messages
```

### Qdrant Setup

1. **Local Development** (using Docker):
   ```bash
   docker run -d -p 6333:6333 -p 6334:6334 qdrant/qdrant
   ```

2. **Qdrant Cloud** (production):
   - Create an account at [Qdrant Cloud](https://cloud.qdrant.io/)
   - Create a new cluster and get your API key
   - Update the environment variables accordingly

For detailed setup instructions, see [QDRANT_SETUP.md](QDRANT_SETUP.md)

### Installation

To get a local copy up and running follow these simple steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/KastienDevOp/GenAstra.git
   ```

2. Navigate to the project directory:
   ```bash
   cd GenAstra
   ```

3. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Open the application in your browser.
2. Create a new chat by clicking the "New Chat" button.
3. Start typing your messages in the chat input field.
4. To delete a chat, click the trash icon next to the chat name.
5. Your chat history will be stored locally in your browser.

## Technologies Used

- **Frontend**
  - [Vue 3](https://vuejs.org/) - Progressive JavaScript Framework
  - [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
  - [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
  - [Pinia](https://pinia.vuejs.org/) - Intuitive Vuex alternative
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

- **Data Storage**
  - [Qdrant](https://qdrant.tech/) - Vector similarity search engine
  - [Dexie.js](https://dexie.org/) - IndexedDB wrapper
  - [@qdrant/js-client-rest](https://github.com/qdrant/qdrant-js) - Qdrant JavaScript client

- **Development Tools**
  - [ESLint](https://eslint.org/) - Code linting
  - [Prettier](https://prettier.io/) - Code formatting
  - [Docker](https://www.docker.com/) - Containerization

## Vector Database Integration

This application uses Qdrant as a vector database to enable semantic search and efficient retrieval of chat history. Key features include:

- Semantic search across all chats
- Hybrid storage with fallback to IndexedDB
- Efficient similarity search for finding related conversations

For detailed setup and configuration, see [QDRANT_SETUP.md](QDRANT_SETUP.md)

## Project Structure

```
├── public/
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── ChatInput.vue
│   │   ├── ChatMessage.vue
│   │   ├── ChatMessages.vue
│   │   ├── ModelSelector.vue
│   │   ├── Settings.vue
│   │   ├── Sidebar.vue
│   │   ├── SystemPrompt.vue
│   │   ├── History/
│   │   │   ├── ExportButton.vue
│   │   │   └── ImportButton.vue
│   │   ├── Inputs/
│   │   │   ├── TextInput.vue
│   │   │   └── ToggleInput.vue
│   │   ├── Messages/
│   │   │   ├── AiMessage.vue
│   │   │   ├── SystemMessage.vue
│   │   │   └── UserMessage.vue
│   ├── services/
│   │   ├── api.ts
│   │   ├── appConfig.ts
│   │   ├── chat.ts
│   │   ├── database.ts
│   │   ├── useAI.ts
│   ├── utils.ts
│   ├── App.vue
│   ├── main.ts
│   ├── style.css
│   └── vite-env.d.ts
├── .gitignore
├── .nvmrc
├── .prettierrc
├── index.html
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── yarn.lock
└── README.md
```

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE.md` for more information.

## Contact

Your Name - [@your_twitter](https://twitter.com/your_twitter) - your_email@example.com

Project Link: [https://github.com/KastienDevOp/GenAstra](https://github.com/KastienDevOp/GenAstra)
