// Interface representing the response from the grammar API
export interface GrammarAPIResponse {
  editedText: string; // The corrected text returned by the API
  error?: string; // Optional error message if something goes wrong
}

// Interface for the properties of the ResponsePreview component
export interface ResponsePreviewProps {
  previewText: string; // The text to be displayed in the preview
  isProcessing: boolean; // Indicates if the processing is ongoing
  onAccept: () => void; // Callback function to handle acceptance of the preview
  onDecline: () => void; // Callback function to handle decline of the preview
  onRegenerate: () => void; // Callback function to regenerate the preview
}
