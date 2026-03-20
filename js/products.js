let allProducts = [];
let currentPage = 1;
const productsPerPage = 10;

async function init() {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        allProducts = data.products || [];
    } catch (e) {
        allProducts = [
            { id: 1, title: 'Essence Mascara Lash Princess', price: 9.99 },
            { id: 2, title: 'Eyeshadow Palette with Mirror', price: 19.99 },
            { id: 3, title: 'Powder Canister', price: 14.99 },
            { id: 4, title: 'Red Lipstick', price: 12.99 },
            { id: 5, title: 'Red Nail Polish', price: 8.99 }
        ];
    }
    renderProducts();
    updatePagination();
}

function getAllProducts() {
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    init();
}

function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderProducts();
        updatePagination();
        return;
    }
    
    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(searchTerm));
    
    currentPage = 1;
    renderFilteredProducts(filtered);
    updateFilteredPagination(filtered);
}

function renderFilteredProducts(products) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    document.getElementById('selectAll').checked = false;
    document.getElementById('deleteSelectedBtn').style.display = 'none';
    document.getElementById('selectedCount').innerText = '0';
    
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = products.slice(start, end);
    
    productsToShow.forEach(product => {
        tableLoad(product);
    });
}

function updateFilteredPagination(products) {
    const totalPages = Math.ceil(products.length / productsPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        buttons += `<button class="pagination-btn number ${activeClass}" onclick="goToFilteredPage(${i})">${i}</button>`;
    }
    
    paginationNumbers.innerHTML = buttons;
}

function renderProducts() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    document.getElementById('selectAll').checked = false;
    document.getElementById('deleteSelectedBtn').style.display = 'none';
    document.getElementById('selectedCount').innerText = '0';
    
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = allProducts.slice(start, end);
    
    productsToShow.forEach(product => {
        tableLoad(product);
    });
}

function updatePagination() {
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        buttons += `<button class="pagination-btn number ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    paginationNumbers.innerHTML = buttons;
}

function changePage(direction) {
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderProducts();
        updatePagination();
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderProducts();
        updatePagination();
    }
}

function goToFilteredPage(page) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(searchTerm));
    
    const totalPages = Math.ceil(filtered.length / productsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderFilteredProducts(filtered);
        updateFilteredPagination(filtered);
    }
}

function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
}

function hideAddForm() {
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('newTitle').value = '';
    document.getElementById('newPrice').value = '';
}

function addProduct() {
    const title = document.getElementById('newTitle').value;
    const price = document.getElementById('newPrice').value;
    
    if (title === '' || price === '') {
        alert('Por favor complete Title y Price');
        return;
    }
    
    const maxId = allProducts.reduce((max, p) => p.id > max ? p.id : max, 0);
    
    const newProduct = {
        id: maxId + 1,
        title: title,
        price: parseFloat(price)
    };
    
    allProducts.push(newProduct);
    
    alert('Producto agregado correctamente');
    hideAddForm();
    renderProducts();
    updatePagination();
}

function deleteProduct(id) {
    if (!confirm('¿Está seguro de eliminar este producto?')) {
        return;
    }
    
    allProducts = allProducts.filter(p => p.id !== id);
    
    alert('Producto eliminado correctamente');
    renderProducts();
    updatePagination();
}

function editProduct(id, title, price) {
    const newTitle = prompt('Editar título:', title);
    if (newTitle === null) return;
    
    const newPrice = prompt('Editar precio:', price);
    if (newPrice === null) return;
    
    if (newTitle === '' || newPrice === '') {
        alert('Por favor complete todos los campos');
        return;
    }
    
    const product = allProducts.find(p => p.id === id);
    if (product) {
        product.title = newTitle;
        product.price = parseFloat(newPrice);
        
        alert('Producto actualizado correctamente');
        renderProducts();
    }
}

function tableLoad(product) {
    const container = document.getElementById('container');

    const register = document.createElement('tr');
    
    const cellCheck = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'product-checkbox';
    checkbox.value = product.id;
    checkbox.onchange = updateSelectedCount;
    cellCheck.appendChild(checkbox);
    
    const cellId = document.createElement('td');
    cellId.innerText = product.id;
    
    const cellTitle = document.createElement('td');
    cellTitle.innerText = product.title;
    
    const cellPrice = document.createElement('td');
    cellPrice.innerText = '$' + product.price;
    
    const cellActions = document.createElement('td');
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm me-1';
    deleteBtn.innerText = 'Eliminar';
    deleteBtn.onclick = function() { deleteProduct(product.id); };
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-primary btn-sm';
    editBtn.innerText = 'Editar';
    editBtn.onclick = function() { editProduct(product.id, product.title, product.price); };
    
    cellActions.appendChild(editBtn);
    cellActions.appendChild(deleteBtn);

    register.appendChild(cellCheck);
    register.appendChild(cellId);
    register.appendChild(cellTitle);
    register.appendChild(cellPrice);
    register.appendChild(cellActions);
    
    container.appendChild(register);
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    
    checkboxes.forEach(cb => {
        cb.checked = selectAll.checked;
    });
    
    updateSelectedCount();
}

function updateSelectedCount() {
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
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
    const checkboxes = document.querySelectorAll('.product-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (selectedIds.length === 0) {
        alert('No hay productos seleccionados');
        return;
    }
    
    if (!confirm(`¿Está seguro de eliminar ${selectedIds.length} producto(s)?`)) {
        return;
    }
    
    allProducts = allProducts.filter(p => !selectedIds.includes(p.id));
    
    alert('Productos eliminados correctamente');
    renderProducts();
    updatePagination();
}

init();
