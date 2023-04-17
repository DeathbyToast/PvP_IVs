document.write('<footer><a href="https://discord.gg/UD4Temq">Feedback: Join Our Discord!</a><br />\ PvP IVs ©2023<br />\
<script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="DeathbyToast" data-description="Support me on Buy me a coffee!" data-message="" data-color="#40DCA5" data-position="Right" data-x_margin="18" data-y_margin="18"></script></footer>\ ');

/* Dark/Light Mode Theme Toggle Code*/
document.getElementById('theme-toggle').addEventListener('change', () => {toggleTheme();});

/* https://kevdees.com/adding-dark-mode-toggle-to-your-website/ */
function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");
  document.getElementById("theme-toggle-icon").classList.toggle("flipped-icon");
  
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

function advCollapsible() {
  if(document.getElementById("advCollapsible").style.display == "block") {
    document.getElementById("advCollapsible").style.display = "none";
    document.getElementById("advArrow").classList.remove("up");
    document.getElementById("advArrow").classList.add("down");
  } else {
    document.getElementById("advCollapsible").style.display = "block";
    document.getElementById("advArrow").classList.remove("down");
    document.getElementById("advArrow").classList.add("up");
  }
}