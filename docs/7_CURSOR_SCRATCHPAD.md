
# Developer Scratchpad

*   Break out system support for multiple model providers. (Future consideration)
*   Sketch event handling for panel drag/drop.
    *   `mousedown` on header to initiate drag.
    *   `mousemove` on window to update position.
    *   `mouseup` on window to end drag.
    *   Same logic for resize handle.
*   Plan layout persistence via `localStorage` or IndexedDB. (Future consideration)
*   Manage z-index to bring focused panel to the front. A counter in the parent `App` component is a good approach.
