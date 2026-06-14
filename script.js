const buttons = document.querySelectorAll("[data-filter]");
const stories = document.querySelectorAll(".story");
const articles = document.querySelector("#articles");
const filterResultTitle = document.querySelector("#filter-result-title");
const filterResultCount = document.querySelector("#filter-result-count");
const clearFilter = document.querySelector("#clear-filter");

const filterArticles = (selected, shouldScroll = true) => {
  const activeButton = document.querySelector(`[data-filter="${selected}"]`);
  let visibleCount = 0;

  buttons.forEach((item) => {
    const isActive = item === activeButton;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  stories.forEach((story) => {
    const isVisible = selected === "all" || story.dataset.category === selected;
    story.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  const title = activeButton.textContent.replace(/\d+$/, "").trim();
  filterResultTitle.textContent = title;
  filterResultCount.textContent = `${visibleCount} article${visibleCount > 1 ? "s" : ""} dans cette sélection.`;
  clearFilter.hidden = selected === "all";

  if (shouldScroll) {
    articles.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

buttons.forEach((button) => {
  button.addEventListener("click", () => filterArticles(button.dataset.filter));
});

clearFilter.addEventListener("click", () => filterArticles("all"));

const commentsEndpoint = "https://api.github.com/repos/bibisixtynine/completement-a-l-ouest/discussions/1/comments";
const commentList = document.querySelector("#comment-list");
const commentCount = document.querySelector("#comment-count");

fetch(commentsEndpoint, {
  headers: { Accept: "application/vnd.github+json" },
})
  .then((response) => {
    if (!response.ok) throw new Error("Comments unavailable");
    return response.json();
  })
  .then((comments) => {
    commentCount.textContent = comments.length
      ? `${comments.length} commentaire${comments.length > 1 ? "s" : ""}`
      : "Soyez la première voix";

    commentList.replaceChildren();
    comments.slice(-5).reverse().forEach((comment) => {
      const item = document.createElement("article");
      item.className = "comment-item";

      const avatar = document.createElement("img");
      avatar.src = comment.user.avatar_url;
      avatar.alt = "";
      avatar.loading = "lazy";

      const meta = document.createElement("p");
      meta.className = "comment-meta";
      const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(comment.created_at));
      meta.textContent = `${comment.user.login} · ${date}`;

      const body = document.createElement("p");
      body.className = "comment-body";
      body.textContent = comment.body;

      item.append(avatar, meta, body);
      commentList.append(item);
    });
  })
  .catch(() => {
    commentList.innerHTML = '<p class="comment-loading">Les commentaires font une pause café. Le bouton fonctionne toujours.</p>';
  });
