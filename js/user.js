let allUsers = [];
let currentPage = 1;
const usersPerPage = 10;

async function init() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        allUsers = data.users || [];
    } catch (e) {
        allUsers = [
            { id: 1, firstName: 'Emily', lastName: 'Johnson', email: 'emily.johnson@x.dummyjson.com', age: 29, gender: 'female', phone: '+81 965-431-3024', image: 'https://dummyjson.com/icon/emilys/128' },
            { id: 2, firstName: 'John', lastName: 'Doe', email: 'john.doe@x.dummyjson.com', age: 35, gender: 'male', phone: '+1 234-567-8901', image: 'https://dummyjson.com/icon/johnd/128' }
        ];
    }
    renderUsers();
    updatePagination();
}

function getAllUsers() {
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    init();
}

function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderUsers();
        updatePagination();
        return;
    }
    
    const filtered = allUsers.filter(u => 
        u.firstName.toLowerCase().includes(searchTerm) ||
        u.lastName.toLowerCase().includes(searchTerm) ||
        (u.email && u.email.toLowerCase().includes(searchTerm))
    );
    
    currentPage = 1;
    renderFilteredUsers(filtered);
    updateFilteredPagination(filtered);
}

function renderFilteredUsers(users) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    document.getElementById('selectAll').checked = false;
    document.getElementById('deleteSelectedBtn').style.display = 'none';
    document.getElementById('selectedCount').innerText = '0';
    
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const usersToShow = users.slice(start, end);
    
    usersToShow.forEach(user => {
        tableLoad(user);
    });
}

function updateFilteredPagination(users) {
    const totalPages = Math.ceil(users.length / usersPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        buttons += `<button class="pagination-btn number ${activeClass}" onclick="goToFilteredPage(${i})">${i}</button>`;
    }
    
    paginationNumbers.innerHTML = buttons;
}

function renderUsers() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    document.getElementById('selectAll').checked = false;
    document.getElementById('deleteSelectedBtn').style.display = 'none';
    document.getElementById('selectedCount').innerText = '0';
    
    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const usersToShow = allUsers.slice(start, end);
    
    usersToShow.forEach(user => {
        tableLoad(user);
    });
}

function updatePagination() {
    const totalPages = Math.ceil(allUsers.length / usersPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        buttons += `<button class="pagination-btn number ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    paginationNumbers.innerHTML = buttons;
}

function changePage(direction) {
    const totalPages = Math.ceil(allUsers.length / usersPerPage);
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderUsers();
        updatePagination();
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(allUsers.length / usersPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderUsers();
        updatePagination();
    }
}

function goToFilteredPage(page) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allUsers.filter(u => 
        u.firstName.toLowerCase().includes(searchTerm) ||
        u.lastName.toLowerCase().includes(searchTerm) ||
        (u.email && u.email.toLowerCase().includes(searchTerm))
    );
    
    const totalPages = Math.ceil(filtered.length / usersPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderFilteredUsers(filtered);
        updateFilteredPagination(filtered);
    }
}

function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
}

function hideAddForm() {
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('newFirstName').value = '';
    document.getElementById('newLastName').value = '';
    document.getElementById('newEmail').value = '';
    document.getElementById('newAge').value = '';
    document.getElementById('newPhone').value = '';
    document.getElementById('newGender').value = '';
}

function addUser() {
    const firstName = document.getElementById('newFirstName').value;
    const lastName = document.getElementById('newLastName').value;
    const email = document.getElementById('newEmail').value;
    const age = document.getElementById('newAge').value;
    const phone = document.getElementById('newPhone').value;
    const gender = document.getElementById('newGender').value;
    
    if (firstName === '' || lastName === '') {
        alert('Por favor complete Nombre y Apellido');
        return;
    }
    
    const maxId = allUsers.reduce((max, u) => u.id > max ? u.id : max, 0);
    
    const newUser = {
        id: maxId + 1,
        firstName: firstName,
        lastName: lastName,
        maidenName: '',
        age: parseInt(age) || 25,
        gender: gender || 'male',
        email: email || '',
        phone: phone || '',
        username: firstName.toLowerCase() + lastName.toLowerCase(),
        password: '',
        birthDate: '',
        image: 'https://dummyjson.com/icon/' + firstName.toLowerCase() + '/128',
        bloodGroup: '',
        height: 0,
        weight: 0,
        eyeColor: '',
        hair: { color: '', type: '' },
        ip: '',
        address: { address: '', city: '', state: '', stateCode: '', postalCode: '', coordinates: { lat: 0, lng: 0 }, country: '' },
        macAddress: '',
        university: '',
        bank: { cardExpire: '', cardNumber: '', cardType: '', currency: '', iban: '' },
        company: { department: '', name: '', title: '', address: { address: '', city: '', state: '', stateCode: '', postalCode: '', coordinates: { lat: 0, lng: 0 }, country: '' } },
        ein: ''
    };
    
    allUsers.push(newUser);
    
    alert('Usuario agregado correctamente');
    hideAddForm();
    renderUsers();
    updatePagination();
}

function deleteUser(id) {
    if (!confirm('¿Está seguro de eliminar este usuario?')) {
        return;
    }
    
    allUsers = allUsers.filter(u => u.id !== id);
    
    alert('Usuario eliminado correctamente');
    renderUsers();
    updatePagination();
}

function editUser(id, firstName, lastName, email, age) {
    const newFirstName = prompt('Editar nombre:', firstName);
    if (newFirstName === null) return;
    
    const newLastName = prompt('Editar apellido:', lastName);
    if (newLastName === null) return;
    
    const newEmail = prompt('Editar email:', email);
    if (newEmail === null) return;
    
    const newAge = prompt('Editar edad:', age);
    if (newAge === null) return;
    
    const user = allUsers.find(u => u.id === id);
    if (user) {
        user.firstName = newFirstName || firstName;
        user.lastName = newLastName || lastName;
        user.email = newEmail || email;
        user.age = parseInt(newAge) || age;
        
        alert('Usuario actualizado correctamente');
        renderUsers();
    }
}

function tableLoad(user) {
    const container = document.getElementById('container');

    const register = document.createElement('tr');
    
    const cellCheck = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'user-checkbox';
    checkbox.value = user.id;
    checkbox.onchange = updateSelectedCount;
    cellCheck.appendChild(checkbox);
    
    const cellId = document.createElement('td');
    cellId.innerText = user.id;
    
    const cellName = document.createElement('td');
    cellName.innerText = user.firstName + ' ' + user.lastName;
    
    const cellEmail = document.createElement('td');
    cellEmail.innerText = user.email || '-';
    
    const cellAge = document.createElement('td');
    cellAge.innerText = user.age || '-';
    
    const cellGender = document.createElement('td');
    cellGender.innerText = user.gender || '-';
    
    const cellPhone = document.createElement('td');
    cellPhone.innerText = user.phone || '-';
    
    const cellActions = document.createElement('td');
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm me-1';
    deleteBtn.innerText = 'Eliminar';
    deleteBtn.onclick = function() { deleteUser(user.id); };
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-primary btn-sm';
    editBtn.innerText = 'Editar';
    editBtn.onclick = function() { editUser(user.id, user.firstName, user.lastName, user.email, user.age); };
    
    cellActions.appendChild(editBtn);
    cellActions.appendChild(deleteBtn);

    register.appendChild(cellCheck);
    register.appendChild(cellId);
    register.appendChild(cellName);
    register.appendChild(cellEmail);
    register.appendChild(cellAge);
    register.appendChild(cellGender);
    register.appendChild(cellPhone);
    register.appendChild(cellActions);
    
    container.appendChild(register);
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.user-checkbox');
    
    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.user-checkbox:checked');
    const count = checkboxes.length;
    const deleteBtn = document.getElementById('deleteSelectedBtn');
    const countSpan = document.getElementById('selectedCount');
    
    countSpan.innerText = count;
    
    if (count > 0) {
        deleteBtn.style.display = 'inline-block';
    } else {
        deleteBtn.style.display = 'none';
    }
}

function deleteSelected() {
    const checkboxes = document.querySelectorAll('.user-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (selectedIds.length === 0) {
        alert('No hay usuarios seleccionados');
        return;
    }
    
    if (!confirm(`¿Está seguro de eliminar ${selectedIds.length} usuario(s)?`)) {
        return;
    }
    
    allUsers = allUsers.filter(u => !selectedIds.includes(u.id));
    
    alert('Usuarios eliminados correctamente');
    renderUsers();
    updatePagination();
}

init();
