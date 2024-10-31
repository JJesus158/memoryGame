<script setup>
import semFaceImage from "@/assets/cards/semFace.png";

const props = defineProps({
  icon: String,
  flipped: Boolean,
  matched: Boolean,
  id: String,
});

const emit = defineEmits(["flip"]);

const handleClick = () => {
  if (!props.flipped && !props.matched) {
    emit("flip", props.id); // Emitting the flip event with the card ID
  }
};
</script>

<template>
  <div
      class="card-inner transition-transform duration-300 cursor-pointer"
      @click="handleClick"
  >
    <img
        :src="props.flipped ? props.icon : semFaceImage"
        v-show="!props.matched"
        alt="Card"
        class="absolute w-full h-full rounded-lg"
    />

  </div>
</template>


