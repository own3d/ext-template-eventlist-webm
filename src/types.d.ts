import { Context } from '@own3d/sdk/types'

interface NotifySubCondition {
    platform: string;
    platform_id: string;
}

interface NotifySubSubscription {
    type: string;
    version: string;
    condition: NotifySubCondition;
}

interface NotifySubNotification {
    id: string;
    created_at: string;
}

type NotifySubEventPayload =
    | {} // For event types like "stream.online", "stream.offline", "update"
    | { name: string } // For "follow"
    | { name: string; tier: string; is_gift: boolean } // For "subscribe"
    | {
    name: string;
    message: string;
    emotes: any[];
    tier: string;
    months: number;
    streak: number;
    duration: number;
} // For "re-subscribe"
    | {
    gifter: string;
    tier: string;
    amount: number;
    cumulative_amount: number;
    is_anonymous: boolean;
} // For "gift-subscribe"
    | { name: string; amount: number; message: string } // For "cheer"
    | { name: string; count: number } // For "raid"
    | {
    name: string;
    message: string;
    tier: string;
    currency: string;
    amount: string;
} // For "superchat"
    | {
    name: string;
    sticker: string;
    tier: string;
    currency: string;
    amount: string;
} // For "supersticker"
    | { name: string; url: string } // For "shoutout.create" and "shoutout.receive"
    | { level: number } // For "hype_train.begin"
    | {
    name: string;
    campaign_id: string;
    charity_name: string;
    charity_description: string;
    charity_website: string;
    charity_logo: string;
    currency: string;
    amount: string;
} // For "charity-donation"
    | { id: string } // For "custom reward" add, update, remove
    | {
    id: string;
    name: string;
    message: string;
    status: string;
    user_id: string;
    user_login: string;
    user_name: string;
    user_input: string;
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    reward_id: string;
    reward_title: string;
    reward_cost: number;
    reward_prompt: string;
}; // For "custom reward redemption" add, update

interface NotifySub {
    subscription: NotifySubSubscription;
    notification: NotifySubNotification;
    event: NotifySubEventPayload;
}

interface BorderRadius {
    multiple: boolean;
    radius: number;
    'top-left': number;
    'top-right': number;
    'bottom-left': number;
    'bottom-right': number;
}

interface FontSettings {
    'font-color': string;
    'font-family': string;
    'font-weight': number;
    'font-size': number;
    'text-align': string;
    'font-style': string;
    'letter-spacing': number;
    'line-height': number;
    'text-indent': number;
    'font-casing': string;
}

interface ExtensionContext extends Context {
    demoMode: boolean
    demo_mode: boolean
    values: {
        'background-color': string
        'event-spacing': number
        'border-width': number
        'border-color': string
        'border-radius': BorderRadius,
        'text-y-padding': string
        'text-x-padding': string
        'font-settings': FontSettings
        'max-events': number
        'twitch-events': {
            [key: string]: boolean
        }
        'youtube-events': {
            [key: string]: boolean
        }
        'own3d-events': {
            [key: string]: boolean
        },
        'display-time': {
            value: number
            toggled: boolean
        }
    }
}

interface LivingEvent extends NotifySub {
    diesIn: number
    timestamp: number
}
