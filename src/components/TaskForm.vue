<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          fab
          fixed
          right
          bottom
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-post-outline</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="primary">
          <h1 style="color:white" class="headline" text-color="white">
            Post Task
          </h1>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Task Title*"
                  v-model="title"
                  required
                ></v-text-field>
              </v-col>
              <v-col>
                <v-textarea
                  label="Task Description"
                  v-model="description"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="durations"
                  label="For how Long is it open*"
                  v-model="timeLimit"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Payment Rate per min*"
                  required
                  type="number"
                  v-model="rate"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" class="red" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="white" @click="createTask" class="green" text>
            Post
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapGetters } from "vuex";
import * as firebase from "firebase";

export default {
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    createTask() {
      const DB = firebase.default.firestore();
      DB.collection("tasks").add({
        userName: this.user.userName.replace("@gmail.com", ""),
        createdTasks: [
          {
            id: uuidv4(),
            title: this.title,
            description: this.description,
            paymentRate: this.paymentRate,
            timeLimit: this.timeLimit,
            creationTime: Date.now(),
          },
        ],
      });
      this.dialog = false;
    },
  },
  data: () => ({
    dialog: false,
    durations: ["5 min", "10 min", "20 min", "30 min", "1hr"],
    title: "",
    timeLimit: "",
    rate: "",
    description: "",
  }),
  mounted() {},
};
</script>
