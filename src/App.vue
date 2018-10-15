<template>
  <div id="app">
    <Header/>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from './components/includes/Header.vue';

  export default {
    name: 'app',
    components: {
      Header
    }
  }
</script>

<style lang="scss">
  @import '../node_modules/bootstrap/scss/bootstrap.scss';
  
  #app {

    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;

    .container {
      max-width: none;

      > div > div {
        padding: 0;
      }
      
    }

  }

</style>
