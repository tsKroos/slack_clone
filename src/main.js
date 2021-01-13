import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import './assets/css/tailwind.css'

Vue.config.productionTip = false

//<script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js"></script>


  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA9ePc5WHBgv2Dc2krkXV6UG7wzmqFC6RU",
    authDomain: "vue-slack-clone-5e820.firebaseapp.com",
    databaseURL: "https://vue-slack-clone-5e820-default-rtdb.firebaseio.com",
    projectId: "vue-slack-clone-5e820",
    storageBucket: "vue-slack-clone-5e820.appspot.com",
    messagingSenderId: "982357525670",
    appId: "1:982357525670:web:755c2909c0b8a87100e067"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  window.firebase = firebase;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
