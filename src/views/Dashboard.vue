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
                {{ post.excerpt }}
              </v-col>
              <v-spacer></v-spacer>
              <v-chip class="ma-2" color="primary" text-color="white">
                <v-icon left>
                  mdi-av-timer
                </v-icon>
                10min
              </v-chip>
              <v-chip class="ma-2" color="green" text-color="white">
                <v-icon left>
                  mdi-cash
                </v-icon>
                10 Ksh/min
              </v-chip>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-divider></v-divider>
            <v-card-text v-text="lorem"></v-card-text>
            <v-divider></v-divider>
            <div class="d-flex justify-center align-center pt-5 pb-2">
              <v-btn
                rounded
                color="green"
                class="mx-auto white--text"
                @click="loader = 'loading3'"
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
export default {
  components: { TaskForm },
  data: () => ({
    posts: [
      {
        avatar: "https://avatars0.githubusercontent.com/u/9064066?v=4&s=460",
        name: "John Leider",
        title: "Welcome to Vuetify!",
        excerpt:
          "Thank you for joining our community Lorem ipsum dolor sit amet, at aliquam vivendum v...",
      },
      {
        color: "red",
        icon: "mdi-account-multiple",
        name: "Social",
        new: 1,
        total: 3,
        title: "Twitter",
        excerpt:
          "Thank you for joining our community Lorem ipsum dolor sit amet, at aliquam vivendum v...",
      },
      {
        color: "teal",
        icon: "mdi-tag",
        name: "Promos",
        new: 2,
        total: 4,
        title: "Shop your way",
        excerpt: "Thank  amet, at aliquam vivendum v...",
      },
    ],
    lorem:
      "Lorem ipsum dolor sit amet, at aliquam vivendum vel, everti delicatissimi cu eos. Dico iuvaret debitis mel an, et cum zril menandri. Eum in consul legimus accusam. Ea dico abhorreant duo, quo illum minimum incorrupte no, nostro voluptaria sea eu. Suas eligendi ius at, at nemore equidem est. Sed in error hendrerit, in consul constituam cum.",
  }),
};
</script>
