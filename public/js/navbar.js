document.addEventListener("DOMContentLoaded", () => {
    const blogCards = document.querySelectorAll(".blog-card");

    function applyResponsiveStyles() {
        const screenWidth = window.innerWidth;

        blogCards.forEach(card => {
            if (screenWidth <= 600) {
                card.style.width = "100%";
                card.style.margin = "10px 0";
                card.style.fontSize = "14px";
            } else if (screenWidth <= 900) {
                card.style.width = "48%";
                card.style.margin = "10px 1%";
                card.style.fontSize = "16px";
            } else {
                card.style.width = "30%";
                card.style.margin = "10px";
                card.style.fontSize = "18px";
            }
        });
    }

    applyResponsiveStyles(); // on load
    window.addEventListener("resize", applyResponsiveStyles); // on resize
});
