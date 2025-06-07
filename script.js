
// Global state management
let currentUser = null;
let currentPage = 'dashboard';
let books = [];
let members = [];

// Sample data
const sampleBooks = [
    {
        id: 1,
        title: "JavaScript: The Definitive Guide",
        author: "David Flanagan",
        category: "technology",
        isbn: "978-1491952023",
        status: "available",
        borrowedBy: null,
        borrowedDate: null
    },
    {
        id: 2,
        title: "Clean Code",
        author: "Robert Martin",
        category: "technology",
        isbn: "978-0132350884",
        status: "borrowed",
        borrowedBy: "john.doe@email.com",
        borrowedDate: "2024-01-15"
    },
    {
        id: 3,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "fiction",
        isbn: "978-0743273565",
        status: "available",
        borrowedBy: null,
        borrowedDate: null
    },
    {
        id: 4,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "science",
        isbn: "978-0553380163",
        status: "available",
        borrowedBy: null,
        borrowedDate: null
    },
    {
        id: 5,
        title: "The Art of War",
        author: "Sun Tzu",
        category: "history",
        isbn: "978-1599869773",
        status: "borrowed",
        borrowedBy: "jane.smith@email.com",
        borrowedDate: "2024-01-10"
    }
];

const sampleMembers = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@email.com",
        role: "student",
        books借rowed: 1,
        joinDate: "2023-09-01"
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@email.com",
        role: "faculty",
        booksBorrowed: 2,
        joinDate: "2023-08-15"
    },
    {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@email.com",
        role: "student",
        booksBorrowed: 0,
        joinDate: "2024-01-05"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Load data
    books = [...sampleBooks];
    members = [...sampleMembers];
    
    // Check for saved user session
    const savedUser = localStorage.getItem('libhero_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showLogin();
    }
    
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Signup form
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
    
    // Add book form
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
    
    // Add member form
    document.getElementById('addMemberForm').addEventListener('submit', handleAddMember);
    
    // Modal close events
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Show loading state
    const btnText = document.getElementById('loginBtnText');
    btnText.textContent = 'Signing In...';
    
    // Simulate authentication delay
    setTimeout(() => {
        let role = 'student';
        let name = 'Demo User';
        
        if (email.includes('librarian')) {
            role = 'librarian';
            name = 'Sarah Johnson';
        } else if (email.includes('faculty')) {
            role = 'faculty';
            name = 'Dr. Michael Brown';
        } else {
            name = 'Alex Student';
        }
        
        const user = {
            id: generateId(),
            name,
            email,
            role
        };
        
        login(user);
        btnText.textContent = 'Sign In';
    }, 1000);
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('userRoleSelect').value;
    
    // Show loading state
    const btnText = document.getElementById('signupBtnText');
    btnText.textContent = 'Creating Account...';
    
    setTimeout(() => {
        const user = {
            id: generateId(),
            name,
            email,
            role
        };
        
        login(user);
        btnText.textContent = 'Create Account';
    }, 1000);
}

function login(user) {
    currentUser = user;
    localStorage.setItem('libhero_user', JSON.stringify(user));
    console.log('User logged in:', user);
    showDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('libhero_user');
    console.log('User logged out');
    showLogin();
}

function showLogin() {
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('signupPage').classList.add('hidden');
    document.getElementById('navigation').classList.add('hidden');
    document.getElementById('mainContent').classList.add('hidden');
}

function showSignup() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('signupPage').classList.remove('hidden');
}

function showDashboard() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('signupPage').classList.add('hidden');
    document.getElementById('navigation').classList.remove('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    
    updateUserInterface();
    updateRoleBasedAccess();
    navigateTo('dashboard');
}

function updateUserInterface() {
    if (!currentUser) return;
    
    const userEmoji = getRoleEmoji(currentUser.role);
    const userName = currentUser.name;
    const userRole = currentUser.role;
    
    document.getElementById('userEmoji').textContent = userEmoji;
    document.getElementById('userName').textContent = userName;
    document.getElementById('userRole').textContent = `(${userRole})`;
}

function updateRoleBasedAccess() {
    if (!currentUser) return;
    
    const membersBtn = document.getElementById('membersBtn');
    const reportsBtn = document.getElementById('reportsBtn');
    
    // Only librarians can access member management
    if (currentUser.role !== 'librarian') {
        membersBtn.style.display = 'none';
    } else {
        membersBtn.style.display = 'block';
    }
    
    // Only librarians and faculty can access reports
    if (currentUser.role === 'student') {
        reportsBtn.style.display = 'none';
    } else {
        reportsBtn.style.display = 'block';
    }
}

function getRoleEmoji(role) {
    switch (role) {
        case 'librarian': return '📚';
        case 'faculty': return '👨‍🏫';
        case 'student': return '🎓';
        default: return '👤';
    }
}

// Navigation functions
function navigateTo(page) {
    currentPage = page;
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-page') === page) {
            btn.classList.add('active');
        }
    });
    
    // Show the correct page
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Load page-specific content
        switch (page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'books':
                loadBooks();
                break;
            case 'members':
                loadMembers();
                break;
            case 'reports':
                loadReports();
                break;
        }
    }
}

// Dashboard functions
function loadDashboard() {
    const totalBooks = books.length;
    const totalMembers = members.length;
    const borrowedBooks = books.filter(book => book.status === 'borrowed').length;
    const overdueBooks = calculateOverdueBooks();
    
    document.getElementById('totalBooks').textContent = totalBooks.toLocaleString();
    document.getElementById('totalMembers').textContent = totalMembers.toLocaleString();
    document.getElementById('borrowedBooks').textContent = borrowedBooks.toLocaleString();
    document.getElementById('overdueBooks').textContent = overdueBooks.toLocaleString();
}

function calculateOverdueBooks() {
    const now = new Date();
    const overdueCount = books.filter(book => {
        if (book.status === 'borrowed' && book.borrowedDate) {
            const borrowedDate = new Date(book.borrowedDate);
            const daysDiff = (now - borrowedDate) / (1000 * 60 * 60 * 24);
            return daysDiff > 14; // Assuming 14 days borrowing period
        }
        return false;
    }).length;
    
    return overdueCount;
}

// Books functions
function loadBooks() {
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '';
    
    books.forEach(book => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
    });
}

function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
        <div class="book-header">
            <h3 class="book-title">${book.title}</h3>
            <span class="book-status ${book.status}">${book.status}</span>
        </div>
        <p class="book-author">by ${book.author}</p>
        <span class="book-category">${book.category}</span>
        <div class="book-actions">
            ${currentUser && currentUser.role === 'librarian' ? `
                <button class="book-btn primary" onclick="toggleBookStatus(${book.id})">
                    ${book.status === 'available' ? 'Mark as Borrowed' : 'Mark as Available'}
                </button>
                <button class="book-btn secondary" onclick="editBook(${book.id})">Edit</button>
            ` : `
                <button class="book-btn primary" ${book.status === 'borrowed' ? 'disabled' : ''} onclick="borrowBook(${book.id})">
                    ${book.status === 'available' ? 'Borrow' : 'Not Available'}
                </button>
            `}
        </div>
    `;
    
    return card;
}

function filterBooks() {
    const searchTerm = document.getElementById('bookSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || 
                            book.author.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    const booksGrid = document.getElementById('booksGrid');
    booksGrid.innerHTML = '';
    
    filteredBooks.forEach(book => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
    });
}

function showAddBookModal() {
    document.getElementById('addBookModal').classList.add('show');
}

function handleAddBook(e) {
    e.preventDefault();
    
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const category = document.getElementById('bookCategory').value;
    const isbn = document.getElementById('bookISBN').value;
    
    const newBook = {
        id: generateId(),
        title,
        author,
        category,
        isbn,
        status: 'available',
        borrowedBy: null,
        borrowedDate: null
    };
    
    books.push(newBook);
    closeModal('addBookModal');
    loadBooks();
    
    // Reset form
    document.getElementById('addBookForm').reset();
    
    console.log('Book added:', newBook);
}

function toggleBookStatus(bookId) {
    const book = books.find(b => b.id === bookId);
    if (book) {
        if (book.status === 'available') {
            book.status = 'borrowed';
            book.borrowedDate = new Date().toISOString().split('T')[0];
            book.borrowedBy = 'system@library.com'; // In real app, this would be the borrower
        } else {
            book.status = 'available';
            book.borrowedDate = null;
            book.borrowedBy = null;
        }
        loadBooks();
        console.log('Book status updated:', book);
    }
}

function borrowBook(bookId) {
    if (!currentUser) return;
    
    const book = books.find(b => b.id === bookId);
    if (book && book.status === 'available') {
        book.status = 'borrowed';
        book.borrowedBy = currentUser.email;
        book.borrowedDate = new Date().toISOString().split('T')[0];
        
        loadBooks();
        console.log('Book borrowed:', book);
        alert(`You have successfully borrowed "${book.title}"`);
    }
}

// Members functions
function loadMembers() {
    const tableBody = document.getElementById('membersTableBody');
    tableBody.innerHTML = '';
    
    members.forEach(member => {
        const row = createMemberRow(member);
        tableBody.appendChild(row);
    });
}

function createMemberRow(member) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td><span class="member-role ${member.role}">${member.role}</span></td>
        <td>${member.booksBorrowed || 0}</td>
        <td>
            <div class="member-actions">
                <button class="member-btn edit" onclick="editMember(${member.id})">Edit</button>
                <button class="member-btn delete" onclick="deleteMember(${member.id})">Delete</button>
            </div>
        </td>
    `;
    
    return row;
}

function showAddMemberModal() {
    document.getElementById('addMemberModal').classList.add('show');
}

function handleAddMember(e) {
    e.preventDefault();
    
    const name = document.getElementById('memberName').value;
    const email = document.getElementById('memberEmail').value;
    const role = document.getElementById('memberRole').value;
    
    const newMember = {
        id: generateId(),
        name,
        email,
        role,
        booksBorrowed: 0,
        joinDate: new Date().toISOString().split('T')[0]
    };
    
    members.push(newMember);
    closeModal('addMemberModal');
    loadMembers();
    
    // Reset form
    document.getElementById('addMemberForm').reset();
    
    console.log('Member added:', newMember);
}

function editMember(memberId) {
    const member = members.find(m => m.id === memberId);
    if (member) {
        const newName = prompt('Enter new name:', member.name);
        if (newName && newName.trim()) {
            member.name = newName.trim();
            loadMembers();
            console.log('Member updated:', member);
        }
    }
}

function deleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        const index = members.findIndex(m => m.id === memberId);
        if (index > -1) {
            const deletedMember = members.splice(index, 1)[0];
            loadMembers();
            console.log('Member deleted:', deletedMember);
        }
    }
}

// Reports functions
function loadReports() {
    // In a real application, this would load actual report data
    console.log('Loading reports for period:', document.getElementById('reportPeriod').value);
}

function updateReports() {
    const period = document.getElementById('reportPeriod').value;
    console.log('Updating reports for period:', period);
    // In a real application, this would update the charts and statistics
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Utility functions
function generateId() {
    return Date.now() + Math.random();
}

// Make functions global for onclick handlers
window.showSignup = showSignup;
window.showLogin = showLogin;
window.logout = logout;
window.navigateTo = navigateTo;
window.filterBooks = filterBooks;
window.showAddBookModal = showAddBookModal;
window.showAddMemberModal = showAddMemberModal;
window.closeModal = closeModal;
window.toggleBookStatus = toggleBookStatus;
window.borrowBook = borrowBook;
window.editMember = editMember;
window.deleteMember = deleteMember;
window.updateReports = updateReports;





// Replace the below config with YOUR OWN from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDurbk7oNPTC7X7-nRcx6mF92y1qp_TxiA",
  authDomain: "libhero-27994.firebaseapp.com",
  projectId: "libhero-27994",
  appId: "1:1089197549040:web:8fd919d0c119d2ba6d6935",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(user => {
      document.getElementById("status").innerText = "Signup successful!";
    })
    .catch(error => {
      document.getElementById("status").innerText = error.message;
    });
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(user => {
      document.getElementById("status").innerText = "Login successful!";
    })
    .catch(error => {
      document.getElementById("status").innerText = error.message;
    });
}

function logout() {
  auth.signOut()
    .then(() => {
      document.getElementById("status").innerText = "Logged out";
    });
}
