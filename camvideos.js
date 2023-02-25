// ==UserScript==
// @name        New script - camvideos.me
// @namespace   Violentmonkey Scripts
// @match       http://camvideos.me/*
// @grant       none
// @version     1.0
// @author      -
// @description 2/19/2023, 2:20:07 AM
// @noframes
// @run-at document-idle
// ==/UserScript==

let typedNumbers = "";

document.body.addEventListener("keydown", (event) => {
  // Check if the key pressed is a number
  if (/[0-9]/.test(event.key)) {
    // Concatenate the typed number with the existing numbers
    typedNumbers += event.key;
  } else if (event.key === "Enter") {
    // Navigate to the new URL
    const page = window.location.href;
    const baseUrl = page.substring(
      0,
      page.indexOf("?") > -1 ? page.indexOf("?") : page.length
    );

    window.location.href = `${baseUrl}?page=${typedNumbers}`;
    // Clear the string
    typedNumbers = "";
  }
});
//
function loadDb() {
  return [
    { date: "19082021", hour: "0220" },
    { date: "19082021", hour: "2252" },
  ];
}

const selectDate = /\_\d{8}\_/g;
const selectHour = /\_\d{4}\_/g;

function content() {
  return document.querySelectorAll("body > div > .post-container");
}

function removeVidDownloaded(data) {
  removed = false;
  let dateHour = data.querySelector("img").getAttribute("src");
  let vidDate = parseInt(dateHour.match(selectDate)[0].substring(1, 9));
  let vidHour = parseInt(dateHour.match(selectHour)[0].substring(1, 5));

  const vidsDownloaded = loadDb();

  vidsDownloaded.forEach((vid) => {
    if (vid["date"] == vidDate && vidHour == vid["hour"]) {
      console.info(vid);
      data.parentElement.remove();
      removed = true;
    }
  });
  return removed;
}
function relocate() {
  // Convierte los elementos div en un array para poder ordenarlos
  let divsArray = Array.from(content());
  divsArray.sort(function (a, b) {
    left = parseInt(a.querySelectorAll("div")[0].textContent);
    right = parseInt(b.querySelectorAll("div")[0].textContent);
    return left - right;
  });

  // Actualiza el contenido de los elementos div en el orden ordenado
  divsArray.forEach((div) => {
    div.parentElement.appendChild(div); // Mueve el elemento div al final de su contenedor
  });
}

function editCSS() {
  const black_selectors = [
    ".content .post-container .button",
    ".footer a",
    ".header",
    ".search",
  ];
  document.querySelector("body").style.backgroundColor = "black";
  document.querySelector(".content").style.backgroundColor = "black";
  document.querySelector(".content").style.maxWidth = "100%";
  document.querySelector(".backtotop").style.backgroundColor = "black";
  document.querySelector(".backtotop").style.borderBottom = "0";

  var hojaDeEstilo = document.styleSheets[0];
  var reglasDeEstilo = hojaDeEstilo.cssRules || hojaDeEstilo.rules;

  for (var i = 0; i < reglasDeEstilo.length; i++) {
    var regla = reglasDeEstilo[i];

    if (regla.selectorText == ".content .post-container .post-content") {
      regla.style.backgroundColor = "black";
      regla.style.maxWidth = "100%";
      regla.style.padding = "0px 1px 0px 0px";
      regla.style.backgroundColor = "black";
    }

    if (regla.selectorText == ".content .post-container") {
      regla.style.margin = "0";
      regla.style.backgroundColor = "black";
    }
    if (black_selectors.includes(regla.selectorText)) {
      regla.style.backgroundColor = "black";
    }
  }
}

function matchDownloaded() {
  editCSS();
  content().forEach((div) => {
    div.removeChild(div.children[0]);
    div.removeChild(div.children[0]);
    data = div.children[0]; //a > img > 5to elemento duration
    removed = removeVidDownloaded(data);

    if (!removed) {
      let vidLength = data.querySelectorAll("div")[3].textContent;
      let [horas, minutos, segundos] = vidLength
        .split(":")
        .map((valor) => parseInt(valor));

      let vidSeconds = horas * 3600 + minutos * 60 + segundos;

      //data.querySelectorAll("div")[3].textContent = vidSeconds;
      array = data.querySelectorAll("div");
      for (let index = 0; index < array.length; index++) {
        index == 3
          ? (array[index].textContent = vidSeconds)
          : array[index].remove();
      }
    }
  });
  relocate();
}

//document.addEventListener("DOMContentLoaded", function() {
//  matchDownloaded();
//});
matchDownloaded();
