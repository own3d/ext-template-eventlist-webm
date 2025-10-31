<template>
  <div class="video-container">
    <!-- Hintergrundvideo -->
    <video ref="bgVideo" autoplay muted playsinline :src="videoSrc" type="video/webm">
  Dein Browser unterstützt kein HTML5-Video.
</video>

    <!-- Event-Container -->
    <div
      ref="eventItem"
      :class="[
        'flex',
        {
          'justify-end': ['top-right', 'bottom-right'].includes(context.values['alignment']),
          'justify-start': ['top-left', 'bottom-left'].includes(context.values['alignment']),
        }
      ]"
    >
      <div class="event-content">
        <div class="event-icon">
          <i
            :class="[ 'fas fa-fw', eventTypeClass]"
            :style="eventIconStyle"
          />
        </div>
        <div class="event-text" :style="eventIconTextStyle">
          <span v-html="mainEventText" />
        </div>
        <div class="event-sub-text" :style="eventIconTextStyle">
          <span :style="subTextStyle" v-html="subEventText" />
        </div>
      </div>
    </div>
  </div>
</template>




<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { radius } from '@own3d/sdk/support'
import { Context, NotifySub } from '@own3d/sdk/types'
import { FontSettings } from '../types'
import { useFontStore } from '../font.ts'

const props = defineProps<{
  event: NotifySub
  context: Context
}>()

const {ensureFont} = useFontStore()

const eventItem = ref<HTMLElement | null>(null)

onMounted(() => {
  const {clientHeight, clientWidth} = eventItem.value
  const {direction, alignment} = props.context.values
  

  if (direction === 'horizontal' && alignment === 'left') {
    gsap.fromTo(eventItem.value, {
      scale: 0.5, opacity: 0, rotationX: -30
    }, {
      scale: 1, opacity: 1, duration: 1, rotationX: 0, ease: "power2.out"
    })
  } else if (direction === 'horizontal' && alignment === 'right') {
    gsap.fromTo(eventItem.value, {
      scale: 0.5, opacity: 0, rotationX: -30
    }, {
      scale: 1, opacity: 1, duration: 1, rotationX: 0, ease: "power2.out" 
    })
  } else if (direction === 'vertical' && alignment === 'top') {
    gsap.fromTo(eventItem.value, {
      scale: 0.5, opacity: 0, rotationX: -30
    }, {
      scale: 1, opacity: 1, duration: 1, rotationX: 0, ease: "power2.out"
    })
  } else if (direction === 'vertical' && alignment === 'bottom') {
    gsap.fromTo(eventItem.value, {
      scale: 0.5, opacity: 0, rotationX: -30
    }, {
      scale: 1, opacity: 1, duration: 1, rotationX: 0, ease: "power2.out"
    })
  }
})

const bgVideo = ref<HTMLVideoElement | null>(null);

const videoSrc = computed(() => {
  const eventType = props.event.subscription.type;
  const basePath = `${import.meta.env.BASE_URL}video/`;
  const useAnimation = props.context.values['event-animation']; // Prüft, ob die Animation aktiv ist
  const fileExtension = useAnimation ? '' : '_noanimation'; // Wählt entweder .webm oder .png

  const eventColor = props.context.values['event-colors'][0] || 'default'; // Fallback-Wert falls nicht gesetzt

  const isMultiple = eventColor === 'default'; // Speichere die Prüfbedingung in einer Variablen


  if (isMultiple) {
    switch (eventType) {
      case 'follow':
        return `${basePath}follow${fileExtension}.webm`;

      case 'subscribe':
        return `${basePath}subscribe${fileExtension}.webm`;

      case 're-subscribe':
        return `${basePath}subscribe${fileExtension}.webm`;

      case 'gift-subscribe':
        return `${basePath}sub-gift${fileExtension}.webm`;

      case 'cheer':
        return `${basePath}cheer${fileExtension}.webm`;

      case 'raid':
        return `${basePath}raid${fileExtension}.webm`;

      case 'channel.hype_train.begin':
        return `${basePath}hype-train${fileExtension}.webm`;

      case 'channel.shoutout.receive':
        return `${basePath}shout-out${fileExtension}.webm`;

      case 'charity-donation':
        return `${basePath}charity-donation${fileExtension}.webm`;

      case 'donation':
        return `${basePath}donation${fileExtension}.webm`;

      case 'channel.channel_points_custom_reward_redemption.add':
        return `${basePath}channel-points${fileExtension}.webm`;

      case 'superchat':
        return `${basePath}superchat${fileExtension}.webm`;

      case 'supersticker':
        return `${basePath}supersticker${fileExtension}.webm`;

      default:
        return `${basePath}default${fileExtension}.webm`;

    }
  } else {
    return `${basePath}default${fileExtension}.webm`;
  }
});

// Video neu laden, falls sich die Quelle ändert
watch(videoSrc, () => {
  if (bgVideo.value) {
    bgVideo.value.load();
    bgVideo.value.play().catch((e) => console.error("Autoplay verhindert:", e));
  }
});

onMounted(() => {
  if (bgVideo.value) {
    bgVideo.value.play().catch((e) => console.error("Autoplay verhindert:", e));
  }
});

const eventColor = props.context.values['event-colors'][0] || 'default'; // Fallback-Wert falls nicht gesetzt

const eventIconTextStyle = computed(() => {
  const {values} = props.context
  return {
    gap: `${values['icon-text-spacing']}px`,
    ...textStyle(values['font-settings']),
  }
})

const mainEventText = computed(() => {
  const event = props.event

  let name = event.event.name;
  let scaledName = name.length > 16
      ? `<div style="font-size:13px; display:inline-block; text-align:center;">${name}</div>`
      : name.length > 10
          ? `<div style="font-size:16px; display:inline-block; text-align:center;">${name}</div>`
          : name;

  let text = '';

  switch (event.subscription.type) {
    case 'follow':
      text = `${scaledName}`;
      break;
    case 'subscribe':
      text = `${scaledName}`;
      break;
    case 're-subscribe':
      text = `${scaledName}`;
      break;
    case 'gift-subscribe':
      text = `${event.event.gifter}`;
      break;
    case 'cheer':
      text = `${scaledName}`;
      break;
    case 'raid':
      text = `${scaledName}`;
      break;
    case 'channel.hype_train.begin':
      text = 'Hype Train';
      break;
    case 'channel.shoutout.receive':
      text = `${scaledName}`;
      break;
    case 'channel.channel_points_custom_reward_redemption.add':
      text = `${scaledName}`;
      break;
    case 'charity-donation':
      text = `${scaledName}`;
      break;
    default:
      text = '';
  }

  return text;
})

const subEventText = computed(() => {
  const event = props.event
  
  let text = '';

  switch (event.subscription.type) {
    case 'follow':
      text = ``;
      break;
    case 'subscribe':
      text = ``;
      break;
    case 're-subscribe':
      const amount = event.event.months ?? 1;
      text = `<div><span class="opacity-50"> × </span>${amount}</div>`;
      break;
    case 'gift-subscribe':
      text = `<div><span class="opacity-50"> × </span>${event.event.amount}</div>`;
      break;
    case 'cheer':
      text = `<div><span class="opacity-50"> × </span>${event.event.amount}</div>`;
      break;
    case 'raid':
      text = `<div><span class="opacity-50"> × </span>${event.event.count}</div>`;
      break;
    case 'channel.hype_train.begin':
      text = '';
      break;
    case 'channel.shoutout.receive':
      text = ``;
      break;
    case 'channel.channel_points_custom_reward_redemption.add':
      text = `<div><span class="opacity-50"> × </span>${event.event.reward_cost}</div>`;
      break;
    case 'charity-donation':
      text = `<div><span class="opacity-50"> × </span>${event.event.amount} ${event.event.currency}</div>`;
      break;
    default:
      text = '';
  }

  return text;
})


const textStyle = (
    fontSettings: FontSettings | undefined | null,
    transformer: { [key: string]: (x: any) => any } = {},
) => {
  const modifiers = {
    color: {default: '#cdbf92', suffix: null, id: 'font-color'},
    fontFamily: {default: 'Arvo', suffix: null, id: 'font-family'},
    fontWeight: {default: 400, suffix: null, id: 'font-weight'},
    fontSize: {default: 22, suffix: 'px', id: 'font-size'},
    textAlign: {default: 'center', suffix: null, id: 'text-align'},
    fontStyle: {default: 'normal', suffix: null, id: 'font-style'},
    letterSpacing: {default: 0, suffix: 'px', id: 'letter-spacing'},
    lineHeight: {default: 1.2, suffix: null, id: 'line-height'},
    textIndent: {default: 0, suffix: 'px', id: 'text-indent'},
    textTransform: {default: 'none', suffix: null, id: 'font-casing'},
  } as any

  const style: { [key: string]: any } = {}
  

  // check if modifier exists in values and if not set default value
  Object.keys(modifiers).forEach((modifierKey) => {
    const modifier = modifiers[modifierKey]
    let value = fontSettings?.[modifier.id]

    if (modifierKey === 'fontFamily') {
      ensureFont(value)
    }

    if (transformer[modifier.id]) {
      value = transformer[modifier.id](value)
    }

    if (modifier.suffix) {
      style[modifierKey] = value ? value + modifier.suffix : modifier.default + modifier.suffix
    } else {
      style[modifierKey] = value ? value : modifier.default
    }
  })

  return style
}

const subTextStyle = computed(() => {
  /*
   const radius =  this.numberFontGlowIntensity ? this.numberFontGlowIntensity/100 : 0.8;
        return `color: ${this.numberFontColor}; font-family: &quot;${this.numberFontFamily}&quot;; font-weight: ${this.numberFontWeight}; font-size: ${this.numberFontSize}px; text-align: ${this.numberFontTextAlign}; font-style: normal; line-height: 2.1; text-indent: 0px; letter-spacing: 0px; text-transform: ${this.numberFontTextTransform}; text-shadow: ${this.numberFontGlowColor} 0px 0px ${radius}rem;`
    
   */
  const {values} = props.context
  const fontSettings = values['font-settings']
  const glowColor = values['subtext-font-glow-color'] || '#000000'
  const glowIntensity = values['subtext-font-glow-intensity'] || 0.8
  const radiusValue = glowIntensity ? glowIntensity / 100 : 0.8
  return {
    ...textStyle(fontSettings),
    textShadow: `${glowColor} 0px 0px ${radiusValue}rem`,
  }
})

    const eventTypeClass = computed(() => {
      const typeMap = {
        'follow': 'event-type-follow fa-heart',
        'subscribe': 'event-type-subscribe fa-star',
        're-subscribe': 'event-type-subscribe fa-star',
        'gift-subscribe': 'event-type-subgift fa-gift',
        'cheer': 'event-type-cheer fa-gem',
        'raid': 'event-type-raid fa-user-group-simple',
        'channel.hype_train.begin': 'event-type-hype-train fa-train',
        'channel.shoutout.receive': 'event-type-shoutout fa-megaphone',
        'charity-donation': 'event-type-charity-donation fa-hand-holding-heart',
        'donation': 'event-type-donation fa-hand-holding-money',
        'channel-points_custom_reward_redemption.add': 'event-type-channel-points fa-coin',
        'superchat': 'event-type-superchat fa-dollar-sign',
        'supersticker': 'event-type-supersticker fa-sticky-note',
      };
      return typeMap[props.event.subscription.type] || '';
    })

</script>