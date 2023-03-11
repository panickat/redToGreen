<template>
  <div>
    <!-- titles -->
    <div class="titles">
      <div v-for="chunkSize in chunkSizes" :key="chunkSize" class="title">
        <h2
          v-if="chunkSize <= 3600"
          v-on:click="loadNextChunk(chunkSize)"
          v-bind:class="{ title_selected: activeChunkSize === chunkSize }"
        >
          {{ chunkSize / 60 }}
        </h2>
        <h2
          v-if="chunkSize > 3600"
          v-on:click="loadNextChunk(chunkSize)"
          v-bind:class="{ title_selected: activeChunkSize === chunkSize }"
        >
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
        <div class="container" @keydown="handleKeyDown" @keyup="handleKeyUp">
          <!-- Iterate over displayedCards and set an img src to card.img -->
          <div
            v-for="card in cards[chunkSize]"
            :key="card.download"
            class="column"
            v-on:click="selectCard(card)"
            v-bind:class="{ selected: card.selected }"
            v-show="selectedCards.length === 0 || selectedCards.includes(card)"
          >
            <!-- Move isHovering inside the v-for loop -->
            <a
              @mouseover="card.isHovering = true"
              @mouseleave="card.isHovering = false"
            >
              <!-- Move the ZoomImage component inside the a tag and add a v-if directive to check if the zoom flag is set -->
              <ZoomImage
                v-if="card.isHovering && zoomKeyDown"
                :imageSrc="
                  wrapperActive(chunkSize) ? zoomUrl(card.img) + '?v1' : ''
                "
              />
              <!-- Display a regular img element if the mouse is not over the anchor -->
              <img
                v-else
                :src="wrapperActive(chunkSize) ? card.img + '?v1' : ''"
              />
            </a>
          </div>
        </div>

        <!-- conitainer -->
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
// import cheerio from "cheerio";
// import cards from "./getCards";
import ZoomImage from "@/components/ZoomImage.vue";

export default {
  name: "cardsFeed",
  props: {
    msg: String,
  },
  components: {
    ZoomImage,
  },
  mounted() {
    this.getWebsiteData();
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    // this.initializeSelectedCards();
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  data() {
    return {
      cards: {},
      activeChunkSize: 0,
      selectedCards: [],
      chunkSizes: [360, 960, 2700, 4500, 6000, 7200, 9000, 10800, 36000],
      isHovering: false,
      zoomKeyDown: false,
    };
  },
  methods: {
    // initializeSelectedCards() {
    //   this.chunkSizes.forEach((chunkSize) => {
    //     if (!this.selectedCards[chunkSize]) {
    //       this.selectedCards[chunkSize] = [];
    //     }
    //   });
    // },
    getWebsiteData() {
      // const startTime = new Date();

      // function spread(cards, chunkSizes) {
      //   const cardsByChunk = {};
      //   // Initialize empty arrays for each chunk size
      //   chunkSizes.forEach((size) => {
      //     cardsByChunk[size] = [];
      //   });

      //   // Loop through each card and append it to the appropriate chunk size
      //   cards.forEach((card) => {
      //     const length = card.length;
      //     for (const size of chunkSizes) {
      //       if (length <= size) {
      //         cardsByChunk[size].push(card);
      //         break;
      //       }
      //     }
      //   });
      //   return cardsByChunk;
      // }

      // function promiseChainUntilLast(isLast, loadingCards, page) {
      //   return new Promise(function (resolve, reject) {
      //     if (isLast) {
      //       resolve(loadingCards);
      //     } else {
      //       cards.scrap(page, axios, cheerio).then((response) => {
      //         loadingCards = loadingCards.concat(response.cards);
      //         promiseChainUntilLast(response.lastPage, loadingCards, page + 1)
      //           .then(resolve)
      //           .catch(reject);
      //       });
      //     }
      //   });
      // }

      // promiseChainUntilLast(false, [], 1)
      //   .then((loadedCards) => {
      //     const sortedCards = loadedCards.sort((a, b) => a.length - b.length);
      //     this.cards = spread(sortedCards, this.chunkSizes);
      //     cards.endTime("promiseUntilLast", startTime);
      //   })
      //   .catch(function (error) {
      //     console.log("Error:", error);
      //   });
      this.cards = {
        360: [
          {
            img: "http://fastimages.org/images/2023/03/07/dazysmit_07032023_1431_female_Chaturbate.th.jpg",
            length: 357,
            download: "http://pip.bz/hrm-8b67u",
            selected: false,
          },
        ],
        960: [
          {
            img: "http://fastimages.org/images/2023/03/02/dazysmit_02032023_1510_female_Chaturbate.th.jpg",
            length: 418,
            download: "http://pip.bz/hrm-8aNYw",
            selected: false,
            isHovering: false,
          },
        ],
        2700: [
          {
            img: "http://fastimages.org/images/2023/03/01/dazysmit_01032023_1603_female_Chaturbate.th.jpg",
            length: 1050,
            download: "http://pip.bz/hrm-8aKS8",
            selected: false,
            isHovering: false,
          },
          {
            img: "http://fastimages.org/images/2023/03/03/dazysmit_03032023_1129_female_Chaturbate.th.jpg",
            length: 1680,
            download: "http://pip.bz/hrm-8aR0R",
            selected: false,
            isHovering: false,
          },
          {
            img: "http://fastimages.org/images/2023/03/01/dazysmit_01032023_1300_female_Chaturbate.th.jpg",
            length: 2179,
            download: "http://pip.bz/hrm-8aKrD",
            selected: false,
            isHovering: false,
          },
          {
            img: "http://fastimages.org/images/2023/02/28/dazysmit_28022023_1327_female_Chaturbate.th.jpg",
            length: 2421,
            download: "http://pip.bz/hrm-8aH1d",
            selected: false,
            isHovering: false,
          },
          {
            img: "http://fastimages.org/images/2023/03/02/dazysmit_02032023_1558_female_Chaturbate.th.jpg",
            length: 2566,
            download: "http://pip.bz/hrm-8aO5P",
            selected: false,
            isHovering: false,
          },
        ],
        4500: [
          {
            img: "http://fastimages.org/images/2023/03/02/dazysmit_02032023_1130_female_Chaturbate.th.jpg",
            length: 3538,
            download: "http://pip.bz/hrm-8aNvF",
            selected: false,
          },
        ],
        6000: [
          {
            img: "http://fastimages.org/images/2023/03/03/dazysmit_03032023_1410_female_Chaturbate.th.jpg",
            length: 5035,
            download: "http://pip.bz/hrm-8aRo0",
            selected: false,
          },
          {
            img: "http://fastimages.org/images/2023/02/26/dazysmit_26022023_1711_female_Chaturbate.th.jpg",
            length: 5082,
            download: "http://pip.bz/hrm-8aAxY",
            selected: false,
          },
        ],
        7200: [
          {
            img: "http://fastimages.org/images/2023/02/28/dazysmit_28022023_1605_female_Chaturbate.th.jpg",
            length: 6058,
            download: "http://pip.bz/hrm-8aHmt",
            selected: false,
          },
        ],
        9000: [
          {
            img: "http://fastimages.org/images/2023/03/02/dazysmit_02032023_1500_female_Chaturbate.th.jpg",
            length: 7201,
            download: "http://pip.bz/hrm-8aNYt",
            selected: false,
          },
        ],
        10800: [],
        36000: [],
      };
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
    selectCard(card) {
      console.info("click selected");
      card.selected = !card.selected;
    },
    handleKeyDown(event) {
      if (event.key === "h") {
        // event.preventDefault();
        this.selectedCards =
          this.selectedCards.length === 0 ? this.getSelectedCards() : [];
      } else if (event.key === "z") {
        this.zoomKeyDown = true;
      }
    },
    handleKeyUp(event) {
      if (event.key === "z") {
        this.zoomKeyDown = false;
      }
    },
    getSelectedCards() {
      const selectedCards = [];
      this.chunkSizes.forEach((chunkSize) => {
        this.cards[chunkSize].forEach((card) => {
          if (card.selected) {
            selectedCards.push(card);
          }
        });
      });
      return selectedCards;
    },
    zoomUrl(url) {
      return url.replace(/\.th/g, "");
    },
  },
  computed: {
    comChunkSizes() {
      return Object.keys(this.cards).map(Number);
    },
  },
};
</script>

<style scoped>
* {
  /* background-color: #202124; */
  background-color: #171717;
  color: #bdc1c6;
  margin: 0px;
  padding: 0px;
}
.titles {
  display: flex;
  flex-wrap: wrap;
}
.titles .title {
  flex-basis: calc(11.11% - 10px);
  margin: 5px;
  background-color: #bdc1c6;
  text-align: center;
}
.title_selected {
  color: #fec848;
}
.active {
  display: flex;
}
.inactive {
  display: none;
}
.selected {
  border: 1px solid #ffc107;
}
.column.selected img {
  opacity: 1;
}
.wrapper {
  position: absolute;
  width: 100%;
}
/* <!-- Add "scoped" attribute to limit CSS to this component only --> */
.container {
  width: inherit;
  height: 750px;
  overflow-y: scroll;
  max-width: 100%;
  /* margin: 0px auto; */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.column:hover {
  border-radius: 10px;
  transition: 0.2s ease-in-out;
}
.column:hover img {
  opacity: 1;
  transition: 0.2s ease-in-out;
}
.column {
  flex-basis: calc(33.33% - 4px);

  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 15px;
  overflow: hidden;
  widows: 480px;
  height: 380px;
}
a {
  background-color: #7df9ff;
}
a:hover {
  background-color: azure;
}
.column img,
.column a {
  width: 100%;
  height: 100%;
}
.column img {
  overflow: hidden;
  opacity: 0.9;
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
