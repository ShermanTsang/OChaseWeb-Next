export default {
  async GET_INIT_DATA({ commit }) {
    const [configurations, fileAssets, imageAssets] =
      await Promise.all([
        this.$axios.$get('/api/configurations'),
        this.$axios.$get('/api/fileAssets'),
        this.$axios.$get('/api/imageAssets')
      ])
    commit('configurationList', configurations.data)
    commit('fileAssetList', fileAssets.data)
    commit('imageAssetList', imageAssets.data)
  },
  async nuxtServerInit({ dispatch }) {
    await dispatch('GET_INIT_DATA')
  }
}
