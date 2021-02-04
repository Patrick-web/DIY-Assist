<template>
  <v-container fluid>
    <v-row justify="center">
      <v-snackbar v-model="snackbar">
        {{ notification }}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            close
          </v-btn>
        </template>
      </v-snackbar>
      <v-dialog v-model="connectRequestExists" persistent max-width="290">
        <v-card v-if="connectRequest" class="mt-5 mb-5">
          <v-card-title class="headline">
            Waiting for {{ connectRequest.taskOwner }} to approve request
          </v-card-title>

          <v-card-subtitle>
            <p>Task : {{ connectRequest.task }}</p>
          </v-card-subtitle>

          <v-card-actions>
            <v-btn class="red" block color="white" @click="deleteRequest" text>
              Cancel Request
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-row justify="center">
        <v-dialog
          v-model="receivedConnectionRequest"
          persistent
          max-width="290"
        >
          <v-card>
            <v-card-title class="headline">
              Received Connection Request from X
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">
                Accept
              </v-btn>
              <v-btn color="red darken-1" text @click="dialog = false">
                Decline
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
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
                <h4 class="font-weight-medium mr-2">{{ post.owner }}</h4>
              </v-col>
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
                {{ post.paymentRate }} Ksh/min
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
                @click="connect(post)"
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
import * as firebase from "firebase";
import { mapGetters } from "vuex";
import { v4 as uuidv4 } from "uuid";

export default {
  computed: {
    ...mapGetters(["user"]),
  },
  components: { TaskForm },
  methods: {
    connect(post) {
      console.log("ob " + post);
      if (!this.connectRequest) {
        this.connectRequestExists = true;
        this.connectRequest = {
          connectionID: uuidv4(),
          task: post.title,
          requestSource: this.user.username,
          taskOwner: post.owner,
          connectionID: post.connectionID,
          approved: "false",
        };
        this.notify("Connect request sent");
        window.DB.collection("connectionRequests")
          .doc(this.connectRequest.connectionID)
          .set(this.connectRequest);
      } else {
        this.notify("Please Clear your current request");
      }
      // this.$router.push(`/chat/${connectionID}`);
      // window.DB.collection("AllTasks")
      //   .doc(taskID)
      //   .update({
      //     state: "ongoing",
      //   })
      //   .then(function() {
      //     console.log("Task updated");
      //   });
    },
    deleteRequest() {
      this.connectRequestExists = false;
      window.DB.collection("connectionRequests")
        .doc(this.connectRequest.connectionID)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          this.connectRequest = null;
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
    },
    notify(msg) {
      this.snackbar = true;
      this.notification = msg;
    },
  },
  mounted() {
    const DB = firebase.default.firestore();
    DB.collection("AllTasks").onSnapshot((snapshot) => {
      const changes = snapshot.docChanges();
      changes.forEach((change) => {
        if (change.type == "added") {
          const task = change.doc.data();
          if (task.state == "pending") {
            const post = {
              title: task.title,
              description: task.description,
              timeLimit: task.timeLimit,
              paymentRate: task.paymentRate,
              connectionID: task.ownerID + "-" + task.creationTime,
              taskID: change.doc.id,
              owner: task.owner,
            };
            if (post.owner == this.user.username) {
              this.postedTask = post;
              console.log("This task was posted by the current user");
            } else {
              this.posts.unshift(post);
            }
          }
        }
      });
    });
    // DB.collection("connectionRequests").onSnapshot((snapshot) => {
    //   const changes = snapshot.docChanges();
    //   console.log(changes);
    //   changes.forEach((change) => {
    //     const request = change.doc.data();
    //     if (
    //       request.connectionID == this.connectRequest.connectionID &&
    //       request.approved == "true"
    //     ) {
    //       this.notify("Connection Approved. Connecting....");
    //       this.deleteRequest();
    //       setTimeout(() => {
    //         this.$router.push(`/chat/${request.connectionID}`);
    //       }, 1000);
    //     } else if (
    //       request.connectionID == this.connectRequest.connectionID &&
    //       request.approved == "denied"
    //     ) {
    //       this.notify("Connect Request Denied");
    //       this.deleteRequest();
    //     }
    //   });
    // });
  },
  data: () => ({
    posts: [],
    postedTask: null,
    connectRequestExists: false,
    connectRequest: null,
    connectRequestsFromFB: [],
    notification: "",
    snackbar: false,
    receivedConnectionRequest: false,
  }),
};
</script>
