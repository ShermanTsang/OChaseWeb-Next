<style lang="scss">
  .search-page {

    &__main {
      display: flex;
      flex-flow: row nowrap;
      padding-top: 64px;
      height: 100vh;

      &__web {
        position: relative;
        width: 100%;
        flex-grow: 1;

        &__iframe {
          opacity: .6;
          width: 100%;
          height: 100%;
          transition: opacity .2s ease-in-out;

          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }

          &:hover {
            opacity: 1;
          }

        }

        &__toolbar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          padding: 10px 16px;
          background-color: rgba(255, 255, 255, .95);
          box-shadow: 0 -2px 4px rgba(177, 177, 177, .2);
          letter-spacing: 2px;

          &__info {
            font-size: .9rem;
            color: #666;

            span {
              font-size: .85rem;
              color: #999;
            }
          }
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
    <div class="search-page__main">
      <div v-for="item in status.activeEngineList" :key="item.slug" class="search-page__main__web">
        <Loading :fix="true" v-if="item.isLoading">
          {{ item.name }}加载中...
        </Loading>
        <div class="search-page__main__web__iframe">
          <iframe :src="getSearchEngineUrl(item.url)" :id="`iframe-${item.slug}`" allowtransparency></iframe>
        </div>
        <div class="search-page__main__web__toolbar">
          <div class="search-page__main__web__toolbar__info">
            <span>{{ item.category }} /</span> {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'search',
  head() {
    return {
      title: `${this.displayKeyword} - 逐搜`,
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
