/*
 * This file is part of the KryPtoN Bot WA distribution (https://github.com/Kry9toN/KryPtoN-WhatsApp-Bot).
 * Copyright (c) 2021 Dhimas Bagus Prayoga.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { databaseView, databaseInput } from '../utils/db'

module.exports = {
    name: 'notes',
    cooldown: 15,
    description: 'Untuk menyimpan note atau catatan di group\nPenggunaan: !notes <save/remove> <key> <value>',
    async execute (client: any, chat: any, pesan: any, args: any) {
        if (!client.isGroup) return client.reply(pesan.error.group)
        if (!client.isGmium) return client.reply(pesan.hanya.premium)
        if (!client.isGroupAdmins) return client.reply(pesan.hanya.admin)
        if (!client.isBotGroupAdmins) return client.reply(pesan.hanya.botAdmin)
        const arg = client.body.slice(7)
        if (args == 0) {
            await databaseView('SELECT * FROM notes')
                .then((hasil: any) => {
                    let text = 'Daftar *notes* di group ini\n\n'
                    if (hasil.length > 0) {
                        for (const list of hasil) {
                            if (list.gid == client.groupId) {
                                text += `- *${list.key}*`
                            }
                        }
                        client.reply(text)
                    } else {
                        text += '_Belum ada notes_'
                        client.reply(text)
                    }
                })
        } else if (arg.split('|')[0].trim() == 'save') {
            const key = arg.split('|')[1]
            const res = arg.split('|')[2]
            databaseInput(`INSERT INTO notes(gid, key, res) VALUES ('${client.groupId}', '#${key}', '${res}')`)
                .then(() => client.reply('Berhasil menambahkan notes'))
        } else if (arg.split('|')[0].trim() == 'remove') {
            const key = arg.split('|')[1].trim()
            databaseInput(`DELETE FROM notes WHERE key = ${key} AND gid = ${client.groupId}`)
                .then(() => client.reply(`Berhasil menghapus notes #${key}`))
        }
    }
}
