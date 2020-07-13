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
          <b-nav-item v-if="isLogin" href="#" @click="unlinkApp"
            >탈퇴</b-nav-item
          >
          <b-nav-item v-if="isLogin" href="#" @click="setting">설정</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // isLogin: false,
    }
  },
  computed: {
    isLogin() {
      return this.$store.state.isLogin
    },
  },
  async mounted() {
    // init은 최초에 한번!
    window.Kakao.init('c5d4b6ee6c437fd80a93fc64ca9982f9')
    try {
      await this.$axios.get('/login')
      this.$store.commit('login')
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
    async logout() {
      if (!this.$store.state.isLogin) {
        alert('로그인 상태가 아닙니다.')
        return
      }
      try {
        await this.$axios.get('/logout')
        this.$store.commit('logout')
        alert(`로그아웃 되었습니다.`)
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
              const myid = await this.$axios.get('/myid')
              await this.$axios.$delete(`/users?id=${myid.data}`)
              await this.$axios.get('/logout')
              this.$store.commit('logout')
              alert('서비스 탈퇴에 성공했습니다.')
              this.$router.push('/')
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
    setting() {
      alert(this.$store.state.isLogin)
    },
  },
}
</script>

<style></style>
