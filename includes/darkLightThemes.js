/* Dark/Light Mode Theme Toggle Code*/
document.getElementById('theme-toggle-icon').addEventListener('click', () => {toggleTheme();});

function toggleTheme() {
  /* Check which icon we have and swap to the other icon */
  if (document.documentElement.classList.contains("dark")) {
    /* In dark theme, set up transition to light theme */
    document.getElementById("theme-toggle-icon").src = "https://pvpivs.com/includes/moon.svg";
    document.getElementById("theme-toggle-icon").ariaLabel = "Change to dark theme";
    document.getElementById("theme-toggle-icon").alt = "Moon icon";
    localStorage.setItem("colorTheme","light");
  } else {
    /* In light theme, set up transition to dark theme */
    document.getElementById("theme-toggle-icon").src = "https://pvpivs.com/includes/sun.svg";
    document.getElementById("theme-toggle-icon").ariaLabel = "Change to light theme";
    document.getElementById("theme-toggle-icon").alt = "Sun icon";
    localStorage.setItem("colorTheme","dark");
  }
  /* Finally toggle dark/light class on HTML tag to switch themes */
  document.documentElement.classList.toggle("dark");
  document.documentElement.classList.toggle("light");
}

/* Theme defaults to dark, but set to light if user prefers */
if ((localStorage.getItem("colorTheme") === "light")
 || (localStorage.getItem("colorTheme") !== "dark" && window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches)) { 
  /* If user prefers light theme, toggleTheme from default dark theme */
  toggleTheme();
}