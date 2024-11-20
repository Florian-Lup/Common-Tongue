# Common Tongue

Common Tongue is a proofreading tool capable of correcting grammatical errors in any language. It was developed by chaining 3 agents, each using a different LLM at varying temperatures. I assigned specific tasks to each agent using a combination of role-playing prompts, zero-shot learning prompts, and direct instruction prompts. Built using React and TypeScript, it leverages the Tiptap editor framework for core writing functionalities. The application offers various text formatting options and supports extensions like highlighting, task lists, and more.

## Overview

Common Tongue utilizes a modern web development stack to deliver a robust and efficient rich text editing experience. The key technologies used in the project include:

- **Frontend**: React and TypeScript for building the user interface.
- **Build Tool**: Vite for fast and optimized build processes.
- **Code Quality**: ESLint for maintaining code quality and consistency.
- **Rich Text Editor**: Tiptap for core rich text editing functionalities.
- **Icons**: Remixicon for menu bar icons.
- **Styling**: Sass for styling, including the implementation of the sticky editor header and the `editor__footer` div for displaying the character count.

### Project Structure

- **Main Directory**: Contains configuration files and scripts for setting up and building the project.
- **src Directory**: Contains the main editor application, including components, styles, configurations, and analytics integration.
  - **Components**: Custom components like MenuBar, BubbleMenu, and DropdownMenu.
  - **Styles**: Sass files for styling various components and the editor interface.
  - **Configurations**: TypeScript and Vite configuration files.

## Getting Started

### Requirements

- Node.js and npm are required to run the project.

### Quickstart

1. **Clone the repository**:

   ```sh
   git clone <repository-url>
   cd common-tongue
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Launch the development server**:
   ```sh
   npm run dev
   ```

### License

The project is proprietary. Copyright (c) 2024.

---

This README file provides a comprehensive overview of the Common Tongue project, its features, and instructions for getting started. For more detailed information, refer to the individual files and documentation within the project.
