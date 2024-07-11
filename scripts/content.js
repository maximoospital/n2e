document.addEventListener('mouseup', function(e) {
    let selectedText = window.getSelection().toString();
    // Remove all - from the selected text
    let cleanupSelectedText = selectedText.replace(/-/g, '');
    let amountofDigits = cleanupSelectedText.length;
    if (amountofDigits===21) {
        chrome.runtime.sendMessage({action: "createContextMenu"});
    } else {
      chrome.runtime.sendMessage({action: "removeContextMenu"});
    }
  });

// Detect when the background script sends a message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "convertText") {
        // Store the message's text variable
        let convertedText = request.text;
        // Remove the last digit from the converted text
        let cleanedConvertedText = convertedText.slice(0, -1);
        // Remove the first digit if it is a 0
        if (cleanedConvertedText.startsWith('0')) {
            cleanedConvertedText = cleanedConvertedText.slice(1);
        }
        // Add lp_1 to the beginning of the converted text
        cleanedConvertedText = 'lp_1' + cleanedConvertedText;
        // Print the converted text to the console
        console.log(cleanedConvertedText);
        // If there are any uppercase letters in the converted text, convert them to lowercase
        cleanedConvertedText = cleanedConvertedText.toLowerCase();
        // Replace the selected text with the converted text in the page, if it's an input field, it will be replaced with the converted text
        // If the selection is an input field, the value will be replaced with the converted text
        let activeElement = document.activeElement;
        let tagName = activeElement.tagName.toLowerCase();

        // Check if the active element is an input or textarea
        if (tagName === 'input' || tagName === 'textarea') {
            let startPos = activeElement.selectionStart;
            let endPos = activeElement.selectionEnd;
            let selectedText = activeElement.value.substring(startPos, endPos);

            // Check if there is a selection
            if (selectedText) {

            // Replace the selected text with the converted text
            activeElement.value = activeElement.value.substring(0, startPos) + cleanedConvertedText + activeElement.value.substring(endPos);

            // Optionally, adjust the selection to the new text
            activeElement.setSelectionRange(startPos, startPos + cleanedConvertedText.length);
            }
        } else {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);    
            range.deleteContents();
            range.insertNode(document.createTextNode(cleanedConvertedText));    
        }

        // Add the converted text to the clipboard and notify the user using a notification
        navigator.clipboard.writeText(cleanedConvertedText).then(function() {
            console.log('Async: Copying to clipboard was successful!');
            chrome.runtime.sendMessage({action: "showNotification", message: "The converted text has been copied to the clipboard."});
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
            chrome.runtime.sendMessage({action: "showNotification", message: "An error occurred while copying the converted text to the clipboard."});
        });
    }
  });