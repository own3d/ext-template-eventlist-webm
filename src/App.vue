<template>
  <div>
    <transition-group tag="div" :name="transitionName" v-if="context" :class="['flex overflow-hidden w-screen h-screen', {
    'flex-row justify-end': context.values['direction'] === 'horizontal' && context.values['alignment'] === 'right',
    'flex-row-reverse justify-end': context.values['direction'] === 'horizontal' && context.values['alignment'] === 'left',
    // vertical top & bottom
    'flex-col-reverse justify-end': context.values['direction'] === 'vertical' && ['top'].includes(context.values['alignment']),
    'flex-col justify-end': context.values['direction'] === 'vertical' && ['bottom'].includes(context.values['alignment']),
  }]" :style="eventListStyle">
      <div
          v-for="event in events"
          :key="event.timestamp"
      >
        <EventItem
            class="inline-block shrink-0 text-nowrap"
            :event="event"
            :context="context"
        />
      </div>
    </transition-group>
  </div>
</template>

<style>
body {
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { useAuth } from '@own3d/sdk/auth'
import { useContext } from '@own3d/sdk/context'
import { useSocket } from '@own3d/sdk/socket'
import { computed, ref, inject, onMounted } from 'vue'
import EventItem from './components/EventItem.vue'
import { ExtensionContext, LivingEvent, NotifySub } from './types'
import { cleanup, fakeNotifySubEvent, pushEventInQueue } from './support.ts'

const extension = inject('extension')

const {onAuthorized} = useAuth(extension)
const {onContext} = useContext(extension)
const {on} = useSocket(extension)

const events = ref<LivingEvent[]>([])
const eventsQueue = ref<LivingEvent[]>([])
const context = ref<ExtensionContext>(null)

const eventListStyle = computed(() => {
  const {values} = context.value as ExtensionContext
  return {
    gap: `${values['event-spacing']}px`,
    padding: `${values['border-width']}px`,
  }
})

onAuthorized(() => {
  console.log('authorized')
})

onContext((newContext: ExtensionContext, changed: string[]) => {
  if (!context.value) {
    context.value = { ...newContext } as any as ExtensionContext;
    return;
  }
  for (const key of changed) {
    context.value[key] = newContext[key];
  }
})

on('notifysub', (e: NotifySub) => {
  if (!context.value) return
  pushEventInQueue(e, events, eventsQueue, context.value)
})

onMounted(() => {
  setInterval(() => {
    if (!context.value) return
    // remove an event after it dies
    cleanup(context.value, events)

    const {demo_mode, values} = context.value

    // demo mode
    if (demo_mode) {
      const event = fakeNotifySubEvent() // todo implement for all platforms
      pushEventInQueue(event, events, eventsQueue, context.value)
    }

    // move events from queue to events
    if (eventsQueue.value.length > 0) {
      const item = eventsQueue.value.shift() as NotifySub
      events.value.push(item)
    }

    const maxEvents = values['max-events'] ?? 10
    // shift all events that are over the limit
    if (events.value.length > maxEvents) {
      for (let i = 0; i < events.value.length - maxEvents; i++) {
        events.value.shift()
      }
    }
  }, 1000)
})

const transitionName = computed(()=>{
  if (!context.value) return ''
  const { values} = context.value
  const  enableMovementAnimations = values['enable-movement-animations']
  if (enableMovementAnimations) {
    return 'items-slide'
  }
  return ''
})

</script>

<style scoped>
.items-slide-enter-active, .items-slide-leave-active,.items-slide-move {
  transition: all 0.5s ease;
}
.items-slide-enter-from, .items-slide-leave-to {
  opacity: 0;
}
</style>
