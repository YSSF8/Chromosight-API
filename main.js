const input = document.querySelector('input');
const submit = document.querySelector('.submit');
const output = document.querySelector('.output');
const colors = document.querySelector('.colors');
const clipboardText = document.querySelector('.clipboard-text');
const historyIcon = document.querySelector('.history');
const codeSnippet = document.querySelector('.code-snippet')
const codeJson = codeSnippet.querySelector('.json');
const codeViewer = codeJson.querySelector('code');

let history = [];

submit.addEventListener('click', () => {
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

                color.addEventListener('mousemove', e => {
                    const x = e.clientX, y = e.clientY;

                    clipboardText.querySelector('span').innerHTML = data.colors[i].hex;

                    clipboardText.style.display = 'block';
                    clipboardText.style.left = (x - 2) + 'px';
                    clipboardText.style.top = (y - 45) + 'px';
                });

                color.addEventListener('mouseout', () => {
                    clipboardText.removeAttribute('style');
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
            copyCode.title = 'Copy JSON';
            codeSnippet.insertBefore(copyCode, codeJson);

            copyCode.addEventListener('click', () => {
                navigator.clipboard.writeText(codeViewer.textContent);
            });

            codeViewer.textContent = JSON.stringify(data, null, 2);
            hljs.highlightAll();

            history.push(output.src);
            localStorage.setItem('history', JSON.stringify(history));
        })
        .catch(error => {
            input.value = `<div>${error}</div>`;
        });
});

input.addEventListener('keyup', e => {
    if (e.key == 'Enter') submit.click();
});

historyIcon.addEventListener('click', () => {
    const historyPanel = document.createElement('div');
    historyPanel.innerHTML = `
        <div>History:</div>
        <br>
        <div class="close">X</div>
    `;

    setTimeout(() => historyPanel.style.left = 0);

    let history = [];
    if (localStorage.getItem('history')) {
        history = JSON.parse(localStorage.getItem('history'));
    }

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
        });
    } else {
        historyPanel.innerHTML += '<center>Nothing to view</center>';
    }

    document.body.appendChild(historyPanel);

    historyPanel.querySelector('.close').addEventListener('click', () => {
        historyPanel.removeAttribute('style');
        setTimeout(() => historyPanel.remove(), 200);
    });
});