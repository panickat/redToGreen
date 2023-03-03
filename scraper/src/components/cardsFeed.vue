<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button ref="start_scrap" v-on:click="getWebsiteData"></button>
    <!-- <div class="wrapper">
      <div v-for="(article, index) in lastestArticles" :key="index">
        <span v-text="article.length"></span>
        <span v-text="article.download"></span>
        <img v-bind:src="article.img" />
        <hr />
      </div>
    </div> -->
  </div>
</template>

<script>
import axios from "axios";
import cheerio from "cheerio";
import cards from "./getCards";

export default {
  name: "cardsFeed",
  props: {
    msg: String,
  },
  mounted() {
    this.loadFocus();
  },
  methods: {
    loadFocus() {
      this.$refs.start_scrap.focus();
    },
    getWebsiteData() {
      const startTime = new Date();
      //const cards = require("./getCards");

      function promiseChainUntilLast(isLast, value) {
        return new Promise(function (resolve, reject) {
          if (isLast) {
            resolve(value);
          } else {
            // const r = cards.scrap(value, axios, cheerio);
            cards.scrap(value, axios, cheerio).then((response) => {
              console.info("response.lastPage: ", response.cards);
              promiseChainUntilLast(response.lastPage, value + 1)
                .then(resolve)
                .catch(reject);
            });
          }
        });
      }
      promiseChainUntilLast(false, 1)
        .then(function (result) {
          console.log("Result:", result);
          cards.endTime("end chain", startTime);
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    },
  },
};
</script>

<style scoped>
/* <!-- Add "scoped" attribute to limit CSS to this component only --> */
button {
  width: 50%;
  height: 30px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
