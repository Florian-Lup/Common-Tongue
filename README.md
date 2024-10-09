```markdown
# Common-Tongue

Common-Tongue is a rich text editor application designed for creating and editing rich text documents. It is built using React and TypeScript, leveraging the Tiptap editor framework for its core functionalities. The application provides various text formatting options and supports extensions like highlighting, task lists, and more. The project includes both a "Pro" version with advanced features that require a paid subscription and a "Free" version with basic functionalities. The application aims to offer a user-friendly interface for rich text editing, with optional collaboration features through Tiptap Cloud.

## Overview

Common-Tongue is developed using modern web technologies to ensure a seamless and efficient user experience. The key technologies used in the project include:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Vite**: A fast and optimized build tool for modern web projects.
- **ESLint**: A tool for identifying and fixing problems in JavaScript code.
- **Tiptap**: A headless rich text editor framework for React.
- **Remixicon**: A set of open-source icons for use in web projects.
- **Sass**: A CSS preprocessor that adds power and elegance to the basic language.

### Project Structure

- **Main Directory**: Contains configuration files and scripts for setting up and building the project.
- **`src` Directory**: Contains the main editor application, including components, styles, configurations, and analytics integration.
- **Configuration Files**: Includes `.env.local`, `.eslintrc.cjs`, `.gitignore`, `package.json`, `tsconfig.json`, `tsconfig.node.json`, and `vite.config.ts`.

## Features

1. **Rich Text Editing**:
    - Various formatting options: bold, italic, underline, strikethrough, code, highlight, and text color (red).
    - Structural elements: headings, paragraphs, bullet lists, ordered lists, task lists, code blocks, blockquotes, horizontal rules, and hard breaks.
    - Placeholder text: "Write a short paragraph..." displayed when the editor is empty.
    - Menu bar for easy access to text formatting options.
    - Sticky editor header for always accessible formatting options.

2. **Character Count**:
    - Displays the character count under the text editor.

3. **Task Lists**:
    - Create task lists with individual task items that can be checked off.

4. **Pro and Free Versions**:
    - Supports both Pro (advanced features) and Free (basic functionalities) versions.
    - Script provided to convert Pro version to Free version.

5. **Collaboration (Optional)**:
    - Supports collaboration features through Tiptap Cloud, configurable via environment variables.

6. **GitHub Actions for Packaging**:
    - Workflows to package and release both Pro and Free versions of the editor.

7. **Tiptap Bubble Menu with "Fix Grammar" Button**:
    - Integrated Bubble Menu with a "Fix Grammar" button for grammar improvement suggestions.

8. **Vercel Analytics Integration**:
    - Real-time performance monitoring and user interaction tracking.

9. **Sticky Editor Header**:
    - Editor header remains at the top of the page and does not scroll with the page.

## Getting started

### Requirements

- Node.js
- npm

### Quickstart

1. **Clone the Repository**:
    ```sh
    git clone <repository-url>
    cd common-tongue
    ```

2. **Set Up Tiptap Registry**:
    Follow the provided instructions to set up the Tiptap registry.

3. **Convert to Free Version (if necessary)**:
    ```sh
    npm run convert-to-free
    ```

4. **Install Dependencies**:
    ```sh
    npm install
    ```

5. **Enable Collaboration Features (Optional)**:
    Configure the necessary environment variables.

6. **Integrate Vercel Analytics**:
    Follow the provided setup guide.

7. **Launch the Development Server**:
    ```sh
    npm run dev
    ```

### License

The project is proprietary (not open source). All rights reserved. Copyright (c) 2024.
```