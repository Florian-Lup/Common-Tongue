```markdown
# Common-Tongue

Common-Tongue is a rich text editor application designed for creating and editing rich text documents. It is built using React and TypeScript, leveraging the Tiptap editor framework for its core functionalities. The application provides various text formatting options and supports extensions like character count, highlighting, task lists, and more. The project includes both a "Pro" version with advanced features that require a paid subscription and a "Free" version with basic functionalities. The application aims to offer a user-friendly interface for rich text editing, with optional collaboration features through Tiptap Cloud.

## Overview

Common-Tongue is a web application developed using the following technologies:

- **React** for building the user interface.
- **TypeScript** for type-safe JavaScript.
- **Vite** for fast and optimized build processes.
- **ESLint** for maintaining code quality and consistency.
- **Tiptap** for the core rich text editing functionalities.
- **Remixicon** for menu bar icons.
- **Sass** for styling.

The project is structured as follows:

- The main project directory contains configuration files and scripts for setting up and building the project.
- The `src` directory contains the main editor application, including components, styles, and configurations.

## Features

1. **Rich Text Editing**:
    - Users can create and edit rich text documents with various formatting options, including bold, italic, underline, strikethrough, code, highlight, and text color (red).
    - Users can add headings, paragraphs, bullet lists, ordered lists, task lists, code blocks, blockquotes, horizontal rules, and hard breaks.
    - A Tiptap placeholder with the text "Write a short paragraph..." is displayed when the editor is empty.
    - The editor ensures a seamless user experience by not highlighting borders when focusing on the placeholder.
    - The menu bar provides easy access to text formatting options, with an Underline button next to the Italic button and a Text Color button next to the Highlight button. The Code button is placed next to the Code Block button.

2. **Character Count**:
    - The editor includes a character count extension that can be configured to limit the number of characters in the document.

3. **Task Lists**:
    - Users can create task lists with individual task items that can be checked off.

4. **Pro and Free Versions**:
    - The project supports both a Pro version with advanced features and a Free version with basic functionalities. A script is provided to convert the Pro version to the Free version by removing references to Pro features.

5. **Collaboration (Optional)**:
    - The project supports collaboration features through Tiptap Cloud. This feature is optional and can be enabled by configuring the necessary environment variables.

6. **GitHub Actions for Packaging**:
    - The project includes GitHub Actions workflows to package and release both Pro and Free versions of the editor.

7. **Tiptap Bubble Menu with "Fix Grammar" Button**:
    - A Tiptap Bubble Menu is integrated into the editor, featuring a "Fix Grammar" button. This button provides users with suggestions to improve their grammar within the text editor.
    - The Tiptap Bubble Menu is configured to appear below the selected text using the `tippyOptions` provided by Tiptap, which internally uses tippy.js for positioning. Specifically, the placement option is set to 'bottom'.

## Getting started

### Requirements

To run the project, you need to have the following technologies installed on your computer:

- Node.js
- npm (Node Package Manager)

### Quickstart

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd common-tongue
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Launch the development server**:
   ```bash
   npm run dev
   ```

### License

The project is proprietary (not open source). © 2024.
```