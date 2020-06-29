<template>
  <div>
    <b-row>
      <card v-for="(item, index) in items" :key="index" :item="item"></card>
    </b-row>
    <b-navbar fixed="bottom">
      <b-button block variant="primary" @click="createCard"
        >크루 카드 만들기</b-button
      >
    </b-navbar>
  </div>
</template>

<script>
import axios from 'axios'
import card from '../components/card'

export default {
  components: {
    card,
  },
  async asyncData() {
    const { data } = await axios.get(`http://localhost:8080/api/cards`)
    return { items: data }
  },
  methods: {
    createCard() {
      this.$router.push('/createCard')
    },
  },
}
</script>

<style></style>
