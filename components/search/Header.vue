<style lang="scss">
  .header {
    height: 64px;
    padding: 10px 20px;
    border-bottom: 1px solid #eee;
    overflow: hidden;
    transition: all .2s ease-in-out;
    box-shadow: 0 2px 8px rgba(177,177,177,.5);

    &__container {
      margin: 0 auto;
      height: 100%;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;

      &__logo {

      }

      &__search {
        input{

        }
      }
    }

  }
</style>

<template>
  <header class="header">
    <div class="header__container">
      <div class="header__logo">
        <Logo type="text" />
      </div>
      <div class="header__search">
        <slot></slot>
      </div>
      <div class="header__action"></div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SearchHeader',
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
  }
}
</script>
