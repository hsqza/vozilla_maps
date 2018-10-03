import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { routes } from './routes.js'

import * as VueGoogleMaps from 'vue2-google-maps'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import axios from 'axios'

Vue.use(VueRouter);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyB_6whlZFSeMe7eXJ7JF9iiXqqDlkWfmR0",
    libraries: "places" // necessary for places input
  }
});
Vue.component('GmapCluster', GmapCluster)

const router = new VueRouter({
  mode: 'history', 
  routes
})

axios.defaults.baseURL = 'https://api-client-portal.vozilla.pl/'


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
