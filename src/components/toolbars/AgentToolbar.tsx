import React from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";
import "./AgentToolbar.scss";

interface CustomAgentToolbarProps {
  editor: Editor;
  isTyping: boolean;
  isProcessing: boolean;
  onFixGrammar: () => void;
}

const CustomAgentToolbar: React.FC<CustomAgentToolbarProps> = ({
  editor,
  isTyping,
  isProcessing,
  onFixGrammar,
}) => {
  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: "bottom" }}
    >
      <div className="agent-toolbar">
        <button
          onClick={onFixGrammar}
          disabled={isProcessing || isTyping}
          className="agent-toolbar-button"
          aria-label="Proofread"
        >
          {isProcessing || isTyping ? (
            <div className="spinner" aria-label="Loading"></div>
          ) : (
            <svg className="icon" aria-hidden="true">
              <use href={`${remixiconUrl}#ri-eraser-fill`} />
            </svg>
          )}
          Proofread
        </button>
      </div>
    </BubbleMenu>
  );
};

export default CustomAgentToolbar;
