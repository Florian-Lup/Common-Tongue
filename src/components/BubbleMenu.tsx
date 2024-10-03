const handleFixGrammar = async () => {
  console.log("handleFixGrammar called");
  const selectedText = editor.state.selection.content().content.textBetween(0, editor.state.selection.content().size, ' ');
  console.log("Selected text:", selectedText);

  if (!selectedText.trim()) {
    console.error('Error fixing grammar: No text selected');
    alert('Please select some text to fix grammar.');
    return;
  }

  const requestBody = {
    inputs: {
      manuscript: selectedText // Use the selected text as manuscript
    },
    version: "^1.0" // Version as recommended by Wordware
  };

  console.log("Request body:", JSON.stringify(requestBody));

  try {
    // Call the Vercel serverless function
    const response = await fetch('/api/fixGrammar', {  // Call the proxy
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody), // Send the correct body
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error('Failed to fix grammar');
    }

    const result = await response.json();
    console.log(result.improved_text);

    if (result.improved_text && result.improved_text.length > 0) {
      editor.chain().focus().setTextSelection(editor.state.selection).insertContent(result.improved_text).run();
      console.log("Grammar suggestion applied:", result.improved_text);
    } else {
      console.log("No grammar suggestions received");
    }
  } catch (error) {
    console.error('Error fixing grammar:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    } else {
      console.error('Unknown error:', error);
    }
  }
};
