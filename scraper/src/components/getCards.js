function endTime(tittle, startTime) {
  function convertTime(ms) {
    if (ms < 1000) {
      return `${ms} ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(2)} s`;
    } else {
      return `${(ms / 60000).toFixed(2)} m`;
    }
  }

  const endTime = new Date();
  const timeDiff = endTime - startTime;

  console.log(`${tittle}: ${convertTime(timeDiff)}`);
}
function getCards($) {
  let dataArray = [];
  $("body > div > .post-container").each(function () {
    const img = $(this).find("a.post-content > img").attr("src");
    const length = $(this).find("a.post-content > div:nth-child(5)").text();
    const download = $(this).find("a.button").attr("href");

    const [hours, minutes, seconds] = length.split(":").map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    // putting data in array.
    dataArray.push({
      img: img,
      length: totalSeconds,
      download: download,
      selected: false,
    });
  });
  return dataArray;
}
function isLastPage($) {
  const activepage = $("body > div > nav").find(".active").text();
  let numberofpages = $("body > div > nav").find(".numberofpages").text();
  numberofpages = numberofpages.substring(2, numberofpages.length);
  console.info(activepage, numberofpages);
  return activepage == numberofpages ? true : false;
}
function scrap(page, axios, cheerio) {
  // // let self = this;
  // // let dataArray = [];
  const url =
    "http://localhost:8080/search/" + window.location.pathname.split("/")[1];

  return axios({
    method: "get",
    url: url + `?page=${page}`,
  }).then(function (response) {
    let $ = cheerio.load(response.data); //html
    const lastPage = isLastPage($);
    const cards = getCards($);
    return { cards, lastPage };
  });
}
export default {
  endTime,
  scrap,
};
