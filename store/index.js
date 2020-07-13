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
  async setOwner(state) {
    console.log(`setOwner`)
    try {
      const myid = await this.$axios.get('myid')

      if (String(myid.data) === this.item.user_id) {
        state.isOwner = true
        console.log(`state.isOwner = true`)
      }
    } catch (error) {
      console.log(error)
      state.isOwner = false
      console.log(`state.isOwner = false`)
    }
  },
}
