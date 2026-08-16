const translateButton = document.getElementById("translate-button");
const textArea = document.getElementById("translate-text");
const textTopHeader = document.getElementById("translate-text-header");
const textBottomHeader = document.getElementById('language-select-header')
const languageSelectDiv = document.getElementById("language-select-div");
const translateTextDiv = document.getElementById('translate-text-div');
const loadingDiv = document.getElementById('loading-div');
const radioDiv = document.getElementById('language-select-radio');
const outputDiv = document.getElementById('output-translation-div');
const outputTextArea = document.getElementById('output-textbox');
const tag = document.querySelector('.cursor-tag');
const htmlDiv = document.querySelector('html');


translateButton.addEventListener("click", async () => {
    if (!textArea.value) {
        textArea.removeAttribute('placeholder');
    }

    if (translateButton.textContent == "Start Over") {
        resetTranslator();
    } else {
         try {
            startLoading();

            const textToTranslate = textArea.value;
            const language = document.querySelector('input[name="language-select-option"]:checked').value;
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/translate`, {
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({textToTranslate, language}),
                method: "POST"
            })

            const { text } = await response.json();
            outputTextArea.value = text;

            endLoading();
        } catch (error) {
            console.log(error);
        }
    }
   
})


//set up loading state
function startLoading() {
    languageSelectDiv.classList.add('hidden');
    translateTextDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
}

//finish loading state
function endLoading() {
    languageSelectDiv.classList.remove('hidden');
    translateTextDiv.classList.remove('hidden');
    loadingDiv.classList.add('hidden');

    textTopHeader.textContent = `Original text 👇`
    textBottomHeader.textContent = `Your translation 👇`
    translateButton.textContent = "Start Over";
    textArea.readOnly = true;

    radioDiv.classList.add('hidden');
    outputDiv.classList.remove('hidden');
}

//reset translator back to original state
function resetTranslator() {
    textTopHeader.textContent = `Text to translate 👇`
    textBottomHeader.textContent = `Select language 👇`
    translateButton.textContent = "Translate";
    textArea.readOnly = false;
    textArea.value = '';
    textArea.setAttribute('placeholder', "How are you?");
    radioDiv.classList.remove('hidden');
    outputDiv.classList.add('hidden');
    textArea
}

//this stuff below handles copying to clipboard
let tagTimeout;
outputTextArea.addEventListener('click', () => {
    copyTextToClipboard(outputTextArea.value);
    clearTimeout(tagTimeout); 
    tag.style.display = 'block';

    tagTimeout = setTimeout(() => {
        tag.style.display = 'none';
    }, 2000);
})

outputTextArea.addEventListener('mouseenter', (e) => {
    if (tag.style.display === 'none' || tag.style.display === '') { 
        tag.style.left = `${e.clientX}px`;
        tag.style.top = `${e.clientY}px`;
    }
})

htmlDiv.addEventListener('mousemove', (e) => {
  if (tag.style.display === 'block') {
    tag.style.left = `${e.clientX + 15}px`;
    tag.style.top = `${e.clientY + 15}px`;
  }
});


function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text)
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
}
