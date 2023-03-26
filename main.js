const input = document.querySelector('input');
const submit = document.querySelector('.submit');
const output = document.querySelector('.output');
const colors = document.querySelector('.colors');
const codeViewer = document.querySelector('.json code');
const clipboardText = document.querySelector('.clipboard-text');

submit.addEventListener('click', () => {
    fetch(`https://chromosight-api.darksidex37.repl.co/?image=${input.value}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
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

            codeViewer.textContent = JSON.stringify(data, null, 2);
            hljs.highlightAll();
        })
        .catch(error => {
            input.value = `<div>${error}</div>`;
        });
});