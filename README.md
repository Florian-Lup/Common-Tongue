# Common Tongue

Common-Tongue is a rich text editor application designed for creating and editing rich text documents. Built using React and TypeScript, it leverages the Tiptap editor framework for core functionalities. The application offers various text formatting options and supports extensions such as character count, highlighting, task lists, and more. It includes both a "Pro" version with advanced features requiring a paid subscription and a "Free" version with basic functionalities. The application aims to provide a user-friendly interface for rich text editing, with optional collaboration features through Tiptap Cloud.

## Overview

Common-Tongue is architected using modern web technologies to ensure a robust and scalable solution for rich text editing. The key technologies used in this project include:

- **Frontend**: React and TypeScript for building the user interface.
- **Build Tool**: Vite for fast and optimized build processes.
- **Code Quality**: ESLint for maintaining code quality and consistency.
- **Rich Text Editor**: Tiptap for core rich text editing functionalities.
- **Icons**: Remixicon for menu bar icons.
- **Styling**: Sass for styling.

### Project Structure

The project is organized into the following main directories and files:

- **Main Project Directory**: Contains configuration files and scripts for setting up and building the project.
- **`src` Directory**: Contains the main editor application, including components, styles, and configurations.
  - **Components**: Contains React components for the editor and its features.
  - **Styles**: Contains Sass files for styling the application.
  - **Configurations**: Contains TypeScript and Vite configuration files.

## Features

1. **Rich Text Editing**:

   - Create and edit rich text documents with various formatting options (bold, italic, underline, etc.).
   - Add headings, paragraphs, bullet lists, ordered lists, task lists, code blocks, blockquotes, horizontal rules, and hard breaks.
   - Placeholder text "Write a short paragraph..." is displayed when the editor is empty.
   - User-friendly menu bar for easy access to text formatting options.

2. **Character Count**:

   - Includes a character count extension that can limit the number of characters in the document.

3. **Task Lists**:

   - Create task lists with individual task items that can be checked off.

4. **Pro and Free Versions**:

   - Supports both a Pro version with advanced features and a Free version with basic functionalities. A script is provided to convert the Pro version to the Free version.

5. **Collaboration (Optional)**:

   - Supports collaboration features through Tiptap Cloud, configurable via environment variables.

6. **GitHub Actions for Packaging**:

   - Includes GitHub Actions workflows to package and release both Pro and Free versions of the editor.

7. **Tiptap Bubble Menu with "Fix Grammar" Button**:
   - Integrated Tiptap Bubble Menu featuring a "Fix Grammar" button for grammar suggestions.

## Getting Started

### Requirements

To run the project, ensure you have the following installed on your computer:

- Node.js
- npm (Node Package Manager)

### Quickstart

Follow these steps to set up and run the project:

1. **Clone the Repository**:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**:

   ```sh
   npm install
   ```

3. **Launch the Development Server**:
   ```sh
   npm run dev
   ```

### License

The project is proprietary and not open source.

```
© 2024 Common Tongue. All rights reserved.
```
