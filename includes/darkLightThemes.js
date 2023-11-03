/* Dark/Light Mode Theme Toggle Code*/
document.getElementById('theme-toggle').addEventListener('change', () => {toggleTheme();});

/* https://kevdees.com/adding-dark-mode-toggle-to-your-website/ */
function toggleTheme() {
  document.querySelector('html').classList.toggle("dark");
  document.querySelector('html').classList.toggle("light");
  document.getElementById("theme-toggle-icon").classList.toggle("flipped-icon");
  
  localStorage.setItem(
    "colorTheme",
    document.body.classList.contains("dark") ? "dark" : "light"
    );
}

/* Initialize the theme */
if (localStorage.getItem("colorTheme") === "dark") {
  document.getElementById("theme-toggle").checked = true;
  toggleTheme();
} else if (
    localStorage.getItem("colorTheme") !== "light" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    toggleTheme();
}