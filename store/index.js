export const state = () => ({
  isLogin: false,
  isOwner: false,
})

export const mutations = {
  login(state) {
    state.isLogin = true
  },
  logout(state) {
    state.isLogin = false
  },
  owner(state) {
    state.isOwner = true
  },
  notOwner(state) {
    state.isOwner = false
  },
}
