# Student-Task-Manager
# 🌿 Student Task Manager

A calm, easy-to-use web app that helps students plan their day, track attendance, manage tasks, and organise their subjects, all in one place. Built with plain HTML, CSS and JavaScript, with no frameworks and no backend.

**Live demo:** https://student-task-manager-self.vercel.app

---

## ✨ Features

- **Login and Sign up:** create your own account and get logged in straight away
- **Overview dashboard:** greeting, motivational quote, quick stats, today's classes, upcoming tasks and an attendance summary
- **Attendance tracker:** mark classes as present or absent for each subject and see your percentage against the 75% target
- **Task manager:** add tasks with a subject, due date and priority (low, medium, high); filter by Pending, Completed or All; overdue tasks are flagged
- **Daily schedule:** add classes for each day of the week with start time, end time and room, with day tabs and today highlighted
- **Subjects:** keep a list of what you're studying, with teacher names and emoji icons
- **Responsive design:** works on desktop, tablet and mobile, with a collapsible sidebar menu
- **Soft, calming theme:** sage, lavender and peach colours designed to feel stress-free

---

## 🚀 Try it

You can use the demo account on the login page:

| Email | Password |
| --- | --- |
| `student@demo.com` | `student123` |

Or click **Sign up** to create your own account.

---

## 🛠️ Tech stack

- HTML5 (including the `<dialog>` element for pop-up forms)
- CSS3 (custom properties, Grid, Flexbox, animations)
- Vanilla JavaScript (ES6)
- Browser `localStorage` for saving data

---

## 📁 Project structure

```
Student-Task-Manager/
├── index.html        # Login and sign-up page
├── dashboard.html    # Main dashboard
├── css/
│   └── style.css     # All styles and the colour theme
├── js/
│   ├── auth.js       # Login, sign-up and session handling
│   └── app.js        # Dashboard logic (tasks, attendance, schedule, subjects)
└── README.md
```

---

## 💻 Run locally

1. Clone the repository:
   ```bash
   git clone https://github.com/02suraj-c/Student-Task-Manager.git
   cd Student-Task-Manager
   ```
2. Open the folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**, or just open `index.html` in your browser.

No installation or build step is needed.

---

## ☁️ Deployment

The project is a static site, so it deploys easily on Vercel:

1. Push the code to GitHub.
2. Import the repository on [vercel.com](https://vercel.com).
3. Leave the framework preset as **Other** and click **Deploy**.

Every push to the `main` branch redeploys automatically.

---

## 📝 Notes

- All data (accounts, tasks, attendance, schedule, subjects) is stored in your browser's `localStorage`. It stays on your device, is not shared between browsers or devices, and is lost if you clear your browser data.
- This is a learning project. Please don't use real or sensitive passwords.

---

## 🔮 Future improvements

- Cloud database so data syncs across devices
- Secure authentication
- Task reminders and notifications
- Dark mode
- Export attendance and tasks as PDF or CSV

---

## 👤 Author

Made by [02suraj-c](https://github.com/02suraj-c).

If you like this project, give it a ⭐ on GitHub!
