# 📝 Blogs Web Site

A full-stack blogging platform built with **Node.js**, **Express.js**, **PostgreSQL**, and **EJS** that allows users to create, manage, and interact with blog posts.  
This project demonstrates **backend development, database integration, and responsive UI design**.

---

## 📖 About the Project

The **Blogs Web Site** is designed for users to **sign up, log in, publish articles, like posts, and view trending blogs**.  
It was built as a **portfolio project** to showcase full-stack development skills, following an **MVC architecture** for maintainability.

### ✨ Key Features
- **User Authentication** — Secure login and registration using sessions.
- **Create, Edit & Delete Posts** — Full CRUD functionality for blogs.
- **Likes System** — Users can like or unlike posts dynamically.
- **Trending Posts** — Highlights the most popular articles.
- **Responsive Design** — Works on both desktop and mobile.
- **PostgreSQL Integration** — Reliable database for storing blog content and user data.

---

## 🎯 Objectives
- Build a complete blogging application from scratch.
- Practice **RESTful API development** and **server-side rendering**.
- Implement authentication and session handling.
- Create a responsive, user-friendly interface.

---

## 🛠️ Tech Stack

| Layer          | Technologies |
|----------------|--------------|
| **Frontend**   | HTML, CSS, EJS |
| **Backend**    | Node.js, Express.js |
| **Database**   | PostgreSQL |
| **Auth**       | express-session, connect-pg-simple |
| **Versioning** | Git, GitHub |

---

## 📂 Project Structure

```
├── models/           # Database models & queries
├── views/            # EJS templates for UI
├── public/           # Static files (CSS, JS, images)
├── schema.sql        # SQL script to create database tables
├── server.js         # Main server entry point
├── package.json      # Dependencies and scripts
└── package-lock.json # Locked dependencies
```

---

## 🚀 Getting Started

Follow these steps to set up the project locally:

### 1️⃣ Clone the repository
```bash
git clone https://github.com/MadhuMohan001/Blogs-web-site.git
cd Blogs-web-site
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up PostgreSQL database
- Create a database in PostgreSQL.
- Import the schema:
```bash
psql -U your_username -d your_database -f schema.sql
```
- Update the database credentials in `server.js`.

### 4️⃣ Run the app
```bash
npm start
```
Open **http://localhost:3000** in your browser.

---

## 📸 Screenshots
*(Add screenshots of your home page, create post page, and trending section here)*

---

## 🔮 Future Improvements
- Add **user profiles** with avatars.
- Implement **comments** and **tags**.
- Add **search functionality** for posts.
- Deploy to **Render**, **Vercel**, or **Heroku**.

---

## 🤝 Contribution
Contributions are welcome!  
To contribute:
1. Fork this repository
2. Create a branch:  
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:  
   ```bash
   git commit -m "Add feature"
   ```
4. Push to your branch:  
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request

---

## 📜 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author
- **Madhu Mohan** — [GitHub Profile](https://github.com/MadhuMohan001)

