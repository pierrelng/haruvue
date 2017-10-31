<template>
  <div class="tags">
    <ul class="scroll-x-wrapper">
      <li class="scroll-x-item" v-for="tag in this.tags">{{ tag }}</li>
      <div class="shadow"></div>
    </ul>
    <!-- <div v-for="tag in this.event.acf.tag_what_genre" v-if="tag">{{ tag }}</div>
    <div v-for="tag in this.event.acf.tag_how_price" v-if="tag">{{ tag }}</div>
    <div v-for="tag in this.event.acf.tag_what_public" v-if="tag">{{ tag }}</div>
    <div v-for="tag in this.event.acf.tag_what_prod" v-if="tag">{{ tag }}</div>
    <div v-for="tag in this.event.acf.tag_what_activities" v-if="tag">{{ tag }}</div>
    <div v-for="tag in this.event.acf.tag_what_atmos_scale" v-if="tag">{{ tag }}</div>
    <div v-for="tag in this.event.acf.tag_what_atmos_misc" v-if="tag">{{ tag }}</div>
    <div v-for="tag in this.event.acf.tag_what_drink" v-if="tag">{{ tag }}</div>
    <div v-for="tag in this.event.acf.tag_how_entry" v-if="tag">{{ tag }}</div> -->
  </div>
</template>

<script>
import iterateObject from 'iterate-object';

export default {
  name: 'tags',
  props: ['event'],
  data() {
    return {
      tags: [],
    };
  },
  created() {
    this.prepareTags();
  },
  methods: {
    prepareTags() {
      iterateObject(this.event.acf, (value, key) => {
        if (
          key === 'tag_how_entry' ||
          key === 'tag_how_price' ||
          key === 'tag_what_genre' ||
          key === 'tag_what_public' ||
          key === 'tag_what_prod' ||
          key === 'tag_what_activities' ||
          key === 'tag_what_atmos_scale' ||
          key === 'tag_what_atmos_misc' ||
          key === 'tag_what_drink'
        ) {
          if (value) {
            if (Array.isArray(value)) {
              for (let i = 0; i < value.length; i += 1) {
                if (value[i]) {
                  this.tags.push(value[i]);
                }
              }
            } else {
              this.tags.push(value);
            }
          }
        }
      });
    },
  },
};
</script>

<style scoped lang="stylus" src="./Tags.styl"></style>
