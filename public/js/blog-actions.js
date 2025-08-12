const style = document.createElement("style");
style.textContent = `
.blog-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
}

.like-btn{
    border: none;
    background: none;
    font-size: 18px;
    cursor: pointer;
    color: gray;
    transition: color 0.2s ease;
}

.like-btn.active {
    color: green;
}


.like-btn:hover{
    opacity: 0.7;
}
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".like-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const blogId = button.dataset.blogId;
      try {
        const response = await fetch(`/blog/${blogId}/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Network error");

        const data = await response.json();

        const countSpan = button.querySelector(".count");
        countSpan.textContent = data.likes;

        const heart = button.querySelector(".heart");
        heart.textContent = data.like ? "❤️" : "🤍";

        if (data.like) {
          button.classList.add("active");
        } else {
          button.classList.remove("active");
        }
      } catch (err) {
        console.log("Like toggle error:", err);
      }
    });
  });
});
