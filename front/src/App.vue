<template>
  <div id="app">
    <v-app>
      <component :is="layout">
        <router-view/>
      </component>
    </v-app>
  </div>
</template>

<script>
  export default {
    computed: {
      layout() {
        return (this.$route.meta.layout)
      }
    }
  }
</script>


<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    //	color: #2c3e50;
    background-color:black;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>

