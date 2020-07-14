<template>
  <b-col v-if="condition" lg="4">
    <b-card
      no-body
      img-src="https://placekitten.com/380/200"
      img-alt="Image"
      img-top
    >
      <template v-slot:header>
        <h4 class="mb-0">
          {{ item.user.nick_name }}
        </h4>
      </template>

      <b-card-body>
        <b-card-title>{{ item.workout_type }}</b-card-title>
        <b-card-sub-title class="mb-2">{{
          item.workout_detail
        }}</b-card-sub-title>
        <b-card-text>
          {{ item.content }}
        </b-card-text>
      </b-card-body>

      <b-list-group flush>
        <b-list-group-item
          >장소 : {{ item.workout_location }}</b-list-group-item
        >
        <b-list-group-item>시간 : {{ createTime }}</b-list-group-item>
        <b-list-group-item
          >모집 인원 : {{ item.workout_member }}
        </b-list-group-item>
        <b-list-group-item
          >비용 : {{ item.workout_cost }} 원
        </b-list-group-item>
      </b-list-group>

      <b-card-body>
        <b-button
          v-if="!isOwner"
          block
          variant="outline-primary"
          @click="onTest"
          >참여</b-button
        >
        <b-button
          v-if="isOwner"
          block
          variant="outline-warning"
          @click="onUpdate"
          >수정</b-button
        >
        <b-button
          v-if="isOwner"
          block
          variant="outline-danger"
          @click="onDelete"
          >삭제</b-button
        >
      </b-card-body>

      <b-card-footer>댓글?</b-card-footer>
    </b-card>
    <br />
  </b-col>
</template>

<script>
import m from 'moment'
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      condition: true,
    }
  },
  computed: {
    createTime() {
      return m(this.item.workout_time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 로그인 유무에 따라 수정, 삭제 버튼을 보이게 함
    // 게시글을 작성한 사람만 수정, 삭제 버튼을 볼 수 있다
    isOwner() {
      return this.$store.state.isOwner && this.$store.state.isLogin
    },
    isLogin() {
      return this.$store.state.isLogin
    },
  },
  created() {
    // 로그인/로그아웃에 따라서 Card 버튼 상태를 변경하기 위한 이벤트 리스너
    this.$nuxt.$on('setOwner', () => {
      this.setOwner()
    })
  },
  mounted() {
    this.setOwner()
  },
  methods: {
    async setOwner() {
      try {
        const myid = await this.$axios.get('/myid')
        if (String(myid.data) === this.item.user_id) {
          this.$store.commit('owner')
        }
      } catch (error) {
        this.$store.commit('notOwner')
      }
    },
    async onDelete() {
      if (confirm('크루 카드를 삭제하시겠습니까?')) {
        await this.$axios.$delete(`/cards?id=${this.item.id}`)
        // 삭제한 카드는 화면에서 숨긴다
        // reload 해야 확실하지만 일단 빠르게 처리된 효과
        this.condition = false
      }
    },
    onUpdate() {
      this.$router.push(`/createCard?id=${this.item.id}`)
    },
    onTest() {
      alert(this.myid)
    },
  },
}
</script>

<style></style>
