import { ExtensionContext, LivingEvent, NotifySub } from './types'
import { Ref } from 'vue'

const supportedEvents = [
    'follow',
    'subscribe',
    're-subscribe',
    'gift-subscribe',
    'cheer',
    'raid',
    'channel.hype_train.begin',
    'channel.shoutout.receive',
    'channel.channel_points_custom_reward_redemption.add',
    'charity-donation',
    'superchat' +
    'supersticker',
    'donation',
]

export const cleanup = (context: ExtensionContext, events: Ref<LivingEvent>) => {
    const {toggled} = context.values['display-time'] ?? {toggled: false}
    events.value = events.value.filter((event: LivingEvent) => {
        if (!toggled) {
            return true
        }
        event.diesIn -= 1
        return event.diesIn > 0
    })
}

export const pushEventInQueue = (
    event: NotifySub,
    events: Ref<LivingEvent>,
    eventsQueue: Ref<LivingEvent>,
    context: ExtensionContext,
) => {
    if (!supportedEvents.includes(event.subscription.type)) {
        console.log('unsupported event', {event})
        return
    }
    const {platform} = event.subscription.condition
    const enabledEvents = context.values[`${platform}-events`]
    if (enabledEvents[event.subscription.type] === false || enabledEvents[event.subscription.type] === undefined) {
        return
    }
    const {value, toggled} = context.values['display-time']
    const diesIn = toggled ? value : 0
    eventsQueue.value.push({
        timestamp: +new Date(),
        ...event,
        diesIn,
    })
}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const fakeNotifySubEvent = (): NotifySub => {
    const randomEvent = supportedEvents[Math.floor(Math.random() * supportedEvents.length)]

    return {
        subscription: {
            type: randomEvent,
            version: '1',
            condition: {
                'platform': 'twitch',
                'platform_id': '106415581',
            },
        },
        notification: {
            id: null,
            environment: 'testing',
            created_at: new Date().toISOString(),
        },
        route: {
            only: [
                'alerts',
            ],
        },
        replay_attributes: [],
        trace_id: null,
        template: null,
        event: {
            id: uuidv4(),
            name: 'Someone',
            gifter: 'Someone',
            months: random(1, 12),
            amount: random(1, 12),
            count: random(1, 12),
            reward_cost: random(1, 12),
            currency: 'USD',
        },
    }
}