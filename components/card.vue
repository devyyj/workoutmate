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
          {{ item.user === null ? '' : item.user.nick_name }}
        </h4>
      </template>

      <!-- 운동 종목, 태그, 본문 -->
      <b-card-body>
        <b-card-title>{{ item.workout_type }}</b-card-title>
        <b-card-sub-title class="mb-2">{{
          item.workout_detail
        }}</b-card-sub-title>
        <p v-if="!readMore">
          <!-- 본문의 길이가 30보다 길때만 더보기 버튼을 생성, isLongContent -->
          {{ isLongContent ? item.content.slice(0, 30) + '...' : item.content }}
          <a v-if="isLongContent" href="#" @click="onReadMore">
            {{ readLink }}
          </a>
        </p>
        <pre v-if="readMore" style="white-space: pre-line;">
          {{ item.content }} <a href="#" @click="onReadMore">{{ readLink }}</a>
        </pre>
      </b-card-body>

      <!-- 장소, 인원, 비용 -->
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

      <!-- 버튼 -->
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
      readMore: false,
      readLink: '더보기',
      contentLength: 0,
      owner: false,
      myid: '',
    }
  },
  computed: {
    createTime() {
      return m(this.item.workout_time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 로그인 유무에 따라 수정, 삭제 버튼을 보이게 함
    // 게시글을 작성한 사람만 수정, 삭제 버튼을 볼 수 있다
    isOwner() {
      return this.owner && this.$store.state.isLogin
    },
    isLogin() {
      return this.$store.state.isLogin
    },
    isLongContent() {
      return this.item.content.length > 30
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
        this.myid = String(await this.$axios.$get('/myid'))
        if (this.myid === this.item.user_id) {
          this.owner = true
        }
      } catch (error) {}
    },
    async onDelete() {
      try {
        if (confirm('크루 카드를 삭제하시겠습니까?')) {
          await this.$axios.$delete(`/cards?id=${this.item.id}`)
          // 삭제한 카드는 화면에서 숨긴다
          // reload 해야 확실하지만 일단 빠르게 처리된 효과
          this.condition = false
        }
      } catch (error) {
        alert(error)
      }
    },
    onUpdate() {
      this.$router.push(`/createCard?id=${this.item.id}`)
    },
    onReadMore() {
      this.readMore = !this.readMore
      if (this.readMore) {
        this.readLink = '줄이기'
      } else {
        this.readLink = '더보기'
      }
    },
    onTest() {
      alert(this.myid)
    },
  },
}
</script>

<style></style>
