<template>
  <b-col v-if="condition" lg="4">
    <b-card
      no-body
      img-src="https://placekitten.com/380/200"
      img-alt="Image"
      img-top
      header-bg-variant="primary"
      header-text-variant="white"
    >
      <b-list-group flush>
        <b-list-group-item>
          <b-avatar
            href="#"
            :src="item.user.picture"
            @click="$bvModal.show(String(item.id) + '-profile')"
          ></b-avatar>
          {{ item.user === null ? '' : item.user.nick_name }}
        </b-list-group-item>
      </b-list-group>

      <!-- 운동 종목, 태그, 본문 -->
      <b-card-body>
        <b-card-title>{{ item.type }}</b-card-title>
        <b-card-sub-title class="mb-2">{{ item.detail }}</b-card-sub-title>
        <b-card-text v-if="!readMore">
          <!-- 본문의 길이가 30보다 길때만 더보기 버튼을 생성, isLongContent -->
          {{ isLongContent ? item.content.slice(0, 30) + '...' : item.content }}
          <a v-if="isLongContent" href="#" @click="onReadMore">
            {{ readLink }}
          </a>
        </b-card-text>
        <pre v-if="readMore" style="white-space: pre-line;">
          {{ item.content }} <a href="#" @click="onReadMore">{{ readLink }}</a>
        </pre>
      </b-card-body>

      <!-- 장소, 시간, 인원, 비용 -->
      <b-list-group flush>
        <b-list-group-item>
          장소 :
          <b-link href="#" @click="openMap(item)">
            {{ `${item.location_name} (${item.location})` }}
          </b-link>
        </b-list-group-item>
        <b-list-group-item>시간 : {{ createTime }}</b-list-group-item>
        <!-- 클릭하면 크루 리스트를 출력한다. 카드마다 Modal이 있기 때문에 ID를 고유하게 부여한다. -->
        <b-list-group-item>
          크루 :
          <b-link @click="$bvModal.show(String(item.id))">
            {{ crewCount }} / {{ item.max }} 명</b-link
          >
        </b-list-group-item>
        <b-list-group-item
          >비용 : {{ Number(item.cost) }} 원
        </b-list-group-item>
      </b-list-group>

      <!-- 버튼 -->
      <b-card-body>
        <b-button
          block
          variant="outline-primary"
          :disabled="isFull"
          @click="join"
        >
          {{ isJoined ? '참여 취소' : '참여' }}</b-button
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

      <!-- Modal ID를 고유하게 부여한다. -->
      <b-modal
        :id="String(item.id)"
        scrollable
        hide-footer
        title="참여한 크루"
        size="sm"
      >
        <b-list-group>
          <b-list-group-item
            v-for="(crew, index) in crewList"
            :key="index"
            class="d-flex align-items-center"
          >
            <!-- <b-avatar class="mr-3" href="#"></b-avatar> -->
            <b-avatar class="mr-3"></b-avatar>
            <span class="mr-auto"> {{ crew }} </span>
          </b-list-group-item>
        </b-list-group>
      </b-modal>

      <b-modal
        :id="String(item.id) + '-profile'"
        scrollable
        hide-footer
        :title="item.user.nick_name + '님의 프로필'"
        size="sm"
      >
        <b-img :src="item.user.picture" fluid-grow></b-img>
        <hr />
        <pre style="white-space: pre-line;">
          {{ item.user.infomation }}
        </pre>
      </b-modal>
    </b-card>
    <br />
  </b-col>
</template>

<script>
import m from 'moment'
import { getMyid } from '../common/common'
import 'moment/locale/ko'

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
      crewList: [],
    }
  },
  computed: {
    createTime() {
      return m(this.item.time).calendar({ sameElse: 'YYYY-MM-DD HH:mm' })
    },
    // 로그인 유무에 따라 수정, 삭제 버튼을 보이게 함
    // 게시글을 작성한 사람만 수정, 삭제 버튼을 볼 수 있다
    isOwner() {
      return this.owner && this.$store.state.isLogin
    },
    isLongContent() {
      return this.item.content.length > 30
    },
    crewCount() {
      let result
      if (this.item.crew) result = this.item.crew.split(',').length
      else result = 0
      return result
    },
    // 로그아웃 하면 참여상태이더라도 참여 버튼으로 보이게한다.
    isJoined() {
      let result = false
      if (this.myid) {
        result = this.item.crew.split(',').includes(this.myid)
      }
      return result && this.$store.state.isLogin
    },
    // 크루에 참여하지 않았는데 정원이 다 찼으면 버튼 비활성화
    isFull() {
      return this.isJoined === false && this.crewCount / this.item.max === 1
    },
  },
  created() {
    // 로그인/로그아웃에 따라서 Card 버튼 상태를 변경하기 위한 이벤트 리스너
    this.$nuxt.$on('setOwner', () => {
      this.setOwner()
    })
  },
  beforeMount() {
    // 로그인 하지 않았을 때 새로고침하면 'GET http://localhost:8080/api/myid 401 (Unauthorized)'
    // 에러가 카드 수만큼 콘솔에 발생한다.
    // 로그인 안된 경우에는 해당 API를 호출하지 않으면 되지만
    // 새로고침 했을때 로그인 유무를 체크하면 결국 API를 다시 호출해야한다.
    // store에 로그인 유무를 저장할 수 있지만 card 컴포넌트가 생성되기 전에 저장해야한다.
    // top 컴포넌트는 card 컴포넌트보다 늦게 생성이 완료된다.
    this.setOwner()
    this.setCrewList()
  },
  methods: {
    // item.crew에 있는 user id로 nick_name을 얻는다.
    setCrewList() {
      try {
        this.crewList = []
        if (this.item.crew) {
          const result = this.item.crew.split(',')
          result.map(async (x) => {
            const data = await this.$axios.$get(`/user?id=${x}`)
            this.crewList.push(data.nick_name)
          })
        }
      } catch (error) {
        alert(error)
      }
    },
    async setOwner() {
      this.myid = await getMyid(this)
      if (this.myid === this.item.user_id) {
        this.owner = true
      } else {
        this.owner = false
      }
    },
    async onDelete() {
      try {
        if (confirm('크루 카드를 삭제하시겠습니까?')) {
          await this.$axios.$delete(`/card?id=${this.item.id}`)
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
    // join 유무를 따져서 배열에서 id를 제거 또는 추가한다.
    async join() {
      try {
        let msg = ''
        let crew = []
        if (this.item.crew) crew = this.item.crew.split(',')
        if (this.isJoined) {
          crew.splice(crew.indexOf(this.myid), 1)
          msg = '크루 참여를 취소했습니다.'
        } else {
          crew.push(this.myid)
          msg = '크루에 참여했습니다.'
        }
        crew = crew.join()
        await this.$axios.$patch(`/join`, {
          id: this.item.id,
          crew,
        })
        this.item.crew = crew
        // this.item.crew 가 변경되면 crewList를 다시 설정한다.
        this.setCrewList()
        alert(msg)
      } catch (error) {
        if (error.response.status === 401) alert('로그인 상태가 아닙니다.')
        else alert(error)
      }
    },
    openMap(param) {
      window.open(
        `https://map.kakao.com/link/map/${param.location_id}`,
        '_blank'
      )
    },
  },
}
</script>

<style></style>
