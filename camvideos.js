//content.querySelector("div").remove();
//content.querySelector(".footer").remove();
//content.querySelector(".clear").remove();
let content = document.querySelectorAll("body > div > .post-container");
const selectDate = /\_\d{8}\_/g;
const selectHour = /\_\d{4}\_/g;

content.forEach((div) => {
  let data = div.querySelectorAll("a")[1];
  removed = removeVidDownloaded(data);

  if (!removed) {
    let vidLength = data.querySelectorAll("div")[3].textContent;
    let [horas, minutos, segundos] = vidLength
      .split(":")
      .map((valor) => parseInt(valor));
    let vidSeconds = horas * 3600 + minutos * 60 + segundos;

    data.querySelectorAll("div")[3].textContent = vidSeconds;
  }
});

function removeVidDownloaded(data) {
  removed = false;
  let dateHour = data.querySelector("img").getAttribute("src");
  let vidDate = parseInt(dateHour.match(selectDate)[0].substring(1, 9));
  let vidHour = parseInt(dateHour.match(selectHour)[0].substring(1, 5));

  let vidsDownloaded = [
    { date: "19082021", hour: "0220" },
    { date: "19082021", hour: "2252" },
  ];
  vidsDownloaded.forEach((vid) => {
    if (vid["date"] == vidDate && vidHour == vid["hour"]) {
      data.parentElement.remove();
      removed = true;
    }
  });
  return removed;
}

content = document.querySelectorAll("body > div > .post-container");
// Convierte los elementos div en un array para poder ordenarlos
let divsArray = Array.from(content);
divsArray.sort(function (a, b) {
  left = parseInt(a.querySelectorAll("div")[3].textContent);
  right = parseInt(b.querySelectorAll("div")[3].textContent);
  return left - right;
});

// Actualiza el contenido de los elementos div en el orden ordenado
divsArray.forEach((div) => {
  div.parentElement.appendChild(div); // Mueve el elemento div al final de su contenedor
});
