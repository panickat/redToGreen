<template>
  <div
    class="containerZoom"
    @mousemove="onZoom"
    @mouseover="onZoom"
    @mouseleave="offZoom"
  >
    <img
      :src="imageSrc"
      :style="{ transformOrigin: transformOrigin, transform: transform }"
    />
  </div>
</template>

<script>
export default {
  props: {
    imageSrc: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      transformOrigin: "center center",
      transform: "scale(1)",
    };
  },
  methods: {
    onZoom(e) {
      const x = e.clientX - e.target.offsetLeft;
      const y = e.clientY - e.target.offsetTop;
      this.transformOrigin = `${x}px ${y}px`;
      this.transform = "scale(2.5)";
    },
    offZoom() {
      this.transformOrigin = "center center";
      this.transform = "scale(1)";
    },
  },
};
</script>

<style>
.containerZoom {
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  widows: 480px;
  height: 380px;
}
img {
  object-fit: cover;
  height: 100%;
  width: 100%;
}
</style>
