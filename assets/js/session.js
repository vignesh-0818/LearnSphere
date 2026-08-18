/* session.js - Handles Auth State and Navigation */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Mock Database
    let usersStr = localStorage.getItem('learnsphere_users');
    let users = usersStr ? JSON.parse(usersStr) : {};
    
    // Normalize existing roles
    Object.values(users).forEach(user => {
        if (user.role === 'admin') user.role = 'ADMIN';
        if (user.role === 'student') user.role = 'CUSTOMER';
    });
    
    const currentUserStr = localStorage.getItem('currentUser');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    if (currentUser) {
        if (currentUser.role === 'admin') currentUser.role = 'ADMIN';
        if (currentUser.role === 'student') currentUser.role = 'CUSTOMER';
    }
    
    const path = window.location.pathname.toLowerCase();
    
    // Handle Pricing Plan Clicks
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && (target.textContent.includes('Choose Basic') || target.textContent.includes('Choose Standard') || target.textContent.includes('Choose Premium'))) {
            if (currentUser) {
                e.preventDefault();
                window.location.href = 'contact.html';
            } else {
                localStorage.setItem('intendedDestination', 'contact.html');
            }
        }
    });
    
    // 2. Auth Pages logic
    if (path.includes('login.html') || path.includes('register.html') || path.includes('signup.html') || path.includes('admin-login.html')) {
        if (currentUser) {
            window.location.href = currentUser.role === 'ADMIN' ? 'admin-dashboard.html' : 'student-dashboard.html';
            return;
        }
        
        // Force clear inputs on load to prevent any browser autofill or saved credentials from appearing
        const emailInputs = document.querySelectorAll('input[type="email"]');
        const passInputs = document.querySelectorAll('input[type="password"]');
        emailInputs.forEach(input => input.value = '');
        passInputs.forEach(input => input.value = '');
        
        // Handle Registration
        const regForm = document.getElementById('register-form') || document.getElementById('admin-register-form');
        if (regForm) {
            regForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fd = new FormData(regForm);
                const email = fd.get('email');
                if (!email) return;
                
                const isAdmin = regForm.id === 'admin-register-form';
                
                users[email] = {
                    name: fd.get('name') ? fd.get('name').trim() : `${fd.get('first_name') || ''} ${fd.get('last_name') || ''}`.trim(),
                    email: email,
                    phone: fd.get('phone') || '',
                    class: fd.get('grade') || 'Not specified',
                    password: fd.get('r-password') || fd.get('ar-password'),
                    role: isAdmin ? 'ADMIN' : 'CUSTOMER'
                };
                localStorage.setItem('learnsphere_users', JSON.stringify(users));
                window.location.href = isAdmin ? 'admin-login.html' : 'login.html';
            });
        }
        
        // Handle Login
        const loginForm = document.getElementById('login-form') || document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fd = new FormData(loginForm);
                const email = fd.get('email');
                const pswd = fd.get('password') || fd.get('l-password') || fd.get('a-password') || (document.getElementById('l-password') ? document.getElementById('l-password').value : '') || (document.getElementById('a-password') ? document.getElementById('a-password').value : '');
                
                const isAdminLogin = loginForm.id === 'admin-login-form';
                
                if (users[email] && users[email].password === pswd) {
                    const userRole = users[email].role;
                    if (isAdminLogin && userRole !== 'ADMIN') {
                        alert('You do not have administrator access.');
                        return;
                    }
                    if (!isAdminLogin && userRole === 'ADMIN') {
                        alert('Admins must log in through the admin portal.');
                        return;
                    }
                    localStorage.setItem('currentUser', JSON.stringify(users[email]));
                    const intended = localStorage.getItem('intendedDestination');
                    if (intended) {
                        localStorage.removeItem('intendedDestination');
                        window.location.href = intended;
                    } else {
                        window.location.href = userRole === 'ADMIN' ? 'admin-dashboard.html' : 'student-dashboard.html';
                    }
                } else if (users[email]) {
                    alert('Incorrect password for ' + email);
                } else {
                    // Fallback to demo login if no user
                    const demoUser = {
                        name: isAdminLogin ? 'Vignesh R' : 'Vignesh R',
                        email: email,
                        phone: '9876543210',
                        class: isAdminLogin ? 'Not specified' : 'Class 10',
                        password: pswd,
                        role: isAdminLogin ? 'ADMIN' : 'CUSTOMER'
                    };
                    localStorage.setItem('currentUser', JSON.stringify(demoUser));
                    const intended = localStorage.getItem('intendedDestination');
                    if (intended) {
                        localStorage.removeItem('intendedDestination');
                        window.location.href = intended;
                    } else {
                        window.location.href = isAdminLogin ? 'admin-dashboard.html' : 'student-dashboard.html';
                    }
                }
            });
        }
        
        document.querySelectorAll('a[href*="dashboard"]').forEach(a => {
            if(!a.classList.contains('nav-brand')) a.remove();
        });
    }
    
    // 3. Protect & Populate Dashboard pages
    if (path.includes('student-') || path.includes('admin-') || path.includes('customer-')) {
        if (!path.includes('login') && !path.includes('register')) {
            if (!currentUser) {
                window.location.href = path.includes('admin-') ? 'admin-login.html' : 'login.html';
                return;
            }
            
            const isAdminRoute = path.includes('admin-');
            if (isAdminRoute && currentUser.role !== 'ADMIN') {
                window.location.href = 'student-dashboard.html';
                return;
            }
            if (!isAdminRoute && currentUser.role === 'ADMIN') {
                window.location.href = 'admin-dashboard.html';
                return;
            }
            
            // Populate generic markers (Note: dashboard.js also does this, but this is a failsafe)
            document.querySelectorAll('.user-name, [data-user-name]').forEach(el => {
                if(el.tagName === 'INPUT') el.value = currentUser.name;
                else el.textContent = currentUser.name;
            });
            
            // Populate specific profile form if exists
            const profForm = document.getElementById('profile-form');
            if (profForm) {
                if(document.getElementById('prof-name')) document.getElementById('prof-name').value = currentUser.name;
                if(document.getElementById('prof-email')) document.getElementById('prof-email').value = currentUser.email;
                if(document.getElementById('prof-phone')) document.getElementById('prof-phone').value = currentUser.phone || '';
                if(document.getElementById('prof-class')) document.getElementById('prof-class').value = currentUser.class || '';
                
                profForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const newName = document.getElementById('prof-name') ? document.getElementById('prof-name').value : currentUser.name;
                    const newPhone = document.getElementById('prof-phone') ? document.getElementById('prof-phone').value : currentUser.phone;
                    const newEmail = document.getElementById('prof-email') ? document.getElementById('prof-email').value : currentUser.email;
                    
                    currentUser.name = newName;
                    currentUser.phone = newPhone;
                    currentUser.email = newEmail;
                    
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    if (users[currentUser.email]) {
                        users[currentUser.email].name = newName;
                        users[currentUser.email].phone = newPhone;
                        users[currentUser.email].email = newEmail;
                        localStorage.setItem('learnsphere_users', JSON.stringify(users));
                    }
                    
                    document.querySelectorAll('.user-name, [data-user-name]').forEach(el => {
                        if(el.tagName !== 'INPUT') el.textContent = newName;
                    });
                    
                    const msg = document.getElementById('profile-msg');
                    if(msg) {
                        msg.style.display = 'block';
                        setTimeout(() => msg.style.display = 'none', 3000);
                    }
                });
            }
            
            // Search functionality
            document.querySelectorAll('[data-dash-search]').forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const q = form.querySelector('input') ? form.querySelector('input').value : '';
                    alert(`No results found for "${q}"`);
                });
            });
            
            // Logout buttons in dash
            document.querySelectorAll('[data-action="logout"]').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.handleLogout();
                });
            });
        }
    }
    
    // 4. Update Navbar on public pages (index, about, etc.)
    if (!path.includes('student-') && !path.includes('admin-') && !path.includes('customer-') && !path.includes('login') && !path.includes('register')) {
        if (currentUser) {
            // Hide normal CTA buttons
            document.querySelectorAll('.nav-cta').forEach(btn => btn.style.display = 'none');
            document.querySelectorAll('.drawer-cta').forEach(div => div.style.display = 'none');
            
            const navActions = document.querySelector('.nav-actions');
            if (navActions && !document.querySelector('.session-dropdown-wrapper')) {
                
                const isAdmin = currentUser.role === 'admin';
                
                let linksHTML = '';
                if(isAdmin) {
                    linksHTML = `
                        <a href="admin-dashboard.html">Dashboard</a>
                        <a href="admin-profile.html">Profile</a>
                        <a href="admin-settings.html">Settings</a>
                    `;
                } else {
                    linksHTML = `
                        <a href="student-dashboard.html">Dashboard</a>
                        <a href="student-subjects.html">My Subjects</a>
                        <a href="student-schedule.html">Class Schedule</a>
                        <a href="student-attendance.html">Attendance</a>
                        <a href="student-materials.html">Study Materials</a>
                        <a href="student-tests.html">Upcoming Tests</a>
                        <a href="student-results.html">Results</a>
                        <a href="student-profile.html">Profile</a>
                        <a href="student-settings.html">Settings</a>
                    `;
                }
                
                const dropHTML = `
                <div class="dropdown-wrapper session-dropdown-wrapper" style="position:relative; margin-inline-start:.5rem; display:flex; align-items:center;">
                    <button class="profile-trigger" type="button" aria-haspopup="true" aria-expanded="false" id="session-user-toggle">
                        <img class="avatar avatar-sm" src="assets/images/tutor-2.jpg" alt="Profile" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">
                        <span style="font-weight:600;color:var(--text);">${currentUser.name}</span>
                        <i class="fa-solid fa-chevron-down" style="font-size:12px;color:var(--text-2);"></i>
                    </button>
                    <div class="profile-dropdown-menu" id="session-user-dropdown">
                        ${linksHTML}
                        <hr style="margin: 0.5rem 0; border: none; border-top: 1px solid var(--border);">
                        <a href="#" onclick="handleLogout(event)" class="text-danger">Logout</a>
                    </div>
                </div>`;
                
                const navToggle = navActions.querySelector('.nav-toggle');
                if (navToggle) {
                    navToggle.insertAdjacentHTML('beforebegin', dropHTML);
                } else {
                    navActions.insertAdjacentHTML('beforeend', dropHTML);
                }
                
                const tog = document.getElementById('session-user-toggle');
                const drop = document.getElementById('session-user-dropdown');
                
                if (tog && drop) {
                    tog.addEventListener('click', (e) => {
                        e.stopPropagation();
                        drop.classList.toggle('show');
                        tog.setAttribute('aria-expanded', drop.classList.contains('show') ? 'true' : 'false');
                    });
                    
                    document.addEventListener('click', (e) => {
                        if (drop.classList.contains('show') && !document.querySelector('.session-dropdown-wrapper').contains(e.target)) {
                            drop.classList.remove('show');
                            tog.setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape') {
                            drop.classList.remove('show');
                            tog.setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    drop.addEventListener('click', e => e.stopPropagation());
                }
            }
        }
    }
});

window.handleLogout = function(e) {
    if(e) e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
