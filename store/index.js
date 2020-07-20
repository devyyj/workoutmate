export const state = () => ({
  isLogin: false,
  myid: '',
})

export const mutations = {
  login(state) {
    state.isLogin = true
  },
  logout(state) {
    state.isLogin = false
  },
  setMyid(state, myid) {
    state.myid = myid
  },
}
