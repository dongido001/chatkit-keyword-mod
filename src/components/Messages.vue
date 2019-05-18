<template>
  <div ref="messages" class="messages">
    <div v-for="message in messages" :key="message.id">
      <div
        :class="[
          'message-container message',
          messageDirection(message, 'float-')
        ]"
      >
        <div class="chat-name">{{ message.sender.name }}</div>
        <template v-for="part in message.parts">
          {{ part.payload.content }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "messages",
  props: ["messages", "currentUser"],
  methods: {
    messageDirection(message, css = "") {
      return message.senderId !== this.currentUser.id
        ? `${css}left`
        : `${css}right`;
    }
  },
  updated() {
    this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
  }
};
</script>
