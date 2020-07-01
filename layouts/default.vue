<template>
  <b-container>
    <top></top>
    <Nuxt />
  </b-container>
</template>
<script>
import top from '../components/top'
export default {
  components: {
    top,
  },
  // mount()에서 kakao 함수를 사용하기 전에 init()를 호출해야 한다.
  beforeMount() {
    window.Kakao.init('c5d4b6ee6c437fd80a93fc64ca9982f9')
  },
  head: {
    script: [{ src: 'https://developers.kakao.com/sdk/js/kakao.min.js' }],
  },
}
</script>

<style></style>
