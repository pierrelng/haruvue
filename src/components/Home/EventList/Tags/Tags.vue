<template>
  <div class="tags">
    <ul class="list scroll-x-wrapper">
      <li
        class="list__item scroll-x-item"
        v-for="(tag, index) in this.tags"
        :ref="tag"
        :class="{ 'list__item--active': isActive === tag }"
        @click="search(tag, index)">
          {{ tag }}
        <!-- <router-link :to="{ name: 'Tag', params: { tag: tag } }">{{ tag }}</router-link> -->
      </li>
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
// import bus from '@/main';

export default {
  name: 'tags',
  props: ['event'],
  data() {
    return {
      tags: [],
      isActive: '',
    };
  },
  created() {
    this.prepareTags();
    if (this.$route.params.tag) {
      this.isActive = this.$route.params.tag;
    }
  },
  methods: {
    prepareTags() {
      this.iterator(this.event.acf, 'tag_what_genre');
      this.iterator(this.event.acf, 'tag_how_price');
      this.iterator(this.event.acf, 'tag_what_prod');
      this.iterator(this.event.acf, 'tag_what_atmos_scale');
      this.iterator(this.event.acf, 'tag_what_public');
      this.iterator(this.event.acf, 'tag_what_activities');
      this.iterator(this.event.acf, 'tag_what_atmos_misc');
      if (this.isActive !== '') {
        const index = this.tags.indexOf(this.isActive);
        this.tags.splice(index, 1);
        this.tags.unshift(this.isActive);
      }
    },
    iterator(object, tagLabel) {
      iterateObject(object, (value, key) => {
        if (key === tagLabel && value) {
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
      });
    },
    search(tag) {
      // bus.$emit('tagClicked', tag);
      if (this.$route.query.j) {
        this.$router.push({ name: 'Tag', params: { tag }, query: { j: this.$route.query.j } });
      } else {
        this.$router.push({ name: 'Tag', params: { tag } });
      }
    },
  },
};
</script>

<style scoped lang="stylus" src="./Tags.styl"></style>
