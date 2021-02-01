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
                <v-text-field label="Task Title*" required></v-text-field>
              </v-col>
              <v-col>
                <v-textarea label="Task Description"></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-select
                  :items="durations"
                  label="For how Long is it open*"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Payment Rate per min*"
                  required
                  type="number"
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
          <v-btn color="white" class="green" text @click="dialog = false">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    durations: ["5 min", "10 min", "20 min", "30 min", "1hr"],
  }),
};
</script>
