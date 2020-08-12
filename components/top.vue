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
            <b-dropdown-item v-b-modal.set-profile href="#"
              >프로필</b-dropdown-item
            >
            <b-dropdown-item href="#" @click="unlinkApp">탈퇴</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal
      id="set-profile"
      title="프로필을 설정하세요."
      scrollable
      @show="showModal"
      @ok="handleOk"
    >
      <form @submit.prevent="handleSubmit">
        <!-- description을 multi line으로 하고 싶은데 안되는 것 같다. -->
        <b-form-group
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
            @keypress.enter.prevent
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="프로필 사진"
          label-for=""
          description="PNG, JPEG 이미지만 가능합니다."
        >
          <div style="text-align: center;">
            <croppa
              v-model="picture"
              :width="getCroppaSize"
              :height="getCroppaSize"
              :prevent-white-space="true"
              :accept="'image/*'"
              :initial-image="getCroppaInitImg"
              @loading-end="handleCroppaFile"
              @initial-image-loaded="test"
            >
            </croppa>
          </div>
        </b-form-group>
        <b-form-group
          label="정보"
          label-for="textarea-no-resize"
          description="최대 250자까지 작성할 수 있습니다."
        >
          <b-form-textarea
            id="textarea-no-resize"
            v-model="infomation"
            placeholder="정보를 입력해 주세요."
            rows="8"
            no-resize
            maxlength="251"
            :state="infomationState"
          ></b-form-textarea>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
// todo 코드가 너무 길다 쪼갤 필요가 있을 듯!
import { initMyid, getMyid } from '../common/common'
import 'vue-croppa/dist/vue-croppa.css'

export default {
  data() {
    return {
      nickname: '',
      infomation: '',
      picture: {},
      croppaSize: 200,
      croppaInitImg: '',
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
    infomationState() {
      return this.infomation.length <= 250
    },
    getCroppaSize() {
      return this.croppaSize > 350 ? 350 : this.croppaSize
    },
    getCroppaInitImg() {
      return this.croppaInitImg
    },
  },
  async beforeMount() {
    this.setCroppaSize()
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
          // 로그인에 성공하고 사용자 정보를 받으면 user 테이블에 추가한다.
          await this.$axios.$post('/user', { id: res.id })
          this.$store.commit('login')
          // 로그인 했을때 Card 버튼(수정, 삭제) 상태를 바꾼다.
          this.$nuxt.$emit('setOwner')
          this.$router.push('/')
          await this.setUserInfo()
          alert(`'${this.nickname}'님, 로그인하셨습니다.`)
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
        // ? 개발 모드에서는 문제 없으나 운영 서버에 배포하면 NGINX를 거치기 때문에
        // ? no-cache 설정을 안하면 로그아웃 할때 캐시 삭제가 안된다.
        // ? 왜 그런지 정확한 이유를 모르겠다...
        await this.$axios.$get('/logout', {
          headers: { 'Cache-Control': 'no-cache' },
        })
        this.$store.commit('logout')
        alert(`로그아웃되었습니다.`)
        // 로그아웃 했을때 Card 버튼(수정, 삭제) 상태를 바꾼다.
        this.$nuxt.$emit('setOwner')
        // 로그아웃하면 myid 초기화
        await initMyid(this)
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
              await this.$axios.$delete(`/user`)
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
    async showModal() {
      await this.setUserInfo()
      // this.picture.refresh()
    },
    async setUserInfo() {
      try {
        const myid = await getMyid(this)
        const data = await this.$axios.$get(`/user?id=${myid}`)
        this.nickname = data.nick_name
        this.croppaInitImg = data.picture
      } catch (error) {
        alert(error)
      }
    },
    // 회전된 이미지를 바로 잡는다
    // 보통 orientation 값이 6인 경우
    handleCroppaFile() {
      this.picture.applyMetadata({ orientation: 1 })
    },
    async handleOk(bvModalEvt) {
      bvModalEvt.preventDefault()
      // 유효성 검사
      if (!this.nicknameState) {
        return
      }
      // 사진 업로드 처리
      try {
        // 사진을 첨부했을 때만 사진 업로드
        if (this.picture) await this.uploadCroppedImage(this.picture)
      } catch (error) {
        alert(error)
        return
      }
      // 프로필 수정 처리
      try {
        // 프로필 수정
        await this.$axios.$patch('/user', {
          nick_name: this.nickname,
          infomation: this.infomation,
        })
        // Modal 숨김
        this.$nextTick(() => {
          this.$bvModal.hide('set-profile')
        })
        // 새로 고침
        this.$router.go()
      } catch (error) {
        if (error.response.status === 400) alert('이미 사용중인 닉네임입니다.')
        else alert(error)
      }
    },
    async uploadCroppedImage(picture) {
      try {
        const blob = await picture.promisedBlob('image/jpeg', 1)
        const form = new FormData()
        form.append('image', blob)
        await this.$axios.$post('/user/upload-image', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      } catch (error) {
        alert(error)
      }
    },
    /**
     * 윈도우 가로 크기에 따라 croppa 크기를 변경한다.
     * 처음엔 윈도우 크기가 아니라 Modal의 크기에 따라 변경하려고 했다.
     * 어차피 결과는 같지만... Modal은 특수해서 ref 설정이 제대로 적용안되는 거 같다.
     * 중앙 정렬이기 때문에 -50할 경우 좌우 25픽셀씩 띄워진다.
     */
    setCroppaSize(abc) {
      this.croppaSize = window.innerWidth - 50
      window.addEventListener('resize', () => {
        this.croppaSize = window.innerWidth - 50
      })
    },
    test() {
      console.log('call!')
    },
  },
}
</script>

<style></style>
