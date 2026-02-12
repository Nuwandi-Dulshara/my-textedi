/**
 * Main function to format text.
 */
function formatDoc(cmd, value = null) {
    if (value) {
        document.execCommand(cmd, false, value);
    } else {
        document.execCommand(cmd);
    }
    document.getElementById('editor').focus();
}

/**
 * Feature 1: Image Upload
 * Converts image to Base64 and inserts into editor
 */
function uploadImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Create an image tag with the data URL
            const img = `<img src="${e.target.result}" alt="Inserted Image">`;
            // Insert at cursor position
            document.getElementById('editor').focus();
            document.execCommand('insertHTML', false, img);
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Feature 2: Download as HTML
 */
function downloadFile() {
    const editorContent = document.getElementById('editor').innerHTML;
    const filename = 'my-document.html';
    
    // Wrap content in a basic HTML structure for the downloaded file
    const fullContent = `
        <!DOCTYPE html>
        <html>
        <head><title>My Document</title></head>
        <body style="font-family: sans-serif; padding: 20px;">
            ${editorContent}
        </body>
        </html>`;

    const blob = new Blob([fullContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Feature 3: Fullscreen Mode
 */
function toggleFullScreen() {
    const container = document.getElementById('mainContainer');
    container.classList.toggle('fullscreen');
}

/**
 * Handles adding hyperlinks
 */
function addLink() {
    const url = prompt('Enter the URL:', 'http://');
    if (url) {
        formatDoc('createLink', url);
    }
}

/**
 * Feature 4: Word Count & Reading Time (Enhanced Stats)
 */
const editor = document.getElementById('editor');
const statDisplay = document.getElementById('statDisplay');

editor.addEventListener('input', function() {
    const text = editor.innerText;
    
    // 1. Character Count
    const cleanText = text.replace(/[\u200B-\u200D\uFEFF]/g, ''); 
    const charCount = cleanText.length;

    // 2. Word Count (split by whitespace and filter empty strings)
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

    // 3. Reading Time (Average reading speed = 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    // Update Display
    statDisplay.textContent = `${wordCount} words | ${charCount} chars | ${readingTime} min read`;
});

// Ensures that pressing "Enter" creates a new paragraph (<p>) 
// instead of a <div>, which is cleaner.
document.execCommand('defaultParagraphSeparator', false, 'p');