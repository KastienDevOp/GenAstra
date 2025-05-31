# GenAstra: Chatbot with Local Storage and Individual Chat Deletion

![GenAstra Logo](public/logo.png)

GenAstra is a powerful chatbot application that allows users to have multiple chat sessions, delete individual chats, and store chat history locally using JSON. This project is built with modern web technologies and offers a clean, intuitive user interface.

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

- Multiple chat sessions
- Delete individual chats
- Local storage of chat history using JSON
- Each chat has its own separate history
- Modern and responsive UI
- Easy to use and customize

## Installation

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

- **Frontend**: Vue.js, TypeScript, Tailwind CSS
- **State Management**: Vuex
- **Local Storage**: IndexedDB, LocalStorage
- **Build Tool**: Vite
- **Package Manager**: npm, yarn, pnpm

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
