<template>
  <div>
    <script src="https://developers.kakao.com/sdk/js/kakao.min.js"></script>
    <a id="create-kakao-login-btn"></a>
    <b-button @click="getData">GET</b-button>
    <b-button @click="logout">로그아웃</b-button>
    <a id="login-form-btn" :href="relogin">
      <img
        src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
        width="222"
      />
    </a>
  </div>
</template>

<script>
export default {
  mounted: () => {
    // SDK를 초기화 합니다. 사용할 앱의 JavaScript 키를 설정해 주세요.
    window.Kakao.init('c5d4b6ee6c437fd80a93fc64ca9982f9')

    // SDK 초기화 여부를 판단합니다.
    console.log(window.Kakao.isInitialized())

    window.Kakao.Auth.createLoginButton({
      container: '#create-kakao-login-btn',
      success(authObj) {
        alert(JSON.stringify(authObj))
      },
      fail(err) {
        alert(JSON.stringify(err))
      },
    })
  },
  // window.Kakao.Auth.setAccessToken(response.access_token)
  methods: {
    relogin() {
      window.Kakao.Auth.loginForm({
        success(authObj) {
          alert(JSON.stringify(authObj))
        },
        fail(err) {
          alert(JSON.stringify(err))
        },
      })
    },
    getData() {
      window.Kakao.API.request({
        url: '/v2/user/me',
        success(response) {
          console.log(response)
        },
        fail(error) {
          console.log(error)
        },
      })
    },
    logout() {
      if (!window.Kakao.Auth.getAccessToken()) {
        console.log('Not logged in.')
        return
      }
      window.Kakao.Auth.logout(function () {
        console.log(window.Kakao.Auth.getAccessToken())
      })
    },
  },
}
</script>

<style></style>
