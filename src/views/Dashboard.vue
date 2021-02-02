<template>
  <v-container fluid>
    <v-row justify="center">
      <v-subheader>Today</v-subheader>

      <v-expansion-panels popout>
        <v-expansion-panel v-for="(post, i) in posts" :key="i" hide-actions>
          <v-expansion-panel-header>
            <v-row align="center" class="spacer" no-gutters>
              <v-avatar size="36px" class="mr-5">
                <img
                  alt="Avatar"
                  src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
                />
              </v-avatar>
              <v-col>
                <h4 class="font-weight-medium mr-5">{{ post.title }}</h4>
              </v-col>
              <v-col
                cols="6"
                class="grey--text text-truncate hidden-sm-and-down"
              >
                {{ post.description }}
              </v-col>
              <v-spacer></v-spacer>
              <v-chip class="ma-2" color="primary" text-color="white">
                <v-icon left>
                  mdi-av-timer
                </v-icon>
                {{ post.timeLimit }}
              </v-chip>
              <v-chip class="ma-2" color="green" text-color="white">
                <v-icon left>
                  mdi-cash
                </v-icon>
                {{ post.paymentRate }}/min
              </v-chip>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-card-text> {{ post.description }}</v-card-text>
            <v-divider></v-divider>
            <div class="d-flex justify-center align-center pt-5 pb-2">
              <v-btn
                rounded
                color="green"
                class="mx-auto white--text"
                @click="connect"
              >
                Connect
                <v-icon right dark>
                  mdi-wechat
                </v-icon>
              </v-btn>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
    <TaskForm />
  </v-container>
</template>
<script>
import TaskForm from "../components/TaskForm.vue";
import { v4 as uuidv4 } from "uuid";
import * as firebase from "firebase";
export default {
  components: { TaskForm },
  methods: {
    connect() {
      const chatID = uuidv4();
      this.$router.push(`/chat/${chatID}`);
    },
  },
  mounted() {
    const DB = firebase.default.firestore();
    DB.collection("tasks").onSnapshot((snapshot) => {
      const changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type == "added") {
          const data = change.doc.data();
          console.log(data.createdTasks);
          data.createdTasks.forEach((task) => {
            if (task.state == "pending") {
              const post = {
                avatar:
                  "https://avatars0.githubusercontent.com/u/9064066?v=4&s=460",
                title: task.title,
                description: task.description,
                timeLimit: task.timeLimit,
                paymentRate: task.paymentRate,
              };
              console.log(post);
              this.posts.unshift(post);
            }
          });
        }
      });
    });
  },
  data: () => ({
    posts: [],
    lorem:
      "Lorem ipsum dolor sit amet, at aliquam vivendum vel, everti delicatissimi cu eos. Dico iuvaret debitis mel an, et cum zril menandri. Eum in consul legimus accusam. Ea dico abhorreant duo, quo illum minimum incorrupte no, nostro voluptaria sea eu. Suas eligendi ius at, at nemore equidem est. Sed in error hendrerit, in consul constituam cum.",
  }),
};
</script>
