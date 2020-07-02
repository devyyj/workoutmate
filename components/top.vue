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
      isLogin: false,
    }
  },
  methods: {
    // 사용자 정보 요청
    getUserInfo() {
      window.Kakao.API.request({
        url: '/v2/user/me',
        success(res) {
          alert(`${res.properties.nickname}님, 안녕하세요!`)
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
        always: () => {
          this.isLogin = window.Kakao.Auth.getAccessToken()
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
        always: () => {
          this.isLogin = window.Kakao.Auth.getAccessToken()
        },
      })
    },
    logout() {
      if (!window.Kakao.Auth.getAccessToken()) {
        alert('로그인 상태가 아닙니다.')
        return
      }
      window.Kakao.Auth.logout(() => {
        alert(`로그아웃 되었습니다.`)
        this.isLogin = window.Kakao.Auth.getAccessToken()
      })
    },
    // 서비스 탈퇴
    unlinkApp() {
      if (confirm(`Work Out Mate 서비스를 탈퇴합니다.`)) {
        window.Kakao.API.request({
          url: '/v1/user/unlink',
          success: (res) => {
            // 서비스를 탈퇴하면 로그아웃도 진행한다.
            alert('서비스 탈퇴에 성공했습니다.')
            this.isLogin = false
          },
          fail(err) {
            alert(`서비스 탈퇴에 실패했습니다.\n${JSON.stringify(err)}`)
          },
        })
      }
    },
    setting() {
      alert(`준비중..`)
    },
  },
  beforeMount() {
    this.isLogin = window.Kakao.Auth.getAccessToken()
  },
}
</script>

<style></style>
