// src/extensions/TempMessage.ts
import { Node, mergeAttributes } from '@tiptap/core';

export interface TempMessageOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tempMessage: {
      /**
       * Insert a temporary message into the editor.
       */
      setTempMessage: (attributes?: Partial<TempMessageOptions['HTMLAttributes']>) => ReturnType;
    };
  }
}

export const TempMessage = Node.create<TempMessageOptions>({
  name: 'tempMessage',

  group: 'inline',

  inline: true,

  atom: true,

  selectable: false,

  draggable: false,

  addAttributes() {
    return {
      text: {
        default: 'Generating content...',
        parseHTML: (element) => element.textContent,
        renderHTML: (attributes) => {
          return { 'data-text': attributes.text };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-temp-message]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-temp-message': 'true', class: 'temp-message' }), HTMLAttributes.text];
  },

  addCommands() {
    return {
      setTempMessage:
        (attributes) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: attributes,
          });
        },
    };
  },
});
