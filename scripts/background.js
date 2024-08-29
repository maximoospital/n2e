let contextMenuCreated = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "createContextMenu" && !contextMenuCreated) {
      contextMenuCreated = true;
      chrome.contextMenus.create({
        id: "n2e-convert",
        title: "Convert this support ID",
        contexts: ["selection"],
        documentUrlPatterns: ["<all_urls>"] // Adjust this pattern to limit where the context menu appears
      });
    } else if (request.action === "removeContextMenu" && contextMenuCreated) {
        contextMenuCreated = false;
      chrome.contextMenus.remove("n2e-convert");
    }
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "n2e-convert" && info.selectionText) {
      let selectedText = info.selectionText;
      // Remove all - from the selected text
      let cleanupSelectedText = selectedText.replace(/-/g, '');
      if (cleanupSelectedText.length===21) {
        // Send the converted text back to the content script and send the rect of the selected text
        chrome.tabs.sendMessage(tab.id, {action: "convertText", text: cleanupSelectedText});
      } else {
          alert("The selected text does not contain 21 digits.");
      }
    }
  });