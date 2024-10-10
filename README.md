# Common Tongue

Common Tongue is a rich text editor application designed for creating and editing rich text documents. Built using React and TypeScript, it leverages the Tiptap editor framework for core functionalities. The application offers various text formatting options and supports extensions like highlighting, task lists, and more. It includes both a "Pro" version with advanced features requiring a paid subscription and a "Free" version with basic functionalities. The application aims to provide a user-friendly interface for rich text editing, with optional collaboration features through Tiptap Cloud.

## Overview

Common Tongue utilizes a modern web development stack to deliver a robust and efficient rich text editing experience. The key technologies used in the project include:

- **Frontend**: React and TypeScript for building the user interface.
- **Build Tool**: Vite for fast and optimized build processes.
- **Code Quality**: ESLint for maintaining code quality and consistency.
- **Rich Text Editor**: Tiptap for core rich text editing functionalities.
- **Icons**: Remixicon for menu bar icons.
- **Styling**: Sass for styling, including the implementation of the sticky editor header and the `editor__footer` div for displaying the character count.
- **Analytics**: Vercel Analytics for monitoring application performance and user interactions.

### Project Structure

- **Main Directory**: Contains configuration files and scripts for setting up and building the project.
- **src Directory**: Contains the main editor application, including components, styles, configurations, and analytics integration.
  - **Components**: Custom components like MenuBar, BubbleMenu, and DropdownMenu.
  - **Styles**: Sass files for styling various components and the editor interface.
  - **Configurations**: TypeScript and Vite configuration files.

## Features

1. **Rich Text Editing**:
    - Create and edit rich text documents with formatting options like bold, italic, underline, strikethrough, code, highlight, and text color (red).
    - Add headings, paragraphs, bullet lists, ordered lists, task lists, code blocks, blockquotes, horizontal rules, and hard breaks.
    - Placeholder text "Write a short paragraph..." when the editor is empty.
    - Seamless user experience with no border highlighting on the placeholder focus.
    - Easy access to text formatting options via a menu bar.

2. **Character Count**:
    - Displays character count under the text editor in a new `editor__footer` div.

3. **Task Lists**:
    - Create task lists with individual task items that can be checked off.

4. **Pro and Free Versions**:
    - Supports both Pro and Free versions, with a script to convert the Pro version to the Free version by removing references to Pro features.

5. **Collaboration (Optional)**:
    - Optional collaboration features through Tiptap Cloud, configurable via environment variables.

6. **GitHub Actions for Packaging**:
    - GitHub Actions workflows to package and release both Pro and Free versions of the editor.

7. **Tiptap Bubble Menu with "Fix Grammar" Button**:
    - Integrated Bubble Menu with a "Fix Grammar" button for grammar improvement suggestions, configured to appear below the selected text.

8. **Vercel Analytics Integration**:
    - Integrates Vercel Analytics for real-time performance monitoring and user interaction tracking.

9. **Sticky Editor Header**:
    - Ensures the editor header stays at the top of the page, making text formatting options always accessible.

## Getting Started

### Requirements

- Node.js and npm are required to run the project.

### Quickstart

1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd common-tongue
   ```

2. **Set up the Tiptap registry**:
   Follow the provided instructions to configure the Tiptap registry.

3. **Convert to the Free version** (if necessary):
   ```sh
   npm run convert-to-free
   ```

4. **Install dependencies**:
   ```sh
   npm install
   ```

5. **Enable collaboration features** (optional):
   Configure the necessary environment variables in `.env.local`.

6. **Integrate Vercel Analytics**:
   Follow the provided setup guide for Vercel Analytics.

7. **Launch the development server**:
   ```sh
   npm run dev
   ```

### License

The project is proprietary. Copyright (c) 2024.

---

This README file provides a comprehensive overview of the Common Tongue project, its features, and instructions for getting started. For more detailed information, refer to the individual files and documentation within the project.