const setButton = document.getElementById('btn');
const titleInput = document.getElementById('title');

async function func() {
    const response = await window.electronAPI.patients();
    console.log(response);
}

setButton.addEventListener('click', () => {
    const title = titleInput.value;
    window.electronAPI.setTitle(title);
});

func();