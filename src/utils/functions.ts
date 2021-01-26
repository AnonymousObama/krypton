export {}
let Spin = require('spinnies')
const moment = require('moment-timezone')
const axios = require('axios')

const spinner = {
    interval: 120,
    frames: [
        '🕐',
        '🕑',
        '🕒',
        '🕓',
        '🕔',
        '🕕',
        '🕖',
        '🕗',
        '🕘',
        '🕙',
        '🕚',
        '🕛'
    ]
}

let globalSpinner: string

const getGlobalSpinner = (disableSpins = false) => {
    if (!globalSpinner) globalSpinner = new Spin({ color: 'blue', succeedColor: 'green', spinner, disableSpins })
    return globalSpinner
}

Spin = getGlobalSpinner(false)

const start = (id: number, text: string) => {
    Spin.add(id, { text: text })
}

const success = (id: number, text: string) => {
    Spin.succeed(id, { text: text })
}

/**
 * Get Time duration
 * @param  {Date} timestamp
 * @param  {Date} now
 */
const processTime = (timestamp: number, now: number) => {
    // timestamp => timestamp when message was received
    return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

const getGroupAdmins = (participants: Array<any>) => {
    const admins = []
    for (const i of participants) {
        i.isAdmin ? admins.push(i.jid) : ''
    }
    return admins
}

const getBuffer = async (url: string, options: Array<any>) => {
    try {
        options || {}
        const res = await axios({
            method: 'get',
            url,
            headers: {
                DNT: 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (e) {
        console.log(`Error : ${e}`)
    }
}

const getRandom = (ext: string) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

module.exports = {
    start,
    success,
    processTime,
    getGroupAdmins,
    getBuffer,
    getRandom
}
