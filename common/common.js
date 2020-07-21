async function initMyid(vue) {
  try {
    const myid = String(await vue.$axios.$get('/myid'))
    await vue.$store.commit('setMyid', myid)
  } catch (error) {
    await vue.$store.commit('setMyid', '')
  }
}

async function getMyid(vue) {
  if (!vue.$store.state.myid) {
    await initMyid(vue)
  }
  return vue.$store.state.myid
}

export { getMyid, initMyid }
