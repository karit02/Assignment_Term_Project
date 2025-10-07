// เก็บข้อมูลผู้ใช้ไว้ใน localStorage (เพื่อ demo)
const DEFAULT_USERS = [
    { username: 'std',     password: '1234', role: 'student', redirect: 'dashbroadstd.html' },
    { username: 'teacher', password: '1234', role: 'teacher', redirect: 'dashbroadteacher.html' },
    { username: 'visor',   password: '1234', role: 'visor',   redirect: 'dashbroadadvisor.html' },
    { username: 'commit',  password: '1234', role: 'commit',  redirect: 'dashbroadcommit.html' },
    { username: 'admin',   password: '1234', role: 'admin',   redirect: 'dashbroadadmin.html' }
];

const ROLE_REDIRECT = {
    student: 'dashbroadstd.html',
    teacher: 'dashbroadteacher.html',
    visor:   'dashbroadadvisor.html',
    commit:  'dashbroadcommit.html',
    admin:   'dashbroadadmin.html'
};

function loadUsers() {
    const saved = JSON.parse(localStorage.getItem('users') || '[]');
  // seed ผู้ใช้เริ่มต้น ถ้ายังไม่มี
    DEFAULT_USERS.forEach(def => {
    if (!saved.some(u => u.username === def.username)) {
        saved.push(def);
    }
    });
    localStorage.setItem('users', JSON.stringify(saved));
    return saved;
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function findUser(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

function getRoleFromText(txt) {
    const t = (txt || '').toLowerCase();
    if (t.includes('นักศึกษา') || t.includes('student') || t === 'student') return 'student';
    if (t.includes('ปรึกษา') || t.includes('advisor') || t.includes('visor')) return 'visor';
    if (t.includes('ประจำวิชา') || t.includes('teacher')) return 'teacher';
    if (t.includes('กรรมการ') || t.includes('commit')) return 'commit';
    if (t.includes('แอด') || t.includes('admin')) return 'admin';
    return 'student';
}

function redirectByRole(role) {
    const url = ROLE_REDIRECT[role] || 'index.html';
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', () => {
  // เตรียม users เริ่มต้น
loadUsers();

// 1) จัดการหน้า Login
const loginForm = document.querySelector('form#login-form');
if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = (document.getElementById('username')?.value || '').trim();
    const password = (document.getElementById('password')?.value || '').trim();

    const user = findUser(username);
    if (!user) {
        alert('ไม่พบบัญชีผู้ใช้');
        return;
    }
    if (user.password !== password) {
        alert('รหัสผ่านไม่ถูกต้อง');
        return;
    }

    // เก็บสถานะล็อกอิน (demo)
    localStorage.setItem('currentUser', JSON.stringify({ username: user.username, role: user.role }));
    // ไปหน้า dashboard ตาม role
    redirectByRole(user.role);
    });
    }

  // 2) จัดการหน้า Signup
    const signupForm = document.querySelector('form#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

    const username = (document.getElementById('username')?.value || '').trim();
    const password = (document.getElementById('password')?.value || '').trim();
    const confirm  = (document.getElementById('confirm-password')?.value || '').trim();

      // อ่านสถานะจาก dropdown (เอาข้อความที่ผู้ใช้เลือก)
    const statusDropdown = document.querySelector('.status-dropdown');
    const statusText = statusDropdown?.options[statusDropdown.selectedIndex]?.text || '';
    const role = getRoleFromText(statusText);

    if (!username || !password) {
        alert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
        return;
    }
    if (password !== confirm) {
        alert('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert('มีชื่อผู้ใช้นี้ในระบบแล้ว');
        return;
    }

    users.push({ username, password, role, redirect: ROLE_REDIRECT[role] });
    saveUsers(users);

    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    window.location.href = 'login.html';
    });
    }
});