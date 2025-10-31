import { defineStore } from 'pinia'
import * as WebFont from 'webfontloader'


export const useFontStore = defineStore('font', () => {
    const cachedFonts: string[] = []

    const ensureFont = async (font: string) => {
        if (cachedFonts.includes(font)) {
            return
        }
        console.log('caching font', font)
        WebFont.load({
            google: {
                families: [`${font}:100,200,300,400,500,600,700,800,900`],
                api: 'https://fonts.bunny.net/css',
            },
            fontloading: (familyName: string) => {
                cachedFonts.push(familyName)
            },
        })
    }

    return {
        ensureFont,
    }
})