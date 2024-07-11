// Detect if the checkbox is checked and store the value in a variable
let checked = false;
document.getElementById('addPrefix').addEventListener('click', function() {
    var checkbox = document.getElementById('addPrefix');
    var isChecked = checkbox.checked;
    checked = isChecked;
    updateOutput();
});

document.getElementById('supportIdInput').addEventListener('input', function() {
    updateOutput();
});

function updateOutput() {
    var outputLabel = document.getElementById('outputValue');
    var inputValue = document.getElementById('supportIdInput').value;
    var cleanedInputValue = inputValue.replace(/-/g, '');
    var cleanedInputValueLength = cleanedInputValue.length;
    if (cleanedInputValueLength === 21) {
        var cleanedInputValue = cleanedInputValue.slice(0, -1);
        cleanedInputValue = cleanedInputValue.toLowerCase();
        if (cleanedInputValue.startsWith('0')) {
            cleanedInputValue = cleanedInputValue.slice(1);
        }
        if (checked) {
            cleanedInputValue = 'lp_1' + cleanedInputValue;
        }
        outputLabel.textContent = cleanedInputValue;
    } else {
        outputLabel.textContent = '';
    }
}

document.getElementById('copyToClipboard').addEventListener('click', function() {
    var outputText = document.getElementById('outputValue').textContent;
    if (outputText) { // Check if there's something to copy
        navigator.clipboard.writeText(outputText).then(function() {
            console.log('Text copied to clipboard');
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
        });
    }
});