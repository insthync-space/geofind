<template>
  <div class="container">
    <template v-if="room">
      <h1 class="text-xl mb-5 sm:text-2xl sm:mb-3 text-center">
        <span class="text-gray-600 dark:text-gray-300"
          >{{ $t('t.room') }}: {{ room.roomId }}</span>
      </h1>
      <Panel>
        <template #title>{{ $t('lobby.players') }}</template>
        <template #content>
          <LobbyPlayers :room="room" />
          <Button
            v-if="isLeader"
            small
            @click="start"
            :loading="true"
            variant="blue"
          >
            {{ $t('lobby.startGame') }}
          </Button>
          <div v-else class="pt-5 text-center">
            <h2>{{ $t('lobby.onlyRoomLeaderCanStart') }}</h2>
          </div>
        </template>
      </Panel>

      <Share :link="shareLink" />

      <GameSettingsView
        shade="blue"
        :room="room"
        v-if="!isLeader"
      />
      <GameSettings
        shade="blue"
        v-model="settings"
        v-if="isLeader"
      /> 
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Button from '~/components/button.vue'
import { Component, Watch } from 'vue-property-decorator'
import Panel from '~/components/panel.vue'
import Share from '~/components/share.vue'
import LobbyPlayers from '~/components/lobby-players.vue'
import GameSettingsView from '~/components/game-settings-view.vue'
import GameSettings from '~/components/game-settings.vue'
import { Auth, Room } from '~/models'

@Component({
  components: {
    Share,
    Panel,
    Button,
    LobbyPlayers,
    GameSettings,
    GameSettingsView,
  },
})
export default class LobbyPage extends Vue {
  name = ''
  loading = false
  imReady = false
  editProfile = false
  settings: any = false
  timer = null

  get roomId() {
    return this.$route.params.id
  }

  get room() {
    return Room.query().where('roomId', this.roomId).first()
  }

  async mounted() {
    // Nuxt renders this thing TWICE ffs
    if (this.$nuxt.layoutName !== "default"){
      await this.$store.dispatch('room/join', this.roomId)
    }
  }

  beforeDestroy() {
    return clearInterval(this.timer)
  }

  @Watch('room', { immediate: true })
  setSettings() {
    if (!this.room) {
      return
    }

    this.settings = this.room
  }

  @Watch('room', { immediate: true })
  play() {
    if (!this.room) {
      return
    }

    if (this.room.phase === 'play') {
      this.$router.push(this.localePath('/play/' + this.room.roomId))
    }
  }

  get shareLink() {
    return window.location.href
  }

  async start() {
    await this.$store.dispatch('room/message', {
      room: this.room,
      type: 'room/start',
      data: {},
    })
  }

  async created() {}
  @Watch('settings', { deep: true, immediate: true })
  updateSettings(old, next) {
    const settingsKeys = ['hasBorders', 'hasIslands', 'hasStrictMatches', 'isPublic', 'maxPoints', 'map', 'room', 'roundTime']
    let changed : any = false;

    if (next) {
      settingsKeys.forEach((key) => {
        if (old[key] !== next[key]) {
          changed = key;
        }
      });
      if (!changed) {
        return;
      }
    }
   
      this.$store.dispatch('room/message', {
        room: this.room,
        type: 'room/settings',
        data: this.settings,
      });
  }

  get user() {
    return this.$auth.user
  }

  get gameSettings() {
    return null
  }

  get isLeader() {
    return (
      this.room &&
      this.room.player &&
      this.room.creatorId === this.room.player.sessionId
    )
  }
}
</script>
<style lang="postcss"></style>
