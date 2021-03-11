document.write('<footer><a href="https://discord.gg/UD4Temq">Questions? Suggestions?  Join Us on Discord!</a><br />\
<a href="https://www.patreon.com/join/PvPIVs" data-patreon-widget-type="become-patron-button"><img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width=auto height="22"></a> &#124; PvP IVs ©2021</footer>\ ');

/* Dark/Light Mode Theme Toggle Code*/
document.getElementById('theme-toggle').addEventListener('change', () => {
  document.body.classList.toggle('dark-theme');
  document.getElementById('theme-toggle-icon').classList.toggle('flipped-icon');
});
