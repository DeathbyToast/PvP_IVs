document.write('<footer><a href="https://discord.gg/UD4Temq">Questions? Suggestions?  Join Us on DISCOrd!</a><br />\
<a href="https://www.patreon.com/join/PvPIVs" data-patreon-widget-type="become-patron-button"><img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width=auto height="22"></a> &#124; PvP IVs ©2021</footer>\ ');

/* Dark/Light Mode Theme Toggle Code*/
document.getElementById('theme-toggle').addEventListener('change', () => {toggleTheme();});

/* https://kevdees.com/adding-dark-mode-toggle-to-your-website/ */
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");
  document.getElementById("theme-toggle-icon").classList.toggle("flipped-icon");
  document.getElementById("theme-toggle").checked = !document.getElementById("theme-toggle").checked;
  
  localStorage.setItem(
    "colorTheme",
    document.body.classList.contains("dark-theme") ? "dark-theme" : "light-theme"
    );
}

/* Initialize the theme */
if (localStorage.getItem("colorTheme") === "dark-theme") {
  document.getElementById("theme-toggle").checked = true;
  toggleTheme();
} else if (
    localStorage.getItem("colorTheme") !== "light-theme" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {
    toggleTheme();
}

