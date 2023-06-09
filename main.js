const input = document.querySelector('input');
const submit = document.querySelector('.submit');
const output = document.querySelector('.output');
const errorOutput = document.querySelector('.error-output');
const colors = document.querySelector('.colors');
const historyIcon = document.querySelector('.history');
const codeSnippet = document.querySelector('.code-snippet')
const codeJson = codeSnippet.querySelector('.json');
const codeViewer = codeJson.querySelector('code');
const themeSelector = document.querySelector('.theme');

let history = JSON.parse(localStorage.getItem('history')) || [];
let clipboardTextLimiter = 0;

submit.addEventListener('click', () => {
    if (input.value != '') {
        fetch(`https://chromosight-api.darksidex37.repl.co/?image=${input.value}`)
            .then(res => res.json())
            .then(data => {
                output.src = data.image;

                for (let i = 0; i < data.colors.length; i++) {
                    const color = document.createElement('div');
                    color.style.backgroundColor = data.colors[i].hex;
                    colors.appendChild(color);
                    
                    color.addEventListener('click', () => {
                        navigator.clipboard.writeText(data.colors[i].hex);
                    });

                    color.addEventListener('mousemove', () => {
                        clipboardTextLimiter++;
                        
                        const clipboardText = document.createElement('div');
                        clipboardText.innerHTML = `Copy to clipboard: ${data.colors[i].hex}`;
                        clipboardText.classList.add('clipboard-text');

                        const rect = color.getBoundingClientRect();

                        clipboardText.style.left = `${rect.x - rect.width * 2 + 40}px`;
                        clipboardText.style.top = `${rect.y - 40}px`;

                        document.body.appendChild(clipboardText);

                        setTimeout(() => {
                            clipboardText.style.opacity = 1;
                            clipboardText.style.transform = 'scale(1)';
                        });
                        
                        if (clipboardTextLimiter > 1) clipboardText.remove();
                    });

                    color.addEventListener('mouseout', () => {
                        document.querySelector('.clipboard-text').remove();
                        clipboardTextLimiter = 0;
                    });
                }

                const copyCode = document.createElement('div');
                copyCode.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                    <g clip-path="url(#a)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 5h7.795c1.115 0 1.519.116 1.926.334.407.218.727.538.945.945.218.407.334.811.334 1.926V16a1 1 0 1 0 2 0V8.128c0-1.783-.186-2.43-.534-3.082a3.635 3.635 0 0 0-1.512-1.512C18.302 3.186 17.655 3 15.872 3H8a1 1 0 0 0 0 2zm7.721 2.334C15.314 7.116 14.91 7 13.795 7h-7.59c-1.115 0-1.519.116-1.926.334a2.272 2.272 0 0 0-.945.945C3.116 8.686 3 9.09 3 10.205v7.59c0 1.114.116 1.519.334 1.926.218.407.538.727.945.945.407.218.811.334 1.926.334h7.59c1.114 0 1.519-.116 1.926-.334.407-.218.727-.538.945-.945.218-.407.334-.811.334-1.926v-7.59c0-1.115-.116-1.519-.334-1.926a2.272 2.272 0 0 0-.945-.945z" fill="#bbbbbb"/>
                    </g>
                    <defs>
                        <clipPath id="a">
                            <path fill="#bbbbbb" d="M0 0h24v24H0z"/>
                        </clipPath> 
                    </defs>
                </svg>
                `;
                copyCode.title = 'Copy response';
                codeSnippet.insertBefore(copyCode, codeJson);

                copyCode.addEventListener('click', () => {
                    navigator.clipboard.writeText(codeViewer.textContent);
                });

                codeViewer.textContent = JSON.stringify(data, null, 2);
                hljs.highlightAll();

                history.push(output.src);
                localStorage.setItem('history', JSON.stringify(history));

                errorOutput.innerHTML = '';
            })
            .catch(() => {
                errorOutput.innerHTML = 'Error<br><br>';
            });
    }
});

input.addEventListener('keyup', e => {
    if (e.key == 'Enter') submit.click();
});

output.addEventListener('click', () => {
    const imagePreview = document.createElement('div');
    imagePreview.classList.add('image-preview');
    imagePreview.innerHTML = `
    <div class="close">X</div>
    <img src="${output.src}" alt="">
    `;
    document.body.appendChild(imagePreview);

    const img = imagePreview.querySelector('img');
    const close = imagePreview.querySelector('.close');

    setTimeout(() => {
        imagePreview.style.opacity = 1;
        img.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    close.addEventListener('click', () => {
        imagePreview.style.opacity = 0;
        img.style.transform = 'translate(-50%, -50%) scale(.8)';
        setTimeout(() => imagePreview.remove(), 200);
    });

    document.addEventListener('keyup', e => {
        if (e.key == 'Escape') close.click();
    });
});

historyIcon.addEventListener('click', () => {
    const historyPanel = document.createElement('div');
    historyPanel.innerHTML = `
        <div>History</div>
        <br>
        <div class="close">X</div>
    `;

    setTimeout(() => historyPanel.style.left = 0);

    historyPanel.className = 'history-panel';

    if (history.length > 0) {
        const historyContainer = document.createElement('div');
        historyContainer.className = 'history-container';

        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            const historyImg = document.createElement('img');
            historyImg.src = item;
            historyImg.alt = '';
            historyItem.appendChild(historyImg);
            historyContainer.appendChild(historyItem);

            historyImg.addEventListener('click', () => {
                input.value = historyImg.src;
                setTimeout(() => submit.click(), 200);

                historyPanel.removeAttribute('style');
                setTimeout(() => historyPanel.remove(), 200);
            });
        });

        historyPanel.appendChild(historyContainer);

        const clearButtonCenter = document.createElement('center');
        historyPanel.appendChild(clearButtonCenter);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'CLEAR';
        clearButtonCenter.appendChild(clearButton);

        clearButton.addEventListener('click', () => {
            historyContainer.querySelectorAll('.history-item').forEach(item => {
                item.remove();
            });

            history = [];
            localStorage.removeItem('history');
            clearButton.outerHTML = '<div class="ntv-text">Nothing to view</div>';
        });
    } else {
        historyPanel.innerHTML += '<div class="ntv-text">Nothing to view</div>';
    }

    document.body.appendChild(historyPanel);

    historyPanel.querySelector('.close').addEventListener('click', () => {
        historyPanel.removeAttribute('style');
        setTimeout(() => historyPanel.remove(), 200);
    });
});

const themeVariables = {
    dark: {
        '--bg': '#343540',
        '--sec-bg': '#40414e',
        '--thr-bg': '#444653',
        '--bright-gry': '#565869',
        '--brighter-gry': '#37383f',
        '--brightest-gry': '#626475',
        '--hstr-bg': '#202123',
        '--hstr-sb': '#3c3d3f',
        '--hstr-sb-over': '#454649',
        '--blue': '#93cef0',
        '--drk-blue': '#62a2c7',
        '--light-txt': '#bbb',
        '--def-color': '#eee',
        '--err-color': '#e65959'
    },
    light: {
        '--bg': '#fff',
        '--sec-bg': '#f4f4f4',
        '--thr-bg': '#f5f5f5',
        '--bright-gry': '#f7f7f7',
        '--brighter-gry': '#f8f8f8',
        '--brightest-gry': '#f9f9f9',
        '--hstr-bg': '#f9f9f9',
        '--hstr-sb': '#ddd',
        '--hstr-sb-over': '#ccc',
        '--blue': '#0077c2',
        '--drk-blue': '#00457a',
        '--light-txt': '#333',
        '--def-color': '#000',
        '--err-color': '#a02c2c'
    }
}

let isLightMode = localStorage.getItem('isLightMode') === 'true';

function applyTheme(theme) {
    const variables = themeVariables[theme];
    Object.entries(variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
    });
    localStorage.setItem('isLightMode', theme === 'light');
}

applyTheme(isLightMode ? 'light' : 'dark');

themeSelector.addEventListener('click', () => {
    isLightMode = !isLightMode;
    applyTheme(isLightMode ? 'light' : 'dark');
});