<style lang="scss">
</style>

<template>
  <div id="app">
    <layout-sidebar class="layout-sidebar" />
    <layout-header class="layout-header" />
    <layout-view>
      <layout-main class="layout-main">
        <nuxt />
      </layout-main>
      <layout-footer />
    </layout-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: {}
    }
  },
  mounted() {
    if (process.browser) {
    }
  },
  methods: {}
}
</script>
