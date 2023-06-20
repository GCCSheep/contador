window.electronAPI.onGetPatients((_event, patients) => {
    const tableBody = document.querySelector('table.patients tbody');
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
        deleteButton.innerText = '+';
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
        tableBody.insertAdjacentElement('beforeend', tableRow);
    }
});