const addPatientButton = document.querySelector('button.add-patient');
const table = document.querySelector('table');
const saveButton = document.querySelector('button.save');
const cancelButton = document.querySelector('button.cancel');

addPatientButton.addEventListener('click', () => {

});

saveButton.addEventListener('click', () => {
    const patients = [];
    const tableRows = table.querySelectorAll('tbody:first-of-type tr');
    for (const tableRow of tableRows) {
        patients.push({
            name: tableRow.querySelector('.name input').value,
            totalSessions: tableRow.querySelector('.total-sessions input').value,
            heldSessions: tableRow.querySelector('.held-sessions input').value,
        });
    }
    table.querySelector('tbody:last-of-type').remove();
    generateTBodyCopy();
    window.electronAPI.setPatients(JSON.stringify(patients));
    saveButton.setAttribute('disabled', '');
});

cancelButton.addEventListener('click', () => {
    table.querySelector('tbody').remove();
    table.querySelector('tbody').removeAttribute('hidden');
    generateTBodyCopy();
    saveButton.setAttribute('disabled', '');
});

window.electronAPI.onGetPatients((_event, patients) => {
    for (const patient of patients) {
        const tableRow = document.createElement('tr');
        const nameData = document.createElement('td');
        const totalSessionsData = document.createElement('td');
        const heldSessionsData = document.createElement('td');
        const actionsData = document.createElement('td');
        const nameInput = document.createElement('input');
        const totalSessionsInput = document.createElement('input');
        const heldSessionsInput = document.createElement('input');
        const deleteButton = document.createElement('button');
        nameInput.type = 'text';
        nameInput.value = patient.name;
        totalSessionsInput.type = 'number';
        totalSessionsInput.min = '0'
        totalSessionsInput.value = patient.totalSessions;
        heldSessionsInput.type = 'number';
        heldSessionsInput.min = '0';
        heldSessionsInput.value = patient.heldSessions;
        deleteButton.classList.add('delete-patient');
        deleteButton.setAttribute('hidden', '');
        deleteButton.innerText = '+';
        deleteButton.addEventListener('click', () => {});
        nameData.classList.add('name');
        nameData.insertAdjacentElement('beforeend', nameInput);
        totalSessionsData.classList.add('total-sessions');
        totalSessionsData.insertAdjacentElement('beforeend', totalSessionsInput);
        heldSessionsData.classList.add('held-sessions');
        heldSessionsData.insertAdjacentElement('beforeend', heldSessionsInput);
        actionsData.classList.add('actions');
        actionsData.insertAdjacentElement('beforeend', deleteButton);
        tableRow.insertAdjacentElement('beforeend', nameData);
        tableRow.insertAdjacentElement('beforeend', totalSessionsData);
        tableRow.insertAdjacentElement('beforeend', heldSessionsData);
        tableRow.insertAdjacentElement('beforeend', actionsData);
        table.querySelector('tbody').insertAdjacentElement('beforeend', tableRow);
    }
    setSaveBtnTriggerers(table.querySelector('tbody'));
    generateTBodyCopy();
});

function generateTBodyCopy() {
    table.insertAdjacentElement('beforeend', table.querySelector('tbody').cloneNode(true));
    table.querySelector('tbody:last-of-type').setAttribute('hidden', '');
    setSaveBtnTriggerers(table.querySelector('tbody:last-of-type'));
}

function setSaveBtnTriggerers(tableBody) {
    const saveBtnTriggerers = tableBody.querySelectorAll('input, button.delete-patient');
    for (const saveBtnTriggerer of saveBtnTriggerers) {
        saveBtnTriggerer.addEventListener(
            saveBtnTriggerer.nodeName === 'INPUT' ? 'change' : 'click',
            () => saveButton.removeAttribute('disabled')
        );
    }
}