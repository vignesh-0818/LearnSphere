/* Dashboard Logic: Search, Dropdowns, Notifications */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Session Check & Header Population
    const currentUserStr = localStorage.getItem('currentUser');
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
    
    const isDash = window.location.pathname.includes('student-') || window.location.pathname.includes('admin-');
    const isAuthPage = window.location.pathname.includes('login') || window.location.pathname.includes('register');
    
    if (isDash && !isAuthPage) {
        if (currentUser) {
            const nameEls = document.querySelectorAll('.user-name, [data-user-name]');
            const classEls = document.querySelectorAll('.user-role, [data-user-class]');
            
            function updateHeaderUI(user) {
                nameEls.forEach(el => {
                    if(el.tagName === 'INPUT') el.value = user.name;
                    else el.textContent = user.name;
                });
                classEls.forEach(el => {
                    const roleText = user.role === 'admin' ? 'Administrator' : (user.class || 'Student');
                    if(el.tagName === 'INPUT') el.value = roleText;
                    else el.textContent = roleText;
                });
            }
            updateHeaderUI(currentUser);

            // Populate Admin Profile Form if it exists
            const profileForm = document.getElementById('adminProfileForm');
            if (profileForm) {
                const nameInput = document.getElementById('profileName');
                const emailInput = document.getElementById('profileEmail');
                const phoneInput = document.getElementById('profilePhone');
                
                if (nameInput) nameInput.value = currentUser.name || '';
                if (emailInput) emailInput.value = currentUser.email || '';
                if (phoneInput) phoneInput.value = currentUser.phone || '';

                profileForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const oldEmail = currentUser.email;
                    currentUser.name = nameInput ? nameInput.value.trim() : currentUser.name;
                    currentUser.email = emailInput ? emailInput.value.trim() : currentUser.email;
                    currentUser.phone = phoneInput ? phoneInput.value.trim() : currentUser.phone;
                    
                    // Update localStorage
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Update users array in localStorage if exists
                    const usersStr = localStorage.getItem('users');
                    if (usersStr) {
                        const users = JSON.parse(usersStr);
                        const userIndex = users.findIndex(u => u.email === oldEmail || (u.name === currentUser.name && u.role === currentUser.role));
                        if (userIndex !== -1) {
                            users[userIndex].name = currentUser.name;
                            users[userIndex].email = currentUser.email;
                            users[userIndex].phone = currentUser.phone;
                            localStorage.setItem('users', JSON.stringify(users));
                        }
                    }
                    
                    updateHeaderUI(currentUser);
                    if (typeof showToast === 'function') showToast('Profile updated successfully');
                });
            }
        }
    }
    
    // 2. Dropdown & Notifications Toggling
    const userAvatar = document.querySelector('[data-user-toggle]');
    const userDropdown = document.querySelector('[data-user-dropdown]');
    
    const notifBtn = document.querySelector('[data-notif-toggle]');
    const notifDropdown = document.querySelector('[data-notif-dropdown]');
    
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isShowing = userDropdown.classList.contains('show');
            userDropdown.classList.toggle('show');
            userAvatar.setAttribute('aria-expanded', !isShowing ? 'true' : 'false');
            if(notifDropdown) notifDropdown.classList.remove('is-active');
        });
    }
    
    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            notifDropdown.classList.toggle('is-active');
            if(userDropdown) {
                userDropdown.classList.remove('show');
                if(userAvatar) userAvatar.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    document.addEventListener('click', () => {
        if (userDropdown) {
            userDropdown.classList.remove('show');
            if(userAvatar) userAvatar.setAttribute('aria-expanded', 'false');
        }
        if (notifDropdown) notifDropdown.classList.remove('is-active');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (userDropdown) {
                userDropdown.classList.remove('show');
                if(userAvatar) userAvatar.setAttribute('aria-expanded', 'false');
            }
            if (notifDropdown) notifDropdown.classList.remove('is-active');
        }
    });
    
    if (userDropdown) userDropdown.addEventListener('click', e => e.stopPropagation());
    if (notifDropdown) notifDropdown.addEventListener('click', e => e.stopPropagation());
    
    // 3. Global Search Functionality
    const globalSearchData = [
        { title: "Rahul Sharma", type: "Student", url: "admin-students.html" },
        { title: "Amelia Hart", type: "Student", url: "admin-students.html" },
        { title: "Karan Verma", type: "Student", url: "admin-students.html" },
        { title: "Ananya Patel", type: "Student", url: "admin-students.html" },
        { title: "Mathematics", type: "Subject", url: "admin-courses.html" },
        { title: "Mathematics Mastery", type: "Course", url: "admin-courses.html" },
        { title: "Math-A1", type: "Batch", url: "admin-batches.html" },
        { title: "Monthly Math", type: "Test", url: "admin-tests.html" },
        { title: "Exam Preparation", type: "Blog", url: "blog.html" },
        { title: "Mr. Smith", type: "Tutor", url: "admin-tutors.html" },
        { title: "Dr. Adams", type: "Tutor", url: "admin-tutors.html" },
        { title: "Weekly Report", type: "Analytics", url: "admin-analytics.html" }
    ];

    const searchForms = document.querySelectorAll('[data-dash-search]');
    searchForms.forEach(form => {
        const input = form.querySelector('input');
        if (!input) return;

        form.style.position = 'relative';
        
        let resultsDropdown = form.querySelector('.search-results-dropdown');
        if (!resultsDropdown) {
            resultsDropdown = document.createElement('div');
            resultsDropdown.className = 'search-results-dropdown';
            resultsDropdown.style.cssText = 'position:absolute; top:100%; left:0; right:0; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); box-shadow:var(--shadow-lg); z-index:100; max-height:300px; overflow-y:auto; margin-top:0.5rem; display:none; flex-direction:column; padding:0.5rem; gap:0.25rem;';
            form.appendChild(resultsDropdown);
        }

        input.addEventListener('input', (e) => {
            const query = input.value.trim().toLowerCase();
            resultsDropdown.innerHTML = '';
            
            if (query === '') {
                resultsDropdown.style.display = 'none';
                return;
            }

            resultsDropdown.style.display = 'flex';
            
            const matches = globalSearchData.filter(item => item.title.toLowerCase().includes(query) || item.type.toLowerCase().includes(query));
            
            if (matches.length > 0) {
                matches.forEach(match => {
                    const btn = document.createElement('a');
                    btn.href = match.url;
                    btn.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0.75rem; border-radius:var(--r-sm); color:var(--text); text-decoration:none; background:transparent; transition:background 0.2s;';
                    btn.innerHTML = `<span style="font-weight:600;">${match.title}</span><span style="font-size:0.75rem; color:var(--text-3); background:var(--surface-2); padding:0.1rem 0.4rem; border-radius:var(--r-pill);">${match.type}</span>`;
                    btn.onmouseover = () => btn.style.background = 'var(--bg-softer)';
                    btn.onmouseout = () => btn.style.background = 'transparent';
                    resultsDropdown.appendChild(btn);
                });
            } else {
                const noRes = document.createElement('div');
                noRes.style.cssText = 'padding:0.75rem; color:var(--text-3); text-align:center; font-size:0.9rem;';
                noRes.textContent = 'No results found';
                resultsDropdown.appendChild(noRes);
            }
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        // Hide when clicking outside
        document.addEventListener('click', (e) => {
            if (!form.contains(e.target)) {
                resultsDropdown.style.display = 'none';
            }
        });
        
        input.addEventListener('focus', () => {
            if (input.value.trim() !== '') {
                resultsDropdown.style.display = 'flex';
            }
        });
    });
    
    // 4. Announcement Form Fix
    const annForm = document.getElementById('announcement-form');
    if (annForm) {
        annForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = annForm.querySelector('input[type="text"]');
            const title = input && input.value.trim() ? input.value.trim() : 'New Announcement';
            
            const textarea = annForm.querySelector('textarea');
            const body = textarea && textarea.value.trim() ? textarea.value.trim() : '';
            
            const toastMsg = `✓ Announcement Posted Successfully\n\n${title}${body ? '\n' + body : ''}`;
            showToast(toastMsg);
            annForm.reset();
        });
    }

    // 5. Logout binds
    const logoutBtns = document.querySelectorAll('[data-action="logout"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if(window.handleLogout) {
                window.handleLogout(e);
            }
        });
    });
});

function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('data-toast', '');
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.innerHTML = `<i class="fa-solid fa-circle-check" aria-hidden="true"></i><p style="white-space:pre-wrap;"></p>`;
        document.body.appendChild(toast);
    }
    const p = toast.querySelector('p');
    if(p) p.textContent = msg;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), 3000);
}
