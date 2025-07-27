
# Lessons Learned

*   State management for draggable items requires careful handling of mouse events on the `window` object to prevent losing track of the cursor when it moves outside the element.
*   For streaming UI updates, it's crucial to correctly identify and append to the last message in the state array to avoid creating new message bubbles for each chunk.
*   Managing chat history per-agent is efficiently handled by creating separate `Chat` instances from the Gemini SDK and storing them in a `Map`.
*   A global `zIndex` counter in the `App` component is the simplest way to manage the stacking order of floating panels.
