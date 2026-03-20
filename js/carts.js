let allCarts = [];
let currentPage = 1;
const cartsPerPage = 10;

async function init() {
    const stored = localStorage.getItem('carts');
    if (stored) {
        allCarts = JSON.parse(stored);
    } else {
        try {
            const response = await fetch('db.json');
            const data = await response.json();
            allCarts = data.carts || [];
            localStorage.setItem('carts', JSON.stringify(allCarts));
        } catch (e) {
            allCarts = [
                { id: 1, total: 100, discountedTotal: 90, userId: 1, totalProducts: 2, totalQuantity: 5 }
            ];
        }
    }
    renderCarts();
    updatePagination();
}

function saveCarts() {
    localStorage.setItem('carts', JSON.stringify(allCarts));
}

function getAllCarts() {
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    init();
}

function searchCarts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderCarts();
        updatePagination();
        return;
    }
    
    const filtered = allCarts.filter(c => c.userId.toString().includes(searchTerm));
    
    currentPage = 1;
    renderFilteredCarts(filtered);
    updateFilteredPagination(filtered);
}

function renderFilteredCarts(carts) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    const start = (currentPage - 1) * cartsPerPage;
    const end = start + cartsPerPage;
    const cartsToShow = carts.slice(start, end);
    
    cartsToShow.forEach(cart => {
        tableLoad(cart);
    });
}

function updateFilteredPagination(carts) {
    const totalPages = Math.ceil(carts.length / cartsPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        buttons += `<button class="pagination-btn number ${activeClass}" onclick="goToFilteredPage(${i})">${i}</button>`;
    }
    
    paginationNumbers.innerHTML = buttons;
}

function renderCarts() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    const start = (currentPage - 1) * cartsPerPage;
    const end = start + cartsPerPage;
    const cartsToShow = allCarts.slice(start, end);
    
    cartsToShow.forEach(cart => {
        tableLoad(cart);
    });
}

function updatePagination() {
    const totalPages = Math.ceil(allCarts.length / cartsPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        buttons += `<button class="pagination-btn number ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    paginationNumbers.innerHTML = buttons;
}

function changePage(direction) {
    const totalPages = Math.ceil(allCarts.length / cartsPerPage);
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderCarts();
        updatePagination();
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(allCarts.length / cartsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderCarts();
        updatePagination();
    }
}

function goToFilteredPage(page) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allCarts.filter(c => c.userId.toString().includes(searchTerm));
    
    const totalPages = Math.ceil(filtered.length / cartsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderFilteredCarts(filtered);
        updateFilteredPagination(filtered);
    }
}

function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
}

function hideAddForm() {
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('newUserId').value = '';
    document.getElementById('newTotalProducts').value = '';
    document.getElementById('newTotalQuantity').value = '';
    document.getElementById('newTotal').value = '';
    document.getElementById('newDiscountedTotal').value = '';
}

function addCart() {
    const userId = document.getElementById('newUserId').value;
    const totalProducts = document.getElementById('newTotalProducts').value;
    const totalQuantity = document.getElementById('newTotalQuantity').value;
    const total = document.getElementById('newTotal').value;
    const discountedTotal = document.getElementById('newDiscountedTotal').value;
    
    if (userId === '') {
        alert('Por favor complete User Id');
        return;
    }
    
    const maxId = allCarts.reduce((max, c) => c.id > max ? c.id : max, 0);
    
    const newCart = {
        id: maxId + 1,
        products: [],
        total: parseFloat(total) || 0,
        discountedTotal: parseFloat(discountedTotal) || 0,
        userId: parseInt(userId),
        totalProducts: parseInt(totalProducts) || 0,
        totalQuantity: parseInt(totalQuantity) || 0
    };
    
    allCarts.push(newCart);
    saveCarts();
    
    alert('Carrito agregado correctamente');
    hideAddForm();
    renderCarts();
    updatePagination();
}

function deleteCart(id) {
    if (!confirm('Esta seguro de eliminar este carrito?')) {
        return;
    }
    
    allCarts = allCarts.filter(c => c.id !== id);
    saveCarts();
    
    alert('Carrito eliminado correctamente');
    renderCarts();
    updatePagination();
}

function tableLoad(cart) {
    const container = document.getElementById('container');

    const register = document.createElement('tr');
    
    const cellId = document.createElement('td');
    cellId.innerText = cart.id;
    
    const cellUserId = document.createElement('td');
    cellUserId.innerText = cart.userId || '-';
    
    const cellTotal = document.createElement('td');
    cellTotal.innerText = '$' + (cart.total || 0).toFixed(2);
    
    const cellDiscounted = document.createElement('td');
    cellDiscounted.innerText = '$' + (cart.discountedTotal || 0).toFixed(2);
    
    const cellProducts = document.createElement('td');
    cellProducts.innerText = cart.totalProducts || 0;
    
    const cellQuantity = document.createElement('td');
    cellQuantity.innerText = cart.totalQuantity || 0;
    
    const cellActions = document.createElement('td');
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-primary btn-sm me-1';
    editBtn.innerText = 'Editar';
    editBtn.onclick = function() { editCart(cart.id, cart.userId, cart.total, cart.discountedTotal, cart.totalProducts, cart.totalQuantity); };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.innerText = 'Eliminar';
    deleteBtn.onclick = function() { deleteCart(cart.id); };
    
    cellActions.appendChild(editBtn);
    cellActions.appendChild(deleteBtn);

    register.appendChild(cellId);
    register.appendChild(cellUserId);
    register.appendChild(cellTotal);
    register.appendChild(cellDiscounted);
    register.appendChild(cellProducts);
    register.appendChild(cellQuantity);
    register.appendChild(cellActions);
    
    container.appendChild(register);
}

function editCart(id, userId, total, discountedTotal, totalProducts, totalQuantity) {
    const newUserId = prompt('Editar User Id:', userId);
    if (newUserId === null) return;
    
    const newTotal = prompt('Editar Total:', total);
    if (newTotal === null) return;
    
    const newDiscountedTotal = prompt('Editar Total con Descuento:', discountedTotal);
    if (newDiscountedTotal === null) return;
    
    const newTotalProducts = prompt('Editar Total Productos:', totalProducts);
    if (newTotalProducts === null) return;
    
    const newTotalQuantity = prompt('Editar Cantidad Total:', totalQuantity);
    if (newTotalQuantity === null) return;
    
    const cart = allCarts.find(c => c.id === id);
    if (cart) {
        cart.userId = parseInt(newUserId) || userId;
        cart.total = parseFloat(newTotal) || total;
        cart.discountedTotal = parseFloat(newDiscountedTotal) || discountedTotal;
        cart.totalProducts = parseInt(newTotalProducts) || totalProducts;
        cart.totalQuantity = parseInt(newTotalQuantity) || totalQuantity;
        saveCarts();
        
        alert('Carrito actualizado correctamente');
        renderCarts();
    }
}

init();
