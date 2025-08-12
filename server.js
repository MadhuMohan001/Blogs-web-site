import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import pool from "./models/db.js";
import { getUser, createUser, getUserById } from "./models/users.js";
import {
  createBlog,
  deleteBlogById,
  getBlogById,
} from "./models/blogs.js";
import { toggleLike, getAllBlogsWithLikes, getTopLikedBlogs,getUserBlogsWithLikes,getLikeCount } from "./models/likes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PgSession = pgSession(session);
const port = 3000;

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET_KEY || "dev_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

async function validateUser(user_mail, user_password) {
  try {
    const user = await getUser(user_mail);
    if (!user) return false;
    return user.password === user_password;
  } catch (error) {
    console.log(error);
    return false;
  }
}
function ensureLoggedIn(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/", async (req, res) => {
  try {
    const userId = req.session.userId || null;
    let userName = null;
    if (userId) {
      const user = await getUserById(userId);
      userName = user ? user.name : null;
    }
    const blogs = await getAllBlogsWithLikes(userId);
    res.render("home", { blogs, userName });
  } catch (error) {
    console.log(error);
    res.status(500).send("Blogs loading");
  }
});
app.get("/blog/:id", async (req, res) => {
  const blogId = req.params.id;
  let returnTo = req.query.returnTo;
  if (returnTo === "home") {
    returnTo = null;
  }
  try {
    const blog = await getBlogById(blogId);
    res.render("blog-detail", { blog, returnTo });
  } catch (error) {
    console.log(error);
    res.status(500).send("Blog is loading");
  }
});

app.get("/myposts", ensureLoggedIn, async (req, res) => {
  try {
    const userId = req.session.userId;
    const blogs = await getUserBlogsWithLikes(userId,userId);
    const user = await getUserById(userId);
    const userName = user ? user.name : null;
    console.log(blogs);

    res.render("myPosts", { blogs, userName });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading Myposts");
  }
});
app.get("/trendposts", async (req, res) => {
  try {
    const blogs = await getTopLikedBlogs(5);
    res.render("trendingPosts", { blogs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading in trending posts");
  }
});

app.get("/about", (req, res) => {
  res.render("about",{error:null});
});

app.get("/create-post", (req, res) => {
  if (!req.session.userId) return redirect("/login");
  res.render("createPost");
});

app.post("/delete-post/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send("Unauthorized");
    }
    const deleted = await deleteBlogById(blogId, userId);
    if (deleted) {
      res.redirect("/myPosts");
    } else {
      return res.status(403).send("You are not allowed to delete the post");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server Error");
  }
});

app.post("/create-post", async (req, res) => {
  if (!req.session.userId) return redirect("/login");
  const { title, content } = req.body;
  await createBlog(title, content, req.session.userId);
  res.redirect("/myPosts");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null });
});
app.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

//Likes route
app.post("/blog/:id/like", ensureLoggedIn, async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.userId;
  try {
    const like = await toggleLike(userId, blogId);
    const likeCount = await getLikeCount(blogId);
    res.json({ like,likes:likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).send("Like error");
  }
});

app.post("/login", async (req, res) => {
  const mail = req.body.email;
  const password = req.body.password;
  if (await validateUser(mail, password)) {
    const user = await getUser(mail);
    req.session.userId = user.id;
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid email or password" });
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  try {
    const newUser = await createUser(username, email, password);
    req.session.userId = newUser.id;
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.render("signup", { error: "Error creating Account" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}/`);
});
