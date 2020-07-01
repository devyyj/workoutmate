<template>
  <div>
    <b-navbar toggleable="lg" variant="primary" type="dark">
      <b-navbar-brand to="/">Work Out Mate</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item href="#" @click="login">로그인</b-nav-item>
          <b-nav-item href="#" @click="logout">로그아웃</b-nav-item>
          <b-nav-item href="#" @click="unlinkApp">탈퇴</b-nav-item>
          <b-nav-item href="#">설정</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      window.Kakao.Auth.login({
        success(authObj) {
          alert(JSON.stringify(authObj))
          window.Kakao.API.request({
            url: '/v2/user/me',
            success(res) {
              alert(JSON.stringify(res))
            },
            fail(error) {
              alert(
                'login success, but failed to request user information: ' +
                  JSON.stringify(error)
              )
            },
          })
        },
        fail(err) {
          alert(JSON.stringify(err))
        },
      })
    },
    logout() {
      window.location.replace(
        'https://kauth.kakao.com/oauth/logout?client_id=76e7adf8ebf974025908884824504e7b&logout_redirect_uri=http://localhost:8080/'
      )
      console.log('***************************************************')
      if (!window.Kakao.Auth.getAccessToken()) {
        alert('Not logged in.')
        return
      }
      window.Kakao.Auth.logout(function () {
        alert(
          'logout ok\naccess token -> ' + window.Kakao.Auth.getAccessToken()
        )
      })
    },
    unlinkApp() {
      window.Kakao.API.request({
        url: '/v1/user/unlink',
        success(res) {
          alert('success: ' + JSON.stringify(res))
        },
        fail(err) {
          alert('fail: ' + JSON.stringify(err))
        },
      })
    },
  },
}
</script>

<style></style>
