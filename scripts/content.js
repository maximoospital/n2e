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
        let selection = window.getSelection();
        let rect = null;

        // Check if the selection is within an input or textarea element
        let activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName.toLowerCase() === 'input' || activeElement.tagName.toLowerCase() === 'textarea')) {
            rect = activeElement.getBoundingClientRect();
        } else if (selection.rangeCount > 0) {
            let range = selection.getRangeAt(0);
            let rects = range.getClientRects();
            if (rects.length > 0) {
                rect = rects[0];
            } else {
                rect = range.getBoundingClientRect();
            }
        }

        if (rect && rect.width > 0 && rect.height > 0) {
            console.log(rect);
            // Create a floating div
            let floatingDiv = document.createElement('div');
            floatingDiv.style.position = 'absolute';
            floatingDiv.style.backgroundColor = 'darkgray';
            floatingDiv.style.color = 'white';
            floatingDiv.style.border = '1px solid black';
            floatingDiv.style.padding = '5px';
            floatingDiv.style.zIndex = '1000';
            floatingDiv.style.borderRadius = '5px';
            floatingDiv.style.boxShadow = '2px 2px 5px black';
            floatingDiv.style.cursor = 'pointer';
            floatingDiv.style.fontFamily = 'Arial, sans-serif';
            floatingDiv.style.width = 'fit-content';

            // Position the floating div under the selected text or input element
            floatingDiv.style.left = `${rect.left + window.scrollX}px`;
            floatingDiv.style.top = `${rect.bottom + window.scrollY}px`;

            // Insert the converted text into the floating div
            floatingDiv.innerText = cleanedConvertedText;

            // Append the floating div to the body
            document.body.appendChild(floatingDiv);

            // Add an event listener to the document to detect clicks outside the floating div
            document.addEventListener('click', function(event) {
                if (!floatingDiv.contains(event.target)) {
                    document.body.removeChild(floatingDiv);
                }
            }, { once: true });
        } else {
            console.error("No bounding rects found for the selected range or input element.");
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

  function convertText(text) {
    // Placeholder for text conversion logic
    let cleanedConvertedText = 'lp_1' + text.slice(0, -1);
    cleanedConvertedText = cleanedConvertedText.toLowerCase();
    return cleanedConvertedText;
}