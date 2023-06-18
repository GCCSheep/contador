const setButton = document.getElementById('btn');
const titleInput = document.getElementById('title');
const counter = document.getElementById('counter');

window.electronAPI.onUpdateCounter((_event, value) => {
    const oldValue = Number(counter.innerText);
    const newValue = oldValue + value;
    counter.innerText = newValue;
});

setButton.addEventListener('click', () => {
    const title = titleInput.value;
    window.electronAPI.setTitle(title);
});
