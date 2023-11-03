function collapsible(divID, arrowID) {
  if(document.getElementById(divID).style.display == "block") {
    document.getElementById(divID).style.display = "none";
    document.getElementById(arrowID).classList.remove("up");
    document.getElementById(arrowID).classList.add("down");
  } else {
    document.getElementById(divID).style.display = "block";
    document.getElementById(arrowID).classList.remove("down");
    document.getElementById(arrowID).classList.add("up");
  }
}