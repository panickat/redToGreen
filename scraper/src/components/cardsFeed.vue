<template>
  <div>
    <!-- tittles -->
    <div class="tittles">
      <div v-for="chunkSize in chunkSizes" :key="chunkSize" class="tittle">
        <h2 v-if="chunkSize <= 3600" v-on:click="loadNextChunk(chunkSize)">
          {{ chunkSize / 60 }}
        </h2>
        <h2 v-if="chunkSize > 3600" v-on:click="loadNextChunk(chunkSize)">
          {{ (chunkSize / 60 / 60).toFixed(1) }}
        </h2>
      </div>
    </div>
    <!-- containers -->
    <div class="containers">
      <div
        v-for="chunkSize in chunkSizes"
        :key="chunkSize"
        :class="{
          wrapper: true,
          active: wrapperActive(chunkSize),
          inactive: !wrapperActive(chunkSize),
        }"
        :id="chunkSize"
      >
        <div class="container">
          <!-- Iterate over displayedCards and set an img src to card.img -->
          <div
            v-for="card in cards[chunkSize]"
            :key="card.img"
            class="column neuromorphism1"
            v-on:click="selectCard(card.download, chunkSize)"
          >
            <img :src="wrapperActive(chunkSize) ? card.img + '?v1' : ''" />
          </div>
        </div>
      </div>
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
    this.getWebsiteData();
    this.initializeSelectedCards();
  },
  data() {
    return {
      cards: {},
      activeChunkSize: 0,
      chunkSizes: [360, 960, 2700, 4500, 6000, 7200, 9000, 10800, 36000],
      selectedCards: {},
    };
  },
  methods: {
    initializeSelectedCards() {
      this.chunkSizes.forEach((chunkSize) => {
        if (!this.selectedCards[chunkSize]) {
          this.selectedCards[chunkSize] = [];
        }
      });
    },
    loadFocus() {},
    getWebsiteData() {
      const startTime = new Date();

      function spread(cards, chunkSizes) {
        const cardsByChunk = {};
        // Initialize empty arrays for each chunk size
        chunkSizes.forEach((size) => {
          cardsByChunk[size] = [];
        });

        // Loop through each card and append it to the appropriate chunk size
        cards.forEach((card) => {
          const length = card.length;
          for (const size of chunkSizes) {
            if (length <= size) {
              cardsByChunk[size].push(card);
              break;
            }
          }
        });
        return cardsByChunk;
      }

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
          const sortedCards = loadedCards.sort((a, b) => a.length - b.length);
          this.cards = spread(sortedCards, this.chunkSizes);
          cards.endTime("end chain", startTime);
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    },
    checkScrollPosition() {
      const container = this.$refs.container;
      let sized = container.scrollTop + container.offsetHeight;
      if (sized >= container.scrollHeight - 100) {
        setTimeout(() => {
          this.loadNextChunk();
        }, 1000);
      }
    },
    loadNextChunk(chunkSize) {
      // console.info("cards: ", this.cards["360"][0].img);
      this.activeChunkSize = chunkSize;
      // const el = document.getElementById(chunkSize);
      // const lastActive = document.querySelector(".containers .wrapper.active");

      // if (lastActive) {
      //   lastActive.classList.add("inactive");
      //   lastActive.classList.remove("active");
      // }

      // el.classList.remove("inactive");
      // el.classList.add("active");

      // if (this.cards.length <= 9) {
      //   this.displayedCards = this.cards;
      //   return;
      // }
      // const nextChunkSize = this.chunkSizes.find(
      //   (size) => size > this.loadedLength
      // );
      // if (nextChunkSize) {
      //   const nextCards = this.cards.filter(
      //     //(card) => card.length <= nextChunkSize
      //     (card) =>
      //       card.length <= nextChunkSize && card.length > this.loadedLength
      //   );
      //   this.loadedLength = nextChunkSize;
      //   this.displayedCards = [...this.displayedCards, ...nextCards];
      // }
    },
    wrapperActive(chunkSize) {
      return chunkSize === this.activeChunkSize;
    },
    selectCard(cardId, chunkSize) {
      const cardIndex = this.cards[chunkSize].findIndex(
        (item) => item.download === cardId
      );

      // create a Set to keep track of the unique values in this.selectedCards[chunkSize]
      const cardIndexSet = new Set(this.selectedCards[chunkSize]);

      // add the cardIndex to the Set
      cardIndexSet.add(cardIndex);

      // convert the Set back to an array and assign it to this.selectedCards[chunkSize]
      this.selectedCards[chunkSize] = Array.from(cardIndexSet);
    },
  },
  computed: {},
};
</script>

<style scoped>
* {
  background-color: black;
  color: #353535;
  margin: 0px;
  padding: 0px;
}
.tittles {
  display: flex;
  flex-wrap: wrap;
}
.tittles .tittle {
  flex-basis: calc(11.11% - 10px);
  margin: 5px;
  background-color: #ccc;
  text-align: center;
}
.active {
  display: flex;
}
.inactive {
  display: none;
}
.wrapper {
  position: absolute;
}
/* <!-- Add "scoped" attribute to limit CSS to this component only --> */
.container {
  height: 750px;
  overflow-y: scroll;
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
img {
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
  user-drag: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
