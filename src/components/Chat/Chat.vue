<template>
  <v-container fluid style="padding: 0;">
    <v-row no-gutters>
      <v-col sm="2" class="scrollable">
        <chats></chats>
      </v-col>
      <v-col sm="10" style="position: relative;">
        <div class="chat-container" v-on:scroll="onScroll" ref="chatContainer">
          <message :messages="messages" @imageLoad="scrollToEnd"></message>
        </div>
        <div class="typer">
          <input
            type="text"
            placeholder="Type here..."
            v-on:keyup.enter="sendMessage"
            v-model="content"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Message from "./parts/Message.vue";
import Chats from "./parts/Chats.vue";
import * as firebase from "firebase";

export default {
  data() {
    return {
      content: "",
      chatMessages: [],
      currentRef: {},
      loading: false,
      totalChatHeight: 0,
    };
  },
  props: ["id"],
  mounted() {
    this.loadChat();
    this.$store.dispatch("loadOnlineUsers");
  },
  components: {
    message: Message,
    chats: Chats,
  },
  computed: {
    messages() {
      return this.chatMessages;
    },
    username() {
      return this.$store.getters.user.username;
    },
    onNewMessageAdded() {
      const that = this;
      let onNewMessageAdded = function(snapshot, newMessage = true) {
        let message = snapshot.val();
        message.key = snapshot.key;
        /*eslint-disable */
        var urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
        /*eslint-enable */
        message.content = message.content
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
        message.content = message.content.replace(
          urlPattern,
          "<a href='$1'>$1</a>"
        );
        if (!newMessage) {
          that.chatMessages.unshift(that.processMessage(message));
          that.scrollTo();
        } else {
          that.chatMessages.push(that.processMessage(message));
          that.scrollToEnd();
        }
      };
      return onNewMessageAdded;
    },
  },
  watch: {
    "$route.params.id"(newId, oldId) {
      this.currentRef.off("child_added", this.onNewMessageAdded);
      this.loadChat();
    },
  },
  methods: {
    loadChat() {
      this.totalChatHeight = this.$refs.chatContainer.scrollHeight;
      this.loading = false;
      if (this.id !== undefined) {
        this.chatMessages = [];
        let chatID = this.id;
        this.currentRef = firebase.default
          .database()
          .ref("messages")
          .child(chatID)
          .child("messages")
          .limitToLast(20);
        this.currentRef.on("child_added", this.onNewMessageAdded);
      }
    },
    onScroll() {
      let scrollValue = this.$refs.chatContainer.scrollTop;
      const that = this;
      if (scrollValue < 100 && !this.loading) {
        this.totalChatHeight = this.$refs.chatContainer.scrollHeight;
        this.loading = true;
        let chatID = this.id;
        let currentTopMessage = this.chatMessages[0];
        if (currentTopMessage === undefined) {
          this.loading = false;
          return;
        }
        firebase.default
          .database()
          .ref("messages")
          .child(chatID)
          .child("messages")
          .orderByKey()
          .endAt(currentTopMessage.key)
          .limitToLast(20)
          .once("value")
          .then(function(snapshot) {
            let tempArray = [];
            snapshot.forEach(function(item) {
              tempArray.push(item);
            });
            if (tempArray[0].key === tempArray[1].key) return;
            tempArray.reverse();
            tempArray.forEach(function(child) {
              that.onNewMessageAdded(child, false);
            });
            that.loading = false;
          });
      }
    },
    processMessage(message) {
      /*eslint-disable */
      var imageRegex = /([^\s\']+).(?:jpg|jpeg|gif|png)/i;
      /*eslint-enable */
      if (imageRegex.test(message.content)) {
        message.image = imageRegex.exec(message.content)[0];
      }

      return message;
    },
    sendMessage() {
      if (this.content !== "") {
        this.$store.dispatch("sendMessage", {
          username: this.username,
          content: this.content,
          date: new Date().toString(),
          chatID: this.id,
        });
        this.content = "";
      }
    },
    scrollToEnd() {
      this.$nextTick(() => {
        var container = this.$el.querySelector(".chat-container");
        container.scrollTop = container.scrollHeight;
      });
    },
    scrollTo() {
      this.$nextTick(() => {
        let currentHeight = this.$refs.chatContainer.scrollHeight;
        let difference = currentHeight - this.totalChatHeight;
        var container = this.$el.querySelector(".chat-container");
        container.scrollTop = difference;
      });
    },
  },
};
</script>

<style>
.scrollable {
  overflow-y: auto;
  height: 90vh;
}
.typer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.9rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.2);
}
.typer input[type="text"] {
  position: absolute;
  left: 2.5rem;
  padding: 1rem;
  width: 80%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.25rem;
}
.chat-container {
  box-sizing: border-box;
  height: calc(100vh - 9.5rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
}
.message {
  margin-bottom: 3px;
}
.message.own {
  text-align: right;
}
.message.own .content {
  background-color: lightskyblue;
}
.chat-container .username {
  font-size: 18px;
  font-weight: bold;
}
.chat-container .content {
  padding: 8px;
  background-color: lightgreen;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12);
  max-width: 50%;
  word-wrap: break-word;
}
@media (max-width: 480px) {
  .chat-container .content {
    max-width: 60%;
  }
}
</style>
