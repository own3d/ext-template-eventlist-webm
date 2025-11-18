<template>
  <div class="video-container">
    <!-- Hintergrundvideo -->
    <video ref="bgVideo" autoplay muted playsinline :src="videoSrc" type="video/webm">
  Dein Browser unterstützt kein HTML5-Video.
</video>

    <!-- Event-Container -->
    <div
      :class="[
         'animate-timeline-entry', 
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
        <div class="event-text">
          <span :style="{...titleTextStyle, ...(titleFontSize ? {fontSize: titleFontSize+'px'} : {}), display: 'inline-block', textAlign: 'center'}">
            {{titleTextContent}}
          </span>
        </div>
        <div class="event-sub-text">
          <span :style="subTextStyle">
            <span v-if="showXMark" class="opacity-50"> × </span>{{ subTitleContent }}
          </span>
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
        return `${basePath}subgift${fileExtension}.webm`;

      case 'cheer':
        return `${basePath}cheer${fileExtension}.webm`;

      case 'raid':
        return `${basePath}raid${fileExtension}.webm`;

      case 'channel.hype_train.begin':
        return `${basePath}hypetrain${fileExtension}.webm`;

      case 'channel.shoutout.receive':
        return `${basePath}shoutout${fileExtension}.webm`;

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
        return `${basePath}others${fileExtension}.webm`;

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


const eventIconTextStyle = computed(() => {
  const {values} = props.context
  return {
    gap: `${values['icon-text-spacing']}px`,
    ...textStyle(values['font-settings']),
  }
})

const titleTextContent = computed(() => {
  const event = props.event
  let name = event.event.name;
  let text = ''
  switch (event.subscription.type) {
    case 'follow':
      text = `${name}`;
      break;
    case 'subscribe':
      text = `${name}`;
      break;
    case 're-subscribe':
      text = `${name}`;
      break;
    case 'gift-subscribe':
      text = `${event.event.gifter}`;
      break;
    case 'cheer':
      text = `${name}`;
      break;
    case 'raid':
      text = `${name}`;
      break;
    case 'channel.hype_train.begin':
      text = 'Hype Train';
      break;
    case 'channel.shoutout.receive':
      text = `${name}`;
      break;
    case 'channel.channel_points_custom_reward_redemption.add':
      text = `${name}`;
      break;
    case 'charity-donation':
      text = `${name}`;
      break;
    default:
      text = '';
  }
  return text
})

const titleFontSize = computed(() => {
  if (!titleTextContent.value) return null
  if (titleTextContent.value.length > 16) {
    return 13
  } else if (titleTextContent.value.length > 10) {
    return 16
  } 
  return null
})

const EVENTS_WITH_X_MARK = [
  're-subscribe',
  'gift-subscribe',
  'cheer',
  'raid',
  'channel.channel_points_custom_reward_redemption.add',
  'charity-donation',
  'donation',
];
const showXMark = computed(() => {
  return EVENTS_WITH_X_MARK.includes(props.event.subscription.type);
}) 

const subTitleContent = computed(() => {
  const event = props.event

  let text;

  switch (event.subscription.type) {
    case 'follow':
      text = ``;
      break;
    case 'subscribe':
      text = ``;
      break;
    case 're-subscribe':
      const amount = event.event.months ?? 1;
      text = `${amount}`;
      break;
    case 'gift-subscribe':
      text = `${event.event.amount}`;
      break;
    case 'cheer':
      text = `${event.event.amount}`;
      break;
    case 'raid':
      text = `${event.event.count}`;
      break;
    case 'channel.hype_train.begin':
      text = '';
      break;
    case 'channel.shoutout.receive':
      text = ``;
      break;
    case 'channel.channel_points_custom_reward_redemption.add':
      text = `${event.event.reward_cost}`;
      break;
    case 'charity-donation':
      text = `${event.event.amount} ${event.event.currency}`;
      break;
    case 'donation':
      text = `${event.event.amount} ${event.event.currency}`;
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

const titleTextStyle = computed(() => {
  /*
   const radius =  this.numberFontGlowIntensity ? this.numberFontGlowIntensity/100 : 0.8;
        return `color: ${this.numberFontColor}; font-family: &quot;${this.numberFontFamily}&quot;; font-weight: ${this.numberFontWeight}; font-size: ${this.numberFontSize}px; text-align: ${this.numberFontTextAlign}; font-style: normal; line-height: 2.1; text-indent: 0px; letter-spacing: 0px; text-transform: ${this.numberFontTextTransform}; text-shadow: ${this.numberFontGlowColor} 0px 0px ${radius}rem;`
    
   */
  const {values} = props.context
  const fontSettings = values['title-font-settings']
  const glowColor = '#000000'
  const glowIntensity =  0.8
  const radiusValue = glowIntensity ? glowIntensity / 100 : 0.8
  return {
    ...textStyle(fontSettings),
    textShadow: `${glowColor} 0px 0px ${radiusValue}rem`,
  }
})
const subTextStyle = computed(() => {
  /*
   const radius =  this.numberFontGlowIntensity ? this.numberFontGlowIntensity/100 : 0.8;
        return `color: ${this.numberFontColor}; font-family: &quot;${this.numberFontFamily}&quot;; font-weight: ${this.numberFontWeight}; font-size: ${this.numberFontSize}px; text-align: ${this.numberFontTextAlign}; font-style: normal; line-height: 2.1; text-indent: 0px; letter-spacing: 0px; text-transform: ${this.numberFontTextTransform}; text-shadow: ${this.numberFontGlowColor} 0px 0px ${radius}rem;`
    
   */
  const {values} = props.context
  const fontSettings = values['subtitle-font-settings']
  const glowColor =  '#000000'
  const glowIntensity =  0.8
  const radiusValue = glowIntensity ? glowIntensity / 100 : 0.8
  return {
    ...textStyle(fontSettings),
    textShadow: `${glowColor} 0px 0px ${radiusValue}rem`,
  }
})

const eventIconStyle = computed(() => {
      const {values} = props.context
      const size = values['event-icon-size'] || 40
      const color = values['event-icon-color'] || '#cdbf92'
      return {
        fontSize: `${size}px`,
        color: color,
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
        'donation': 'event-type-donation fa-hand-holding-dollar',
        'channel-points_custom_reward_redemption.add': 'event-type-channel-points fa-coin',
        'superchat': 'event-type-superchat fa-dollar-sign',
        'supersticker': 'event-type-supersticker fa-sticky-note',
      };
      return typeMap[props.event.subscription.type] || '';
    })

</script>