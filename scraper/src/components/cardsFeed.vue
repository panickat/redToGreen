<template>
  <button ref="start_scrap" v-on:click="getWebsiteData"></button>
  <div class="container" ref="container" v-on:scroll="checkScrollPosition">
    <div
      v-for="(card, index) in displayedCards"
      :key="index"
      class="column neumorphism1"
    >
      <img v-bind:src="card.img" />
    </div>
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
  data() {
    return {
      cards: [],
      displayedCards: [],
      loadedLength: 0,
      chunkSizes: [360, 960, 2700, 4500, 6000, 7200, 9000, 10800],
    };
  },
  methods: {
    loadFocus() {
      this.$refs.start_scrap.focus();
    },
    getWebsiteData() {
      const startTime = new Date();

      function promiseChainUntilLast(isLast, loadingCards, page) {
        return new Promise(function (resolve, reject) {
          if (isLast) {
            resolve(loadingCards);
          } else {
            cards.scrap(page, axios, cheerio).then((response) => {
              loadingCards = loadingCards.concat(response.cards);
              promiseChainUntilLast(response.lastPage, loadingCards, page + 1)
                .then(resolve)
                .catch(reject);
            });
          }
        });
      }

      promiseChainUntilLast(false, [], 1)
        .then((loadedCards) => {
          this.cards = loadedCards.sort((a, b) => a.length - b.length);
          this.loadNextChunk();
          cards.endTime("end chain", startTime);
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    },
    checkScrollPosition() {
      console.info("checkScrollPosition: ");
      const container = this.$refs.container;
      if (
        container.scrollTop + container.offsetHeight >=
        container.scrollHeight
      ) {
        this.loadNextChunk();
        console.info("checkScrollPosition: ");
      }
    },
    loadNextChunk() {
      const nextChunkSize = this.chunkSizes.find(
        (size) => size > this.loadedLength
      );
      if (nextChunkSize) {
        const nextCards = this.cards.filter(
          //(card) => card.length <= nextChunkSize
          (card) =>
            card.length <= nextChunkSize && card.length > this.loadedLength
        );
        this.loadedLength = nextChunkSize;
        this.displayedCards = [...this.displayedCards, ...nextCards];
      }
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
.container {
  margin-top: 70px;
  margin-left: 5px;
  margin-right: 5px;
  max-width: 100%;
  /* margin: 0px auto; */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.column {
  flex-basis: calc(33.33% - 4px);

  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 15px;
  overflow: hidden;
}
.column img {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.neumorphism1 {
  border-radius: 32px;
  background: linear-gradient(45deg, #353535, #0f0f0f);
  box-shadow: -5px -5px 10px #353535, 5px 5px 10px #000000;
}
</style>
