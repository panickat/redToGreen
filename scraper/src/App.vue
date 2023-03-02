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
      // let self = this;
      // let dataArray = [];
      const url =
        "http://localhost:8080/search/" +
        window.location.pathname.split("/")[1]; // + `?page=${page}`;

      function scrap(page) {
        return axios({
          method: "get",
          url: url + `?page=${page}`,
        }).then(function (response) {
          let html = response.data;
          let $ = cheerio.load(html);

          const activepage = $("body > div > nav").find(".active").text();
          let numberofpages = $("body > div > nav")
            .find(".numberofpages")
            .text();
          numberofpages = numberofpages.substring(2, numberofpages.length);
          console.info(activepage, numberofpages);
          return activepage == numberofpages ? true : false;
        });
      }

      // let r = scrap();
      // r.then((isLast) => {
      //   return;
      // });

      function promiseChainUntilLast(isLast, value) {
        return new Promise(function (resolve, reject) {
          if (isLast) {
            resolve(value);
          } else {
            const r = scrap(value);
            r.then((isLastFromScrap) => {
              console.info("isLastFromScrap: ", isLastFromScrap);
              promiseChainUntilLast(isLastFromScrap, value + 1)
                .then(resolve)
                .catch(reject);
            });
          }
        });
      }

      promiseChainUntilLast(false, 1)
        .then(function (result) {
          console.log("Result:", result);
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
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
