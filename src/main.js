import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import * as firebase from "firebase";
import router from "./router";
import { store } from "./store";
import AlertComponent from "./components/Shared/Alert.vue";

Vue.config.productionTip = false;
Vue.component("app-alert", AlertComponent);

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
  created() {
    firebase.default.initializeApp({
      apiKey: "AIzaSyBnJyiCG4_PfrC1Mt58wzMa8FNY4IpTMNo",
      authDomain: "diy-assist.firebaseapp.com",
      projectId: "diy-assist",
      storageBucket: "diy-assist.appspot.com",
      messagingSenderId: "649526131720",
      appId: "1:649526131720:web:3a5887860aa7e04514e5bd",
      measurementId: "G-VGBVDDVD5D",
      databaseURL: "https://diy-assist-default-rtdb.firebaseio.com/",
    });
    const DB = firebase.default.firestore();
    DB.settings({ timestampsInSnapshots: true });
    window.DB = DB;
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  },
}).$mount("#app");
