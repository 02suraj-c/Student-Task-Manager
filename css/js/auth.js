/* Simple front-end-only auth (demo). Data lives in the browser's localStorage. */
const USERS_KEY = "stm_users";
const SESSION_KEY = "stm_session";

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch { return []; }
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

// Seed the demo user
(function seed() {
  const users = getUsers();
  if (!users.some(u => u.email === "student@demo.com")) {
    users.push({ name: "Demo Student", email: "student@demo.com", password: "student123" });
    saveUsers(users);
  }
})();

// Already logged in? go straight to the dashboard
if (localStorage.getItem(SESSION_KEY)) location.replace("dashboard.html");

const $ = id => document.getElementById(id);
const msg = $("msg");
function show(text, type) { msg.textContent = text; msg.className = "msg " + type; }

function switchTab(toSignup) {
  $("login-form").hidden = toSignup;
  $("signup-form").hidden = !toSignup;
  $("tab-login").classList.toggle("active", !toSignup);
  $("tab-signup").classList.toggle("active", toSignup);
  show("", "");
}
$("tab-login").onclick = () => switchTab(false);
$("tab-signup").onclick = () => switchTab(true);

const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

$("login-form").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("login-email").value.trim().toLowerCase();
  const pass = $("login-pass").value;
  if (!validEmail(email) || !pass) return show("Please enter a valid email and password.", "error");
  const user = getUsers().find(u => u.email === email && u.password === pass);
  if (!user) return show("Email or password is incorrect.", "error");
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
  show("Welcome back! Opening your dashboard…", "ok");
  setTimeout(() => location.href = "dashboard.html", 500);
});

$("signup-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("su-name").value.trim();
  const email = $("su-email").value.trim().toLowerCase();
  const pass = $("su-pass").value;
  if (!name) return show("Please enter your name.", "error");
  if (!validEmail(email)) return show("Please enter a valid email.", "error");
  if (pass.length < 6) return show("Password must be at least 6 characters.", "error");
  const users = getUsers();
  if (users.some(u => u.email === email)) return show("That email is already registered.", "error");
  users.push({ name, email, password: pass });
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email }));
  show("Account created! Opening your dashboard…", "ok");
  setTimeout(() => location.href = "dashboard.html", 600);
});