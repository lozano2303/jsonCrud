let allPosts = [];
let currentPage = 1;
const postsPerPage = 10;

async function init() {
    const stored = localStorage.getItem('posts');
    if (stored) {
        allPosts = JSON.parse(stored);
    } else {
        try {
            const response = await fetch('db.json');
            const data = await response.json();
            allPosts = data.posts || [];
            localStorage.setItem('posts', JSON.stringify(allPosts));
        } catch (e) {
            allPosts = [
                { id: 1, title: 'Sample Post', body: 'This is a sample post', tags: ['sample'], reactions: { likes: 0, dislikes: 0 }, views: 0, userId: 1 }
            ];
        }
    }
    renderPosts();
    updatePagination();
}

function savePosts() {
    localStorage.setItem('posts', JSON.stringify(allPosts));
}

function getAllPosts() {
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    init();
}

function searchPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        renderPosts();
        updatePagination();
        return;
    }
    
    const filtered = allPosts.filter(p => p.title.toLowerCase().includes(searchTerm));
    
    currentPage = 1;
    renderFilteredPosts(filtered);
    updateFilteredPagination(filtered);
}

function renderFilteredPosts(posts) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToShow = posts.slice(start, end);
    
    postsToShow.forEach(post => {
        tableLoad(post);
    });
}

function updateFilteredPagination(posts) {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        buttons += `<button class="pagination-btn number ${activeClass}" onclick="goToFilteredPage(${i})">${i}</button>`;
    }
    
    paginationNumbers.innerHTML = buttons;
}

function renderPosts() {
    const container = document.getElementById('container');
    container.innerHTML = '';
    
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const postsToShow = allPosts.slice(start, end);
    
    postsToShow.forEach(post => {
        tableLoad(post);
    });
}

function updatePagination() {
    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        buttons += `<button class="pagination-btn number ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    paginationNumbers.innerHTML = buttons;
}

function changePage(direction) {
    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderPosts();
        updatePagination();
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderPosts();
        updatePagination();
    }
}

function goToFilteredPage(page) {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allPosts.filter(p => p.title.toLowerCase().includes(searchTerm));
    
    const totalPages = Math.ceil(filtered.length / postsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderFilteredPosts(filtered);
        updateFilteredPagination(filtered);
    }
}

function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
}

function hideAddForm() {
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('newTitle').value = '';
    document.getElementById('newBody').value = '';
    document.getElementById('newUserId').value = '';
    document.getElementById('newViews').value = '';
    document.getElementById('newTags').value = '';
}

function addPost() {
    const title = document.getElementById('newTitle').value;
    const body = document.getElementById('newBody').value;
    const userId = document.getElementById('newUserId').value;
    const views = parseInt(document.getElementById('newViews').value) || 0;
    const tagsInput = document.getElementById('newTags').value;
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];
    
    if (title === '') {
        alert('Por favor complete el titulo');
        return;
    }
    
    const maxId = allPosts.reduce((max, p) => p.id > max ? p.id : max, 0);
    
    const newPost = {
        id: maxId + 1,
        title: title,
        body: body || '',
        tags: tags,
        reactions: { likes: 0, dislikes: 0 },
        views: views,
        userId: parseInt(userId) || 1
    };
    
    allPosts.push(newPost);
    savePosts();
    
    alert('Post agregado correctamente');
    hideAddForm();
    renderPosts();
    updatePagination();
}

function deletePost(id) {
    if (!confirm('Esta seguro de eliminar este post?')) {
        return;
    }
    
    allPosts = allPosts.filter(p => p.id !== id);
    savePosts();
    
    alert('Post eliminado correctamente');
    renderPosts();
    updatePagination();
}

function tableLoad(post) {
    const container = document.getElementById('container');

    const register = document.createElement('tr');
    
    const cellId = document.createElement('td');
    cellId.innerText = post.id;
    
    const cellTitle = document.createElement('td');
    cellTitle.innerText = post.title || '-';
    
    const cellBody = document.createElement('td');
    cellBody.innerText = (post.body ? post.body.substring(0, 50) : '') + (post.body && post.body.length > 50 ? '...' : '');
    
    const cellUserId = document.createElement('td');
    cellUserId.innerText = post.userId || '-';
    
    const cellViews = document.createElement('td');
    cellViews.innerText = post.views || 0;
    
    const cellTags = document.createElement('td');
    cellTags.innerText = post.tags ? post.tags.join(', ') : '-';
    
    const cellActions = document.createElement('td');
    
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-primary btn-sm me-1';
    editBtn.innerText = 'Editar';
    editBtn.onclick = function() { editPost(post.id, post.title, post.body, post.userId); };
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn-sm';
    deleteBtn.innerText = 'Eliminar';
    deleteBtn.onclick = function() { deletePost(post.id); };
    
    cellActions.appendChild(editBtn);
    cellActions.appendChild(deleteBtn);

    register.appendChild(cellId);
    register.appendChild(cellTitle);
    register.appendChild(cellBody);
    register.appendChild(cellUserId);
    register.appendChild(cellViews);
    register.appendChild(cellTags);
    register.appendChild(cellActions);
    
    container.appendChild(register);
}

function editPost(id, title, body, userId) {
    const newTitle = prompt('Editar titulo:', title);
    if (newTitle === null) return;
    
    const newBody = prompt('Editar contenido:', body);
    if (newBody === null) return;
    
    const newUserId = prompt('Editar userId:', userId);
    if (newUserId === null) return;
    
    const post = allPosts.find(p => p.id === id);
    if (post) {
        post.title = newTitle || title;
        post.body = newBody || body;
        post.userId = parseInt(newUserId) || userId;
        savePosts();
        
        alert('Post actualizado correctamente');
        renderPosts();
    }
}

init();
