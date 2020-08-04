<template>
  <div>
    <b-navbar toggleable="lg" variant="faded" type="light">
      <b-navbar-brand to="/">Work Out Mate</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!isLogin" href="#" @click="login"
            >카카오톡 로그인</b-nav-item
          >
          <b-nav-item v-if="!isLogin" href="#" @click="loginFormWithKakao"
            >카카오 계정 로그인</b-nav-item
          >
          <b-nav-item v-if="isLogin" href="#" @click="logout"
            >로그아웃</b-nav-item
          >
          <b-nav-item-dropdown v-if="isLogin" text="설정" right>
            <b-dropdown-item v-b-modal.set-nick-name href="#"
              >닉네임</b-dropdown-item
            >
            <b-dropdown-item href="#" @click="unlinkApp">탈퇴</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal
      id="set-nick-name"
      ref="modal"
      title="닉네임을 설정하세요."
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form @submit.stop.prevent="handleSubmit">
        <!-- description을 multi line으로 하고 싶은데 안되는 것 같다. -->
        <b-form-group
          :state="nicknameState"
          label="닉네임"
          label-for="nickname-input"
          description="한글, 영문, 숫자만 가능합니다.(최소 1글자, 최대 10글자.)"
        >
          <b-form-input
            id="nickname-input"
            v-model="nickname"
            :state="nicknameState"
            maxlength="11"
            autofocus
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { initMyid } from '../common/common'

export default {
  data() {
    return {
      nickname: '',
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin
    },
    nicknameState() {
      const regex = /^[가-힣|a-z|A-Z|0-9]+$/
      return (
        regex.test(this.nickname) &&
        this.nickname.length >= 1 &&
        this.nickname.length <= 10
      )
    },
  },
  async mounted() {
    // init은 최초에 한번!
    window.Kakao.init('c5d4b6ee6c437fd80a93fc64ca9982f9')
    try {
      // 로그인 상태 저장
      await this.$axios.$get('/isLogin')
      this.$store.commit('login')
      // myid를 store에 저장
      await initMyid(this)
    } catch (error) {
      this.$store.commit('logout')
    }
  },
  methods: {
    // 사용자 정보 요청
    getUserInfo() {
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: async (res) => {
          // 로그인에 성공하고 사용자 정보를 받으면 users 테이블에 추가한다.
          await this.$axios.$post('/users', { id: res.id })
          this.$store.commit('login')
          // 로그인 했을때 Card 버튼(수정, 삭제) 상태를 바꾼다.
          this.$nuxt.$emit('setOwner')
          this.$router.push('/')
        },
        fail(error) {
          alert(
            `로그인에 성공했지만 사용자 정보를 가져올 수 없습니다.\n${JSON.stringify(
              error
            )}`
          )
        },
      })
    },
    // 로그인
    login() {
      window.Kakao.Auth.login({
        // arrow function 처리해야 다른 method 호출 가능!
        success: (authObj) => {
          this.getUserInfo()
        },
        fail(err) {
          alert(`로그인에 실패했습니다.\n${JSON.stringify(err)}`)
        },
      })
    },
    // 다른 계정 로그인
    loginFormWithKakao() {
      window.Kakao.Auth.loginForm({
        success: (authObj) => {
          this.getUserInfo()
        },
        fail(err) {
          alert(`로그인에 실패했습니다.\n${JSON.stringify(err)}`)
        },
      })
    },
    // 로그아웃
    async logout() {
      if (!this.$store.state.isLogin) {
        alert('로그인 상태가 아닙니다.')
        return
      }
      try {
        await this.$axios.$get('/logout')
        this.$store.commit('logout')
        alert(`로그아웃 되었습니다.`)
        // 로그아웃 했을때 Card 버튼(수정, 삭제) 상태를 바꾼다.
        this.$nuxt.$emit('setOwner')
        // 로그아웃하면 myid 초기화
        initMyid(this)
        this.$router.push('/')
      } catch (error) {
        alert(error)
      }
    },
    // 서비스 탈퇴
    unlinkApp() {
      if (confirm(`Work Out Mate 서비스를 탈퇴합니다.`)) {
        window.Kakao.API.request({
          url: '/v1/user/unlink',
          success: async (res) => {
            try {
              await this.$axios.$delete(`/users`)
              this.logout()
            } catch (error) {
              alert(error)
            }
          },
          fail(err) {
            alert(`서비스 탈퇴에 실패했습니다.\n${JSON.stringify(err)}`)
          },
        })
      }
    },
    // ==================================== 여기부터
    async resetModal() {
      const myid = this.$store.state.myid
      const data = await this.$axios.$get(`/users?id=${myid}`)
      this.nickname = data.nick_name
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.handleSubmit()
    },
    async handleSubmit() {
      // Exit when the form isn't valid
      if (!this.nicknameState) {
        return
      }
      try {
        await this.$axios.$patch('/users', { nick_name: this.nickname })
      } catch (error) {
        if (error.response.status === 400) alert('이미 사용중인 닉네임입니다.')
        else alert(error)
        return
      }
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('set-nick-name')
      })
      this.$router.go()
    },
    // ==================================== 여기까지, 닉네임 변경 Modal 관련 함수
  },
}
</script>

<style></style>
