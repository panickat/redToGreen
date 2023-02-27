<template>
  <HelloWorld msg="msg=HelloWorld" />
  <div>
    <h1>Web Scraper App.vue</h1>
    <button v-on:click="getWebsiteData"></button>
    <div class="wrapper">
      <div v-for="(article, index) in lastestArticles" :key="index">
        <span v-text="article.title"></span>
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
      let url = "http://localhost:8080/search/sexy_limit69";
      let dataArray = [];

      axios({
        method: "get",
        url: url,
      }).then(function (response) {
        let html = response.data;

        let $ = cheerio.load(html);

        $("body > div > .post-container").each(function () {
          const title = $(this).find("h2");
          const image = $(this).find("img").attr("src");

          // putting data in array.

          dataArray.push({
            title: title,
            image: image,
          });
        });

        self.lastestArticles = dataArray;
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
