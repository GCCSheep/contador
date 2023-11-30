const yearSelector = document.querySelector('select.year');
const monthSelector = document.querySelector('select.month');
const addPatientButton = document.querySelector('nav button.add');
const table = document.querySelector('table');
const saveButton = document.querySelector('button.save');
const cancelButton = document.querySelector('button.cancel');
const sessionPrice = 29.90;
let oldPatients;
let currentPatients;
let year = 2023;
let month = 1;

window.electronAPI.onGetPatients((_event, patients) => {
    currentPatients = patients;
    oldPatients = structuredClone(currentPatients);
    loadPatientsTable(currentPatients);
});

yearSelector.addEventListener('change', (e) => {
    updatePatients();
    year = Number(e.target.value);
    month = 1;
    monthSelector.value = '01';
    loadPatientsTable(currentPatients);
});

monthSelector.addEventListener('change', (e) => {
    updatePatients();
    month = Number(e.target.value);
    loadPatientsTable(currentPatients);
});

addPatientButton.addEventListener('click', () => {
    const patient = {
        name: '',
        careDays: [],
        psychologicalAssessment: '',
        totalSessions: '',
        heldSessions: '',
    };
    addPatientRow(patient);
});

saveButton.addEventListener('click', () => {
    updatePatients();
    oldPatients = structuredClone(currentPatients);
    window.electronAPI.setPatients(JSON.stringify(currentPatients));
});

cancelButton.addEventListener('click', () => {
    currentPatients = structuredClone(oldPatients);
    loadPatientsTable(currentPatients);
});

function loadPatientsTable() {
    const tableRows = table.querySelectorAll('tbody tr');
    for (const tableRow of tableRows) tableRow.remove();
    if (!currentPatients[year] || !currentPatients[year][month]) return;
    for (const patient of currentPatients[year][month]) addPatientRow(patient);
}

function addPatientRow(patient) {
    const tableRow = document.createElement('tr');
    const nameData = document.createElement('td');
    const careDayData = document.createElement('td');
    const psychologicalAssessmentData = document.createElement('td');
    const totalSessionsData = document.createElement('td');
    const heldSessionsData = document.createElement('td');
    const duePaymentData = document.createElement('td');
    const actionsData = document.createElement('td');
    const nameInput = document.createElement('input');
    const careDayAddButton = document.createElement('button');
    const careDayList = document.createElement('ol');
    const psychologicalAssessmentInput = document.createElement('input')
    const totalSessionsInput = document.createElement('input');
    const heldSessionsInput = document.createElement('input');
    const deleteButton = document.createElement('button');
    nameInput.type = 'text';
    nameInput.value = patient.name;
    careDayAddButton.innerText = '+';
    careDayAddButton.setAttribute('title', 'Adicionar dia de atendimento');
    careDayAddButton.classList.add('add');
    careDayAddButton.addEventListener('click', () => addCareDayItem());
    for (const careDay of patient.careDays) addCareDayItem(careDay)
    psychologicalAssessmentInput.type = 'checkbox';
    if (patient.psychologicalAssessment) psychologicalAssessmentInput.setAttribute('checked', '');
    psychologicalAssessmentInput.addEventListener('click', e => e.target.toggleAttribute('checked'));
    totalSessionsInput.type = 'number';
    totalSessionsInput.min = '0'
    totalSessionsInput.value = patient.totalSessions;
    heldSessionsInput.type = 'number';
    heldSessionsInput.min = '0';
    heldSessionsInput.value = patient.heldSessions;
    deleteButton.classList.add('delete');
    deleteButton.setAttribute('title', 'Excluir paciente');
    deleteButton.innerText = '+';
    deleteButton.addEventListener('click', e => e.target.parentElement.parentElement.remove());
    nameData.classList.add('name');
    nameData.insertAdjacentElement('beforeend', nameInput);
    careDayData.classList.add('care-days');
    careDayData.insertAdjacentElement('beforeend', careDayAddButton);
    careDayData.insertAdjacentElement('beforeend', careDayList);
    psychologicalAssessmentData.classList.add('psychological-assessment');
    psychologicalAssessmentData.insertAdjacentElement('beforeend', psychologicalAssessmentInput);
    totalSessionsData.classList.add('total-sessions');
    totalSessionsData.insertAdjacentElement('beforeend', totalSessionsInput);
    heldSessionsData.classList.add('held-sessions');
    heldSessionsData.insertAdjacentElement('beforeend', heldSessionsInput);
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

    function addCareDayItem(careDay) {
        const careDayItem = document.createElement('li');
        const careDayInput = document.createElement('input');
        const careDayDeleteButton = document.createElement('button');
        const min = year.toString() + '-' + ((month < 10 ? '0' : '') + month.toString()) + '-01';
        const max = year.toString() + '-' + ((month < 10 ? '0' : '') + month.toString()) + '-' + lastDayOfMonth(month);
        careDayInput.type = 'date';
        careDayInput.value = careDay ?? min;
        careDayInput.setAttribute('min', min);
        careDayInput.setAttribute('max', max);
        careDayDeleteButton.innerText = '+';
        careDayDeleteButton.setAttribute('title', 'Excluir dia de atendimento');
        careDayDeleteButton.classList.add('delete');
        careDayDeleteButton.addEventListener('click', e => e.target.parentElement.remove());
        careDayItem.insertAdjacentElement('beforeend', careDayInput);
        careDayItem.insertAdjacentElement('beforeend', careDayDeleteButton);
        careDayList.insertAdjacentElement('beforeend', careDayItem);

        function lastDayOfMonth(month) {
            return ( 
                month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12 ? '31' :
                month === 4 || month === 6 || month === 9 || month === 11 ? '30' :
                year % 4 === 0 && year % 100 != 0 ? '29' : '28'
            );
        }
    }
}

function updatePatients() {
    const patients = [];
    const tableRows = table.querySelectorAll('tbody tr');
    for (const tableRow of tableRows) {
        const careDays = [...tableRow.querySelectorAll('.care-days input')].map(input => input.value);
        patients.push({
            name: tableRow.querySelector('.name input').value,
            careDays: careDays,
            psychologicalAssessment: tableRow.querySelector('.psychological-assessment input').hasAttribute('checked'),
            totalSessions: tableRow.querySelector('.total-sessions input').value,
            heldSessions: tableRow.querySelector('.held-sessions input').value,
        });
    }
    if (!currentPatients[year]) currentPatients[year] = [];
    if (!currentPatients[year][month]) currentPatients[year][month] = [];
    currentPatients[year][month] = patients;
}