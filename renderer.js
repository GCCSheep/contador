const addPatientButton = document.querySelector('button.add-patient');
const table = document.querySelector('table');
const saveButton = document.querySelector('button.save');
const cancelButton = document.querySelector('button.cancel');

window.electronAPI.onGetPatients((_event, patients) => {
    for (const patient of patients) {
        insertRow(patient);
    }
    const tableRows = table.querySelectorAll('tbody tr');
    for (const tableRow of tableRows) {
        setSaveBtnTriggerers(tableRow);
        setDeleteRowTriggerers(tableRow);
    }
    generateTBodyCopy();
});

addPatientButton.addEventListener('click', () => {
    insertRow({
        name: '',
        careDay: '',
        psychologicalAssessment: '',
        totalSessions: '',
        heldSessions: '',
        duePayment: '',
    });
    setSaveBtnTriggerers(table.querySelector('tbody tr:last-of-type'));
    setDeleteRowTriggerers(table.querySelector('tbody tr:last-of-type'));
    saveButton.removeAttribute('disabled');
});

saveButton.addEventListener('click', () => {
    const patients = [];
    const tableRows = table.querySelectorAll('tbody:first-of-type tr');
    for (const tableRow of tableRows) {
        console.log(tableRow.querySelector('.psychological-assessment input').value);
        patients.push({
            name: tableRow.querySelector('.name input').value,
            careDay: tableRow.querySelector('.care-day input').value,
            psychologicalAssessment: tableRow.querySelector('.psychological-assessment input').hasAttribute('checked'),
            totalSessions: tableRow.querySelector('.total-sessions input').value,
            heldSessions: tableRow.querySelector('.held-sessions input').value,
            duePayment: tableRow.querySelector('.due-payment input').value,  
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

function insertRow(patient) {
    const tableRow = document.createElement('tr');
    const nameData = document.createElement('td');
    const careDayData = document.createElement('td');
    const psychologicalAssessmentData = document.createElement('td');
    const totalSessionsData = document.createElement('td');
    const heldSessionsData = document.createElement('td');
    const duePaymentData = document.createElement('td');
    const actionsData = document.createElement('td');
    const nameInput = document.createElement('input');
    const careDayInput = document.createElement('input');
    const psychologicalAssessmentInput = document.createElement('input')
    const totalSessionsInput = document.createElement('input');
    const heldSessionsInput = document.createElement('input');
    const duePaymentInput = document.createElement('input');
    const deleteButton = document.createElement('button');
    nameInput.type = 'text';
    nameInput.value = patient.name;
    careDayInput.type = 'date';
    careDayInput.value = patient.careDay;
    psychologicalAssessmentInput.type = 'checkbox';
    if (patient.psychologicalAssessment) psychologicalAssessmentInput.setAttribute('checked', '');
    psychologicalAssessmentInput.addEventListener('click', e => e.target.toggleAttribute('checked'));
    totalSessionsInput.type = 'number';
    totalSessionsInput.min = '0'
    totalSessionsInput.value = patient.totalSessions;
    heldSessionsInput.type = 'number';
    heldSessionsInput.min = '0';
    heldSessionsInput.value = patient.heldSessions;
    duePaymentInput.type = 'number';
    duePaymentInput.min = '0';
    duePaymentInput.step = '0.01';
    duePaymentInput.value = patient.duePayment;
    deleteButton.classList.add('delete-patient');
    deleteButton.setAttribute('title', 'Excluir paciente');
    deleteButton.innerText = '+';
    deleteButton.addEventListener('click', e => e.target.parentElement.parentElement.remove());
    nameData.classList.add('name');
    nameData.insertAdjacentElement('beforeend', nameInput);
    careDayData.classList.add('care-day');
    careDayData.insertAdjacentElement('beforeend', careDayInput);
    psychologicalAssessmentData.classList.add('psychological-assessment');
    psychologicalAssessmentData.insertAdjacentElement('beforeend', psychologicalAssessmentInput);
    totalSessionsData.classList.add('total-sessions');
    totalSessionsData.insertAdjacentElement('beforeend', totalSessionsInput);
    heldSessionsData.classList.add('held-sessions');
    heldSessionsData.insertAdjacentElement('beforeend', heldSessionsInput);
    duePaymentData.classList.add('due-payment');
    duePaymentData.insertAdjacentElement('beforeend', duePaymentInput);
    actionsData.classList.add('actions');
    actionsData.insertAdjacentElement('beforeend', deleteButton);
    tableRow.insertAdjacentElement('beforeend', nameData);
    tableRow.insertAdjacentElement('beforeend', careDayData);
    tableRow.insertAdjacentElement('beforeend', psychologicalAssessmentData);
    tableRow.insertAdjacentElement('beforeend', totalSessionsData);
    tableRow.insertAdjacentElement('beforeend', heldSessionsData);
    tableRow.insertAdjacentElement('beforeend', duePaymentData);
    tableRow.insertAdjacentElement('beforeend', actionsData);
    table.querySelector('tbody').insertAdjacentElement('beforeend', tableRow);
}

function generateTBodyCopy() {
    table.insertAdjacentElement('beforeend', table.querySelector('tbody').cloneNode(true));
    table.querySelector('tbody:last-of-type').setAttribute('hidden', '');
    const tableRows = table.querySelectorAll('tbody:last-of-type tr');
    for (const tableRow of tableRows) {
        setSaveBtnTriggerers(tableRow);
        setDeleteRowTriggerers(tableRow);
    }
}

function setSaveBtnTriggerers(tableRow) {
    const saveBtnTriggerers = tableRow.querySelectorAll('input, button.delete-patient');
    for (const saveBtnTriggerer of saveBtnTriggerers) {
        saveBtnTriggerer.addEventListener(
            saveBtnTriggerer.nodeName === 'INPUT' ? 'input' : 'click',
            () => saveButton.removeAttribute('disabled')
        );
    }
}

function setDeleteRowTriggerers(tableRow) {
    tableRow
        .querySelector('button.delete-patient')
        .addEventListener('click', (e) => e.target.parentElement.parentElement.remove());
}