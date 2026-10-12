/* ===================== Student Task Manager — dashboard logic ===================== */
const SESSION_KEY = "stm_session";
const session = (() => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } })();
if (!session) location.replace("index.html");

const $ = id => document.getElementById(id);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COLORS = ["#cfe3d6", "#d8d3ee", "#f8dccb", "#d4e6f0", "#f2cfd3", "#f3e8b8"];
const todayIdx = (new Date().getDay() + 6) % 7; // Mon = 0

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const isoDate = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return isoDate(d); };

/* ---------------- Data store (per user, in localStorage) ---------------- */
const DATA_KEY = "stm_data_" + (session ? session.email : "x");

function defaultData() {
  const subjects = [
    { id: "math", name: "Mathematics", teacher: "Mr. Verma", emoji: "📐", attended: 18, total: 22 },
    { id: "phy", name: "Physics", teacher: "Dr. Mehta", emoji: "🔭", attended: 16, total: 21 },
    { id: "chem", name: "Chemistry", teacher: "Ms. Iyer", emoji: "🧪", attended: 14, total: 20 },
    { id: "eng", name: "English", teacher: "Mrs. Kapoor", emoji: "📖", attended: 19, total: 20 },
    { id: "cs", name: "Computer Science", teacher: "Mr. Rao", emoji: "💻", attended: 20, total: 22 },
    { id: "hist", name: "History", teacher: "Ms. Das", emoji: "🏛️", attended: 11, total: 18 },
  ];
  const classes = [
    ["math", 0, "09:00", "10:00", "Room 101"], ["phy", 0, "10:15", "11:15", "Lab 2"], ["eng", 0, "11:30", "12:30", "Room 104"],
    ["cs", 1, "09:00", "10:30", "Computer Lab"], ["chem", 1, "10:45", "11:45", "Lab 1"], ["hist", 1, "13:00", "14:00", "Room 210"],
    ["math", 2, "09:00", "10:00", "Room 101"], ["eng", 2, "10:15", "11:15", "Room 104"], ["phy", 2, "11:30", "12:30", "Room 108"],
    ["chem", 3, "09:00", "10:00", "Lab 1"], ["cs", 3, "10:15", "11:45", "Computer Lab"], ["math", 3, "13:00", "14:00", "Room 101"],
    ["hist", 4, "09:00", "10:00", "Room 210"], ["phy", 4, "10:15", "11:15", "Lab 2"], ["eng", 4, "11:30", "12:30", "Room 104"],
    ["cs", 5, "10:00", "12:00", "Project Lab"],
  ].map(([subjectId, day, start, end, room]) => ({ id: uid(), subjectId, day, start, end, room }));
  const tasks = [
    { id: uid(), title: "Solve calculus worksheet 5", subjectId: "math", due: addDays(1), priority: "high", done: false },
    { id: uid(), title: "Physics lab report", subjectId: "phy", due: addDays(3), priority: "medium", done: false },
    { id: uid(), title: "Read chapter 7 — Organic basics", subjectId: "chem", due: addDays(4), priority: "low", done: false },
    { id: uid(), title: "Essay: My favourite book", subjectId: "eng", due: addDays(6), priority: "medium", done: false },
    { id: uid(), title: "Build a to-do app (JS)", subjectId: "cs", due: addDays(-1), priority: "high", done: false },
    { id: uid(), title: "History timeline poster", subjectId: "hist", due: addDays(-3), priority: "low", done: true },
  ];
  return { subjects, classes, tasks };
}

let data;
try { data = JSON.parse(localStorage.getItem(DATA_KEY)); } catch { data = null; }
if (!data || !data.subjects) data = defaultData();
const save = () => localStorage.setItem(DATA_KEY, JSON.stringify(data));
save();

const subj = id => data.subjects.find(s => s.id === id);
const colorOf = id => COLORS[Math.max(0, data.subjects.findIndex(s => s.id === id)) % COLORS.length];
const pct = s => (s.total ? Math.round((s.attended / s.total) * 100) : 0);
const barClass = p => (p < 65 ? "low" : p < 75 ? "mid" : "");
const fmtTime = t => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};
const fmtDue = iso => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

/* ---------------- Header, greeting, quote ---------------- */
const hour = new Date().getHours();
const part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
$("greeting").textContent = `${part}, ${session.name.split(" ")[0]} 👋`;
$("user-name").textContent = session.name;
$("user-email").textContent = session.email;
$("date-chip").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });

const QUOTES = [
  ["Small steps every day add up to big results.", "Take it one task at a time 🌱"],
  ["You don't have to be perfect, just consistent.", "Progress over perfection ✨"],
  ["Rest is part of studying too.", "Drink some water and stretch 💧"],
  ["Done is better than perfect.", "Start with the easiest task ☁️"],
];
const q = QUOTES[new Date().getDate() % QUOTES.length];
$("quote").innerHTML = `“${q[0]}”<small>${q[1]}</small>`;

/* ---------------- Navigation ---------------- */
function openSection(name) {
  document.querySelectorAll(".section").forEach(s => s.classList.toggle("active", s.id === name));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.section === name));
  $("sidebar").classList.remove("open");
  window.scrollTo({ top: 0 });
}
document.querySelectorAll(".nav-btn").forEach(b => (b.onclick = () => openSection(b.dataset.section)));
$("menu-toggle").onclick = () => $("sidebar").classList.toggle("open");
$("logout-btn").onclick = () => { localStorage.removeItem(SESSION_KEY); location.href = "index.html"; };

/* ---------------- Overview ---------------- */
function renderOverview() {
  const totalA = data.subjects.reduce((n, s) => n + s.attended, 0);
  const totalT = data.subjects.reduce((n, s) => n + s.total, 0);
  const overall = totalT ? Math.round((totalA / totalT) * 100) : 0;
  const pending = data.tasks.filter(t => !t.done);
  const todays = data.classes.filter(c => c.day === todayIdx).sort((a, b) => a.start.localeCompare(b.start));
  const overdue = pending.filter(t => t.due < isoDate(new Date())).length;

  $("stats").innerHTML = [
    ["c-sage", "📈", overall + "%", "Overall attendance"],
    ["c-peach", "📝", pending.length, overdue ? `Pending tasks (${overdue} overdue)` : "Pending tasks"],
    ["c-lav", "⏰", todays.length, "Classes today"],
    ["c-sky", "📚", data.subjects.length, "Subjects"],
  ].map(([c, i, n, l]) => `<div class="card stat"><div class="icon ${c}">${i}</div><div><div class="num">${n}</div><div class="lbl">${l}</div></div></div>`).join("");

  $("ov-today").innerHTML = todays.length
    ? todays.map(c => classRow(c, false)).join("")
    : `<div class="empty">No classes today — enjoy the calm 🍃</div>`;

  const upcoming = pending.slice().sort((a, b) => a.due.localeCompare(b.due)).slice(0, 4);
  $("ov-tasks").innerHTML = upcoming.length
    ? upcoming.map(t => taskRow(t, false)).join("")
    : `<div class="empty">All caught up 🎉</div>`;

  $("ov-att").innerHTML = data.subjects.map(s => {
    const p = pct(s);
    return `<div class="item"><span class="dot" style="background:${colorOf(s.id)}"></span>
      <div class="grow"><div class="title">${esc(s.emoji)} ${esc(s.name)}</div>
      <div class="bar" style="margin-top:.35rem"><span class="${barClass(p)}" style="width:${p}%"></span></div></div>
      <strong>${p}%</strong></div>`;
  }).join("") || `<div class="empty">Add a subject to start tracking.</div>`;
}

/* ---------------- Attendance ---------------- */
function renderAttendance() {
  $("att-grid").innerHTML = data.subjects.map(s => {
    const p = pct(s);
    // classes needed to reach 75%
    const need = Math.max(0, Math.ceil((0.75 * s.total - s.attended) / 0.25));
    const note = p >= 75
      ? `You can miss ${Math.floor(s.attended / 0.75 - s.total)} more class(es) and stay above 75%.`
      : `Attend the next ${need} class(es) in a row to reach 75%.`;
    return `<div class="card att-card">
      <div class="head"><span class="emoji">${esc(s.emoji)}</span>
        <div><div class="title" style="font-weight:800">${esc(s.name)}</div><div class="sub" style="font-size:.82rem;color:var(--muted)">${s.attended} / ${s.total} classes</div></div>
        <div class="pct" style="color:${p < 65 ? "var(--danger)" : p < 75 ? "#c0902f" : "var(--sage-dark)"}">${p}%</div></div>
      <div class="bar"><span class="${barClass(p)}" style="width:${p}%"></span></div>
      <div class="att-actions">
        <button class="btn small" data-att="${s.id}" data-v="p">✔ Present</button>
        <button class="btn small danger" data-att="${s.id}" data-v="a">✖ Absent</button>
      </div>
      <div class="att-note">${note}</div></div>`;
  }).join("") || `<div class="empty">No subjects yet.</div>`;
}
$("att-grid").addEventListener("click", e => {
  const b = e.target.closest("[data-att]");
  if (!b) return;
  const s = subj(b.dataset.att);
  s.total++;
  if (b.dataset.v === "p") s.attended++;
  save(); renderAll();
});

/* ---------------- Tasks ---------------- */
let taskFilter = "pending";
function taskRow(t, controls = true) {
  const s = subj(t.subjectId);
  const overdue = !t.done && t.due < isoDate(new Date());
  return `<div class="item ${t.done ? "done" : ""}">
    ${controls ? `<input type="checkbox" class="check" data-toggle="${t.id}" ${t.done ? "checked" : ""} />` : `<span class="dot" style="background:${colorOf(t.subjectId)}"></span>`}
    <div class="grow"><div class="title">${esc(t.title)}</div>
      <div class="sub">${s ? esc(s.emoji + " " + s.name) : "General"} · Due ${fmtDue(t.due)}</div></div>
    ${overdue ? `<span class="badge overdue">Overdue</span>` : ""}
    <span class="badge ${t.priority}">${t.priority}</span>
    ${controls ? `<button class="btn small danger" data-deltask="${t.id}" aria-label="Delete">🗑</button>` : ""}
  </div>`;
}
function renderTasks() {
  let list = data.tasks.slice().sort((a, b) => a.due.localeCompare(b.due));
  if (taskFilter === "pending") list = list.filter(t => !t.done);
  if (taskFilter === "done") list = list.filter(t => t.done);
  $("task-list").innerHTML = list.length ? list.map(t => taskRow(t)).join("") : `<div class="empty">Nothing here 🌸</div>`;
}
$("task-filters").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  taskFilter = b.dataset.f;
  document.querySelectorAll("#task-filters button").forEach(x => x.classList.toggle("active", x === b));
  renderTasks();
});
$("task-list").addEventListener("click", e => {
  const del = e.target.closest("[data-deltask]");
  if (del) { data.tasks = data.tasks.filter(t => t.id !== del.dataset.deltask); save(); renderAll(); }
});
$("task-list").addEventListener("change", e => {
  const id = e.target.dataset.toggle; if (!id) return;
  const t = data.tasks.find(x => x.id === id); t.done = e.target.checked; save(); renderAll();
});

/* ---------------- Schedule ---------------- */
let selDay = todayIdx;
function classRow(c, controls = true) {
  const s = subj(c.subjectId);
  return `<div class="item"><div class="time">${fmtTime(c.start)}<br><span style="font-weight:600;color:var(--muted)">to ${fmtTime(c.end)}</span></div>
    <span class="dot" style="background:${colorOf(c.subjectId)};width:14px;height:14px"></span>
    <div class="grow"><div class="title">${s ? esc(s.emoji + " " + s.name) : "Class"}</div><div class="sub">${esc(c.room || "")}${s && s.teacher ? " · " + esc(s.teacher) : ""}</div></div>
    ${controls ? `<button class="btn small danger" data-delclass="${c.id}" aria-label="Delete">🗑</button>` : ""}</div>`;
}
function renderSchedule() {
  $("day-tabs").innerHTML = DAYS.map((d, i) => `<button data-day="${i}" class="${i === selDay ? "active" : ""} ${i === todayIdx ? "today" : ""}">${d}</button>`).join("");
  const list = data.classes.filter(c => c.day === selDay).sort((a, b) => a.start.localeCompare(b.start));
  $("schedule-list").innerHTML = list.length ? list.map(c => classRow(c)).join("") : `<div class="empty">No classes on ${DAYS[selDay]} 🌤️</div>`;
}
$("day-tabs").addEventListener("click", e => {
  const b = e.target.closest("[data-day]"); if (!b) return;
  selDay = Number(b.dataset.day); renderSchedule();
});
$("schedule-list").addEventListener("click", e => {
  const del = e.target.closest("[data-delclass]");
  if (del) { data.classes = data.classes.filter(c => c.id !== del.dataset.delclass); save(); renderAll(); }
});

/* ---------------- Subjects ---------------- */
function renderSubjects() {
  $("subject-grid").innerHTML = data.subjects.map((s, i) => `
    <div class="card subject-card">
      <div class="big" style="background:${COLORS[i % COLORS.length]}">${esc(s.emoji)}</div>
      <h4>${esc(s.name)}</h4><p>${esc(s.teacher || "—")}</p>
      <div class="bar"><span class="${barClass(pct(s))}" style="width:${pct(s)}%"></span></div>
      <p style="margin-top:.4rem">${pct(s)}% attendance · ${data.tasks.filter(t => t.subjectId === s.id && !t.done).length} pending</p>
      <button class="btn small danger" data-delsub="${s.id}">Remove</button>
    </div>`).join("") || `<div class="empty">No subjects yet.</div>`;
}
$("subject-grid").addEventListener("click", e => {
  const b = e.target.closest("[data-delsub]"); if (!b) return;
  if (!confirm("Remove this subject and its classes & tasks?")) return;
  const id = b.dataset.delsub;
  data.subjects = data.subjects.filter(s => s.id !== id);
  data.classes = data.classes.filter(c => c.subjectId !== id);
  data.tasks = data.tasks.filter(t => t.subjectId !== id);
  save(); renderAll();
});

/* ---------------- Modals ---------------- */
function fillSubjectSelects() {
  const opts = data.subjects.map(s => `<option value="${s.id}">${esc(s.emoji + " " + s.name)}</option>`).join("");
  $("t-subject").innerHTML = opts; $("c-subject").innerHTML = opts;
  $("c-day").innerHTML = DAYS.map((d, i) => `<option value="${i}" ${i === selDay ? "selected" : ""}>${d}</option>`).join("");
}
function openModal(id) {
  if (!data.subjects.length && id !== "subject-modal") { alert("Please add a subject first."); return; }
  fillSubjectSelects();
  $(id).querySelector("form").reset();
  if (id === "task-modal") $("t-due").value = addDays(1);
  if (id === "class-modal") { $("c-day").value = selDay; $("c-start").value = "09:00"; $("c-end").value = "10:00"; }
  $(id).showModal();
}
$("add-task-btn").onclick = () => openModal("task-modal");
$("add-class-btn").onclick = () => openModal("class-modal");
$("add-subject-btn").onclick = () => openModal("subject-modal");
document.querySelectorAll("[data-close]").forEach(b => (b.onclick = () => b.closest("dialog").close()));

$("task-form").addEventListener("submit", () => {
  data.tasks.push({ id: uid(), title: $("t-title").value.trim(), subjectId: $("t-subject").value, due: $("t-due").value, priority: $("t-priority").value, done: false });
  save(); renderAll();
});
$("class-form").addEventListener("submit", () => {
  data.classes.push({ id: uid(), subjectId: $("c-subject").value, day: Number($("c-day").value), start: $("c-start").value, end: $("c-end").value, room: $("c-room").value.trim() });
  selDay = Number($("c-day").value);
  save(); renderAll();
});
$("subject-form").addEventListener("submit", () => {
  data.subjects.push({ id: uid(), name: $("s-name").value.trim(), teacher: $("s-teacher").value.trim(), emoji: $("s-emoji").value || "📖", attended: 0, total: 0 });
  save(); renderAll();
});

/* ---------------- Render everything ---------------- */
function renderAll() {
  renderOverview(); renderAttendance(); renderTasks(); renderSchedule(); renderSubjects();
}
renderAll();