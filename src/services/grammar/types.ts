// Interface representing the response from the grammar API
export interface GrammarAPIResponse {
  editedText: string; // The corrected text returned by the API
  error?: string; // Optional error message if something goes wrong
}
