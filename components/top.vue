<template>
  <div>
    <b-navbar toggleable="lg" variant="faded" type="light">
      <b-navbar-brand to="/">Work Out Mate</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" @click="login">카카오 로그인</b-nav-item>
          <b-nav-item href="#" @click="logout">다른 계정으로 로그인</b-nav-item>
          <b-nav-item href="#" @click="logout">로그아웃</b-nav-item>
          <b-nav-item href="#" @click="unlinkApp">탈퇴</b-nav-item>
          <b-nav-item href="#" @click="setting">설정</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  methods: {
    getUserInfo() {
      // 사용자 정보 요청
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
    login(k) {
      window.Kakao.Auth.login({
        success(authObj) {
          // 다른 메소드 사용하는 방법 모르겠음...
          this.getUserInfo()
        },
        fail(err) {
          alert(`로그인에 실패했습니다.\n${JSON.stringify(err)}`)
        },
      })
    },
    loginFormWithKakao() {
      window.Kakao.Auth.loginForm({
        success(authObj) {
          this.getUserInfo()
        },
        fail(err) {
          alert(`로그인에 실패했습니다.\n${JSON.stringify(err)}`)
        },
      })
    },
    logout() {
      if (!window.Kakao.Auth.getAccessToken()) {
        alert('로그인 상태가 아닙니다.')
        return
      }
      window.Kakao.Auth.logout(function () {
        alert(`로그아웃 되었습니다.`)
      })
    },
    unlinkApp() {
      // 서비스 탈퇴
      if (confirm(`Work Out Mate 서비스를 탈퇴합니다.`)) {
        window.Kakao.API.request({
          url: '/v1/user/unlink',
          success(res) {
            // 서비스를 탈퇴하면 로그아웃도 진행한다.
            window.Kakao.Auth.logout()
            alert('서비스 탈퇴에 성공했습니다.')
          },
          fail(err) {
            alert(
              `서비스 탈퇴에 실패했습니다.\n로그인 상태가 아닙니다.\n${JSON.stringify(
                err
              )}`
            )
          },
        })
      }
    },
    setting() {
      alert(`준비중..`)
    },
  },
}
</script>

<style></style>
