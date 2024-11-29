# Common Tongue

Common Tongue is an advanced proofreading and text enhancement tool that leverages a chain of specialized AI agents to provide comprehensive text improvements. The tool processes text through three distinct stages:

1. **Line Editor**: Improves readability and coherence while maintaining the author's voice
2. **Copy Editor**: Corrects grammatical errors, punctuation, spelling, and syntax issues
3. **Proofreader**: Performs final polishing and ensures publication-ready quality

Built with React and TypeScript, it features a modern rich text editor powered by Tiptap, offering a familiar writing experience with professional editing capabilities. The application supports:

- Multi-language grammar correction
- Asynchronous text processing with real-time status updates
- Advanced formatting options
- Character count tracking
- Customizable editing preferences

## Tech Stack & Frameworks

### Core Technologies

- **TypeScript** - Primary programming language
- **React 18.2** - Frontend framework
- **Vite** - Build tool and development server

### Editor & UI Components

- **Tiptap** - Rich text editor framework with extensions:
  - Character Count
  - Highlight
  - Placeholder
  - Underline
  - Text Style
  - Color
  - Focus
- **Remixicon** - Icon library for the UI

### AWS Infrastructure

- **AWS Amplify** - Full-stack development framework
- **AWS Lambda** - Serverless functions for text processing
- **API Gateway** - REST API management
- **AWS CDK** - Infrastructure as Code
- **Amazon SQS** - Message queuing for async processing
- **DynamoDB** - Status and result storage

### AI/ML Integration

- **LangChain** - Framework for LLM applications
- **OpenAI GPT-4** - Language model integration

### Styling

- **Sass** - CSS preprocessor
- **CSS Modules** - Scoped styling solution

### Development Tools

- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting rules

### Testing & Quality

- **React Testing Library** - Component testing
- **ESLint** - Code quality and consistency

### Package Management

- **npm** - Package management
- **Node.js** - JavaScript runtime

### Version Control

- **Git** - Version control system

### Development Environment

- **Node.js** - JavaScript runtime environment
- **npm** - Package manager

## Project Structure

The key directories and their purposes:

- **amplify/**: AWS Amplify backend configuration

  - **functions/**: Lambda functions for text processing
    - **grammarAPI/**: API endpoint for initiating text processing
    - **grammarProcessor/**: SQS message handler for async processing
    - **grammarStatus/**: Status checking endpoint
  - **data/**: DynamoDB table definitions and schemas
  - **backend.ts**: Main backend configuration
  - **amplifyconfiguration.ts**: Frontend AWS configuration

- **src/**: Main source code directory

  - **components/**: React components
    - **common/**: Reusable components
    - **toolbars/**: Editor toolbar components
  - **lib/**: Core library code
    - **LLMs/**: Language model integrations
      - **agents/**: AI model configurations
      - **prompts/**: System prompts for AI models
      - **workflows/**: Processing pipelines
  - **services/**: API service implementations
    - **grammar/**: Grammar processing service
  - **styles/**: SCSS stylesheets
    - **editor/**: Editor-specific styles
    - **global/**: Global styles
  - **types/**: TypeScript type definitions
  - **utils/**: Utility functions
    - **backoff.ts**: Exponential backoff implementation
    - **rateLimiter.ts**: Rate limiting utilities

- **public/**: Static assets
- **.env**: Environment variables (not in repo)
- **vite.config.ts**: Vite configuration
- **tsconfig.json**: TypeScript configuration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git
- AWS Account (for deployment)

### Environment Setup

1. **Clone the repository**:

   ```sh
   git clone <repository-url>
   cd common-tongue
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory with the following variables:

   ```sh
   VITE_API_ENDPOINT=<your-api-endpoint>
   VITE_AWS_REGION=<your-aws-region>
   OPENAI_API_KEY=<your-openai-api-key>
   CORS_ORIGIN=<your-frontend-origin>
   ```

3. **Install dependencies**:
   ```sh
   npm install
   ```

### Development

- **Start development server**:

  ```sh
   npm run dev
  ```

  The application will be available at `http://localhost:5173`

- **Lint code**:
  ```sh
  npm run lint
  ```

### Building for Production

1. **Build the application**:

   ```sh
   npm run build
   ```

2. **Preview production build**:
   ```sh
   npm run preview
   ```

### Deployment

The project uses AWS Amplify for deployment. Make sure you have:

1. AWS Amplify CLI installed and configured
2. Appropriate AWS credentials set up

To deploy:

```sh
npx ampx pipeline-deploy --branch main --app-id <your-app-id>
```

### Troubleshooting

- If you encounter CORS issues during development, check your AWS API Gateway CORS settings
- For OpenAI API issues, verify your API key and rate limits
- For build errors, ensure all dependencies are properly installed and environment variables are set
- If text processing seems stuck, check the AWS SQS queue and DynamoDB tables for processing status
- For timeout issues, verify the Lambda function timeout settings match your processing needs

## License

Copyright © 2024 Common Tongue

All rights reserved. This software and its source code are proprietary and confidential. No part of this software may be reproduced, distributed, or transmitted in any form or by any means, including photocopying, recording, or other electronic or mechanical methods, without the prior written permission of the copyright holder.

This software is provided "as is," without warranty of any kind, express or implied. The copyright holder assumes no liability for any damages or claims arising from the use of this software.

For licensing inquiries, please contact: [flo@commontongue.co](mailto:flo@commontongue.co)
