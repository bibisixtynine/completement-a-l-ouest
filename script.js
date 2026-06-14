const buttons = document.querySelectorAll("[data-filter]");
const stories = document.querySelectorAll(".story");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    buttons.forEach((item) => item.classList.toggle("active", item === button));
    stories.forEach((story) => {
      story.hidden = selected !== "all" && story.dataset.category !== selected;
    });
  });
});
