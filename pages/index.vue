<template>
  <div>
    <b-row>
      <card v-for="(item, index) in items" :key="index" :item="item"></card>
    </b-row>
    <b-navbar fixed="bottom" sticky>
      <b-button block variant="primary" @click="createCard"
        >크루 카드 만들기</b-button
      >
    </b-navbar>
  </div>
</template>

<script>
import card from '../components/card'

export default {
  components: {
    card,
  },
  async asyncData({ $axios }) {
    return { items: await $axios.$get('/cards') }
  },
  methods: {
    createCard(e) {
      this.$router.push('/createCard')
    },
  },
}
</script>

<style></style>
