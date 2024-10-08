# Common-Tongue

Common-Tongue is a rich text editor application designed for creating and editing rich text documents. Built using React and TypeScript, it leverages the Tiptap editor framework for its core functionalities. It includes both a "Pro" version with advanced features and a "Free" version with basic functionalities. The application aims to provide a user-friendly interface for rich text editing, with optional collaboration features.

## Overview

Common-Tongue is architected using modern web technologies to ensure a robust and scalable application. The key technologies used include:

- **Frontend**: React and TypeScript
- **Build Tool**: Vite for fast and optimized build processes
- **Code Quality**: ESLint for maintaining code quality and consistency
- **Rich Text Editor**: Tiptap for core rich text editing functionalities
- **Icons**: Remixicon for menu bar icons
- **Styling**: Sass for styling

### Project Structure

- **Main Directory**: Contains configuration files and scripts for setting up and building the project.
- **src Directory**: Contains the main editor application, including components, styles, and configurations.

### Editor Configuration

- **Extensions**: Configured with various Tiptap extensions including Highlight, TaskItem, TaskList, Placeholder, Underline, TextStyle, Color, and a custom extension for toggling text color. A Bubble Menu extension is also included to support the "Fix Grammar" feature.
- **Menu Bar**: Includes buttons for various text formatting options. The "Fix Grammar" button is integrated to enhance text editing capabilities.
- **Custom Text Color**: A custom extension is defined to toggle text color between a default and a specified color.

### Development and Build

- **Scripts**: Defined in `package.json` for running the development server (`npm run dev`), building the project (`npm run build`), linting the code (`npm run lint`), and previewing the build (`npm run preview`).
- **TypeScript Configuration**: Defined in `tsconfig.json` and `tsconfig.node.json`.
- **Vite Configuration**: Defined in `vite.config.ts` to configure Vite, including adding the React plugin.

### GitHub Actions

- **Workflow**: Defined in `.github/workflows/pack-blockeditor.yml` for packaging and releasing both Pro and Free versions of the editor.

## Features

1. **Rich Text Editing**:
    - Create and edit rich text documents with formatting options like bold, italic, underline, strikethrough, code, highlight, and text color (red).
    - Add headings, paragraphs, bullet lists, ordered lists, task lists, code blocks, blockquotes, horizontal rules, and hard breaks.
    - Placeholder text "Write a short paragraph..." when the editor is empty.
    - Seamless user experience without highlighting borders when focusing on the placeholder.
    - Menu bar for easy access to text formatting options.

2. **Character Count**:
    - Configurable character count extension to limit the number of characters in the document.
    - Character count displayed under the text editor.

3. **Task Lists**:
    - Create task lists with individual task items that can be checked off.

4. **Pro and Free Versions**:
    - Pro version with advanced features and Free version with basic functionalities.
    - Script provided to convert the Pro version to the Free version by removing references to Pro features.

5. **Collaboration (Optional)**:
    - Collaboration features through Tiptap Cloud, configurable via environment variables.

6. **GitHub Actions for Packaging**:
    - Workflows to package and release both Pro and Free versions of the editor.

7. **Tiptap Bubble Menu with "Fix Grammar" Button**:
    - Integrated Bubble Menu with a "Fix Grammar" button providing grammar improvement suggestions.
    - Configured to appear below the selected text using `tippyOptions`.

## Getting Started

### Requirements

- Node.js
- npm

### Quickstart

1. Clone the repository and navigate to the project directory.
2. Install dependencies using `npm install`.
3. Launch the development server using `npm run dev`.

### License

The project is proprietary (not open source). 

```
© 2024. All rights reserved.
```
