<template>
  <div class="room-wrapper">
    <div class="search">
      <input type="text" placeholder="search..." class="input-search" />
    </div>
    <div class="rooms">
      <div
        class="room"
        v-for="(room, ind) in rooms"
        :key="ind"
        @click="joinRoom(room)"
        :class="activeRoom.id === room.id ? 'active_room' : ''"
      >
        {{ room.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "rooms",
  props: ["rooms"],
  data() {
    return {
      activeRoom: {}
    };
  },
  methods: {
    joinRoom(room) {
      this.activeRoom = room;
      this.$emit("joinRoom", room);
    }
  }
};
</script>

<style scoped>
.active_room {
  background: rgba(197, 202, 207, 0.952);
}
</style>
