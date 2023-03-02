<template>
  <HelloWorld msg="msg=HelloWorld" />
  <div>
    <h1>Web Scraper App.vue</h1>
    <button v-on:click="getWebsiteData"></button>
    <div class="wrapper">
      <div v-for="(article, index) in lastestArticles" :key="index">
        <span v-text="article.length"></span>
        <span v-text="article.download"></span>
        <img v-bind:src="article.img" />
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import axios from "axios";
import cheerio from "cheerio";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  data() {
    return {
      lastestArticles: [],
    };
  },
  methods: {
    getWebsiteData() {
      let self = this;
      let pages = 1;
      console.log("getWebsiteData");

      function getPage(page) {
        let dataArray = [];
        const url =
          "http://localhost:8080/search/" +
          window.location.pathname.split("/")[1] +
          `?page=${page}`;

        console.log("Before axios:\n", page, url);
        axios({
          method: "get",
          url: url,
        }).then(function (response) {
          let html = response.data;
          let $ = cheerio.load(html);

          const totalPages = $("body > div > div.search-numbers").text();
          const numberEnd = totalPages.indexOf(" search");
          pages = Math.ceil(parseInt(totalPages.substring(0, numberEnd)) / 90);
          console.log("pages: ", pages);

          $("body > div > .post-container").each(function () {
            const img = $(this).find("a.post-content > img").attr("src");
            const length = $(this)
              .find("a.post-content > div:nth-child(5)")
              .text();
            const download = $(this).find("a.button").attr("href");

            const [hours, minutes, seconds] = length.split(":").map(Number);
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            // putting data in array.
            dataArray.push({
              img: img,
              length: totalSeconds,
              download: download,
            });
          });
          self.lastestArticles = dataArray.concat(self.lastestArticles);
        });
      }

      for (let pageIndex = 1; pageIndex <= pages + 1; pageIndex++) {
        console.log("for:\n", "pages: ", pages, "index", pageIndex);
        getPage(pageIndex);
      }
      self.lastestArticles = self.lastestArticles.sort(
        (a, b) => a.length - b.length
      );
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
