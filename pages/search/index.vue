<style lang="scss">
  .search-page {

    &__body {
      display: flex;
      flex-flow: row nowrap;
      height: calc(100vh - 64px);

      &__frame {
        position: relative;
        width: 100%;
        flex-grow: 1;

        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      }
    }
  }
</style>

<template>
  <div class="search-page">
    <search-header class="layout-search-header">
      <search-box @on-search="refreshResult" />
    </search-header>
    <div class="search-page__body">
      <div v-for="item in status.activeEngineList" :key="item.slug" class="search-page__body__frame">
        <Loading :fix="true" v-if="item.isLoading">
          {{ item.name }}加载中...
        </Loading>
        <iframe :src="getSearchEngineUrl(item.url)" :id="`iframe-${item.slug}`" allowtransparency></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from '../../components/search/Box'
export default {
  components: { SearchBox },
  layout: 'search',
  head() {
    return {
      title: `搜索 - ${this.displayKeyword}`,
      meta: [
        { hid: 'index', name: 'description', content: this.$getSeoInfo('description', '多栏搜索') }
      ]
    }
  },
  data() {
    return {
      status: {
        activeEngineList: [],
        isLoading: {}
      }
    }
  },
  computed: {
    displayKeyword() {
      const { keyword } = this.$route.query
      return (keyword && keyword.length > 8 ? `${keyword.substring(0, 8)}...` : keyword) || ''
    }
  },
  async asyncData({ $axios, query }) {
    const { data: engineList } = await $axios.$get('/api/engines', {
      params: {}
    })
    return {
      data: {
        engineList
      }
    }
  },
  mounted() {
    this.setActiveEngine()
    this.refreshResult()
  },
  methods: {
    getSearchEngineUrl(url) {
      return url.replace(new RegExp('%s'), this.$route.query.keyword)
    },
    setActiveEngine() {
      if (!window.localStorage.getItem('search/activeEngine')) {
        this.status.activeEngineList = this.data.engineList.filter((item) => {
          return ['bing', 'baidu'].includes(item.slug)
        })
      } else {

      }
    },
    refreshResult() {
      setTimeout(() => {
        this.status.activeEngineList.forEach((item) => {
          this.$set(item, 'isLoading', true)
          this.onIframeLoad(item)
        })
      }, 0)
    },
    onIframeLoad(iframeItem) {
      const iframe = document.getElementById(`iframe-${iframeItem.slug}`)
      if (iframe.attachEvent) {
        // FOR IE
        iframe.attachEvent('onload', () => {
          this.$set(iframeItem, 'isLoading', false)
        })
      } else {
        iframe.onload = () => {
          this.$set(iframeItem, 'isLoading', false)
        }
      }
    }
  }
}
</script>
