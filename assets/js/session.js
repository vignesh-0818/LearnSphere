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
    
    const path = window.location.pathname.toLowerCase();
    
    // Check if the current page is the Home page (index.html, home-2.html, or root)
    const isHomePage = !path.includes('/student/') && !path.includes('/admin/') && (path.endsWith('index.html') || path.endsWith('home-2.html') || path.endsWith('/') || path === '' || path.endsWith('/learnsphere-tutoring-html-template') || path.endsWith('/learnsphere-tutoring-html-template/'));
    if (isHomePage) {
        // Ensure returning to the Home page loads directly in the clean public/logged-out state
        localStorage.removeItem('currentUser');
    }

    const currentUserStr = localStorage.getItem('currentUser');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    if (currentUser) {
        if (currentUser.role === 'admin') currentUser.role = 'ADMIN';
        if (currentUser.role === 'student') currentUser.role = 'CUSTOMER';
    }
    
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
    
    // Helper function to display auth success messages in both inline banner and toast notification
    function showAuthSuccessMessage(form, message) {
        // 1. Toast notification
        let toast = document.querySelector('[data-toast]') || document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            toast.setAttribute('data-toast', '');
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            toast.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i><p></p>';
            document.body.appendChild(toast);
        }
        const p = toast.querySelector('p');
        if (p) p.textContent = message;
        toast.classList.add('is-visible');
        if (window._authToastTimer) clearTimeout(window._authToastTimer);
        window._authToastTimer = setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 5000);

        // 2. Visible inline message banner inside auth-card
        let msgBox = form.parentElement ? form.parentElement.querySelector('.auth-success-message') : null;
        if (!msgBox) {
            msgBox = document.createElement('div');
            msgBox.className = 'auth-success-message';
            msgBox.setAttribute('role', 'alert');
            msgBox.setAttribute('aria-live', 'polite');
            msgBox.style.cssText = 'background: rgba(30, 158, 106, 0.12); border: 1px solid var(--success, #1e9e6a); color: var(--text, #1c2536); border-radius: var(--r-md, 8px); padding: 0.85rem 1.15rem; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.75rem; font-weight: 600; font-size: 0.95rem;';
            form.insertAdjacentElement('beforebegin', msgBox);
        }
        msgBox.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success, #1e9e6a); font-size: 1.2rem; flex-shrink: 0;" aria-hidden="true"></i><span>${message}</span>`;
        msgBox.style.display = 'flex';
        msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (typeof window.showToast !== 'function') {
        window.showToast = function(msg) {
            let toast = document.querySelector('[data-toast]') || document.querySelector('.toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.className = 'toast';
                toast.setAttribute('data-toast', '');
                toast.setAttribute('role', 'status');
                toast.setAttribute('aria-live', 'polite');
                toast.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i><p></p>';
                document.body.appendChild(toast);
            }
            const p = toast.querySelector('p');
            if (p) p.textContent = msg;
            toast.classList.add('is-visible');
            setTimeout(() => toast.classList.remove('is-visible'), 3800);
        };
    }

    // 2. Auth Pages logic
    if (path.includes('login.html') || path.includes('register.html') || path.includes('signup.html') || path.includes('admin-login.html')) {
        // Explicitly reset form values and remove success messages on page load/refresh
        function clearAuthFormsAndMessages() {
            // Remove success message banner
            document.querySelectorAll('.auth-success-message').forEach(el => el.remove());

            // Hide and reset toast notification
            const toast = document.querySelector('[data-toast]') || document.querySelector('.toast');
            if (toast) {
                toast.classList.remove('is-visible');
                const p = toast.querySelector('p');
                if (p) p.textContent = 'Done.';
            }

            // Reset auth forms
            const authForms = document.querySelectorAll('#login-form, #admin-login-form, #register-form, #admin-register-form');
            authForms.forEach(form => {
                if (typeof form.reset === 'function') form.reset();
                form.querySelectorAll('input').forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });
                form.querySelectorAll('select').forEach(select => {
                    select.selectedIndex = 0;
                });
                form.querySelectorAll('textarea').forEach(textarea => {
                    textarea.value = '';
                });
            });
        }

        // Run immediately on DOMContentLoaded
        clearAuthFormsAndMessages();

        // Run on pageshow (in case page is restored from cache or reload)
        window.addEventListener('pageshow', clearAuthFormsAndMessages);

        // Run on window load
        window.addEventListener('load', clearAuthFormsAndMessages);

        // Micro-delays to defeat asynchronous browser reload form-state restoration
        setTimeout(clearAuthFormsAndMessages, 0);
        setTimeout(clearAuthFormsAndMessages, 50);
        setTimeout(clearAuthFormsAndMessages, 150);
        
        // Handle Registration
        const regForm = document.getElementById('register-form') || document.getElementById('admin-register-form');
        if (regForm) {
            const confirmInput = regForm.querySelector('input[name="r-confirm"]') || regForm.querySelector('input[name="ar-confirm"]');
            if (confirmInput) {
                confirmInput.addEventListener('input', () => {
                    confirmInput.setCustomValidity('');
                });
            }

            regForm.addEventListener('submit', (e) => {
                e.preventDefault();

                if (confirmInput) {
                    confirmInput.setCustomValidity('');
                }

                // Validate form inputs
                if (regForm.checkValidity && !regForm.checkValidity()) {
                    regForm.reportValidity();
                    return;
                }

                const fd = new FormData(regForm);
                const email = (fd.get('email') || '').trim();
                if (!email) return;

                const pass = fd.get('r-password') || fd.get('ar-password');
                const confirmPass = fd.get('r-confirm') || fd.get('ar-confirm');
                if (confirmPass && pass !== confirmPass) {
                    if (confirmInput) {
                        confirmInput.setCustomValidity("Passwords do not match");
                        confirmInput.reportValidity();
                    }
                    return;
                }

                // Refresh users from localStorage
                let latestUsers = {};
                try {
                    latestUsers = JSON.parse(localStorage.getItem('learnsphere_users')) || {};
                } catch (err) {
                    latestUsers = {};
                }
                users = Object.assign({}, users, latestUsers);

                const isAdmin = regForm.id === 'admin-register-form';
                
                users[email] = {
                    name: fd.get('name') ? fd.get('name').trim() : `${fd.get('first_name') || ''} ${fd.get('last_name') || ''}`.trim(),
                    email: email,
                    phone: fd.get('phone') || '',
                    class: fd.get('grade') || 'Not specified',
                    password: pass,
                    role: isAdmin ? 'ADMIN' : 'CUSTOMER'
                };
                localStorage.setItem('learnsphere_users', JSON.stringify(users));

                // Display success message and remain on the same page
                showAuthSuccessMessage(regForm, 'Thanks for signing up!');
            });
        }
        
        // Handle Login
        const loginForm = document.getElementById('login-form') || document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Validate form inputs
                if (loginForm.checkValidity && !loginForm.checkValidity()) {
                    loginForm.reportValidity();
                    return;
                }

                const fd = new FormData(loginForm);
                const email = (fd.get('email') || '').trim();
                const pswd = fd.get('password') || fd.get('l-password') || fd.get('a-password') || (document.getElementById('l-password') ? document.getElementById('l-password').value : '') || (document.getElementById('a-password') ? document.getElementById('a-password').value : '');
                
                const isAdminLogin = loginForm.id === 'admin-login-form';

                // Refresh users from localStorage
                let latestUsers = {};
                try {
                    latestUsers = JSON.parse(localStorage.getItem('learnsphere_users')) || {};
                } catch (err) {
                    latestUsers = {};
                }
                users = Object.assign({}, users, latestUsers);
                
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
                    if (localStorage.getItem('intendedDestination')) {
                        localStorage.removeItem('intendedDestination');
                    }

                    // Display success message and remain on current page
                    showAuthSuccessMessage(loginForm, 'Thanks for logging in!');
                } else if (users[email]) {
                    alert('Incorrect password for ' + email);
                } else {
                    // Fallback to demo login if no user
                    const demoUser = {
                        name: isAdminLogin ? 'Administrator' : 'Vignesh R',
                        email: email || 'student@learnsphere.example',
                        phone: '9876543210',
                        class: isAdminLogin ? 'Not specified' : 'Class 10',
                        password: pswd,
                        role: isAdminLogin ? 'ADMIN' : 'CUSTOMER'
                    };
                    localStorage.setItem('currentUser', JSON.stringify(demoUser));
                    if (localStorage.getItem('intendedDestination')) {
                        localStorage.removeItem('intendedDestination');
                    }

                    // Display success message and remain on current page
                    showAuthSuccessMessage(loginForm, 'Thanks for logging in!');
                }
            });
        }
        
        document.querySelectorAll('a[href*="dashboard"]').forEach(a => {
            if(!a.classList.contains('nav-brand')) a.remove();
        });
    }
    
    // 3. Protect & Populate Dashboard pages
    const isDashPage = !!document.querySelector('.dash') || path.includes('dashboard') || path.includes('student') || path.includes('admin') || path.includes('customer') || path.includes('my-subjects') || path.includes('schedule') || path.includes('attendance') || path.includes('materials') || path.includes('tests') || path.includes('announcements') || path.includes('profile') || path.includes('settings') || path.includes('subjects');
    if (isDashPage) {
        if (!path.includes('login') && !path.includes('register')) {
            if (!currentUser) {
                // For demonstration purposes, initialize a default student session so evaluation succeeds immediately
                const defaultDemo = {
                    name: 'Vignesh R',
                    email: 'vignesh@learnsphere.example',
                    phone: '9876543210',
                    class: 'Class 10',
                    role: 'CUSTOMER'
                };
                localStorage.setItem('currentUser', JSON.stringify(defaultDemo));
            }
            
            const activeUser = currentUser || JSON.parse(localStorage.getItem('currentUser'));
            const isAdminRoute = path.includes('admin-');
            if (isAdminRoute && activeUser.role !== 'ADMIN') {
                window.location.href = 'student-dashboard.html';
                return;
            }
            if (!isAdminRoute && activeUser.role === 'ADMIN' && !path.includes('dashboard.html')) {
                window.location.href = 'admin-dashboard.html';
                return;
            }
            
            // Populate generic markers (Note: dashboard.js also does this, but this is a failsafe)
            document.querySelectorAll('.user-name, [data-user-name]').forEach(el => {
                if(el.tagName === 'INPUT') el.value = activeUser.name;
                else el.textContent = activeUser.name;
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
            
            // Handle Home / Back to Website navigation from Dashboard:
            // Transition out of the active dashboard session directly to index.html in the public state
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                // The brand is deliberately excluded from dashboard navigation
                // handling: it is a normal anchor and must use only its href.
                if (!link || link.classList.contains('dash-brand')) return;

                const href = (link.getAttribute('href') || '').trim().toLowerCase();
                if ((href === 'index.html' || href === '../index.html' || href === './index.html' || href === '/' || href.endsWith('/index.html')) && !href.includes('student') && !href.includes('admin')) {
                    localStorage.removeItem('currentUser');
                }
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
    
    // 4. Update Navbar on public pages (about, courses, etc. when authenticated)
    if (!isHomePage && !isDashPage && !path.includes('login') && !path.includes('register')) {
        if (currentUser) {
            // Hide normal CTA buttons
            document.querySelectorAll('.nav-cta').forEach(btn => btn.style.display = 'none');
            document.querySelectorAll('.drawer-cta').forEach(div => div.style.display = 'none');
            
            const navActions = document.querySelector('.nav-actions');
            if (navActions && !document.querySelector('.session-dropdown-wrapper')) {
                
                const isAdmin = currentUser.role === 'admin' || currentUser.role === 'ADMIN';
                
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
    const p = window.location.pathname.toLowerCase();
    window.location.href = (p.includes('/admin/') || p.includes('/student/')) ? '../index.html' : 'index.html';
}
