import fs from 'fs'

const ICONS = {
  report: ['1c-otchetnost', '1s-finotchetnost', '1s-izmenenie-svedeniy'],
  calculator: ['1c-sverka', '1s-ens', '1s-ausn', '1c-finkontrol'],
  signature: ['1c-podpis', '1c-etp'],
  exchange: [
    '1c-edo',
    'edo-bez-elektronnoy-podpisi-dlya-uchastnikov-1s-biznes-set',
    '1s-share',
    'modul-1c-edi',
  ],
  shield: ['1c-kontragent', '1spark-riski', '1s-status-samozanyatogo'],
  users: ['1s-kabinet-sotrudnika'],
  plane: ['smartway'],
  book: ['1s-biznes-obuchenie', '1c-nomenklatura', 'informatsionnaya-sistema-1c-its'],
  barcode: ['1s-markirovka', '1s-mdlp'],
  receipt: ['1c-ofd', '1s-cheki-ofd', '1s-skaner-chekov'],
  'cash-register': ['1s-oblachnaya-kassa', '1s-kassa-oblachnoe-prilozhenie'],
  wallet: ['yukassa', 'sistema-bystrykh-platezhey', '1s-sbp-b2b'],
  bank: ['1c-direktbank', '1s-kredit', '1s-lizing', '1s-depozit'],
  cart: ['mag1c', '1s-onlayn-zakazy', '1c-tovary'],
  globe: ['1c-umi'],
  network: ['1c-biznes-set-torgovaya-ploshchadka', 'bidzaar'],
  chart: [
    '1s-prognozirovanie-prodazh',
    '1s-universalnoe-prognozirovanie',
    'sellmonitor',
    '1c-riteyl-cheker',
  ],
  truck: ['1s-epd', '1s-kurer', '1s-dostavka', '1s-kurerika'],
  scan: ['1s-raspoznavanie-pervichnykh-dokumentov'],
  mic: ['1s-raspoznavanie-rechi', '1s-sintez-rechi'],
  cloud: ['1c-oblachnyy-arkhiv', '1c-link'],
  headset: ['1c-konnekt', 'otvechaet-auditor', 'premialnaya-podderzhka-korporativnykh-klientov'],
  video: ['1c-lektoriy'],
  gear: ['1s-administrator', '1c-store'],
  health: ['1s-egisz'],
}

const file = 'src/seed/1c_services_catalog.json'
const data = JSON.parse(fs.readFileSync(file, 'utf-8'))

const bySlug = new Map()
for (const [icon, slugs] of Object.entries(ICONS)) {
  for (const s of slugs) {
    if (bySlug.has(s)) console.warn(`Дубль в ICONS: ${s}`)
    bySlug.set(s, icon)
  }
}

const missed = []
for (const svc of data) {
  const icon = bySlug.get(svc.id)
  if (!icon) missed.push(svc.id)
  else svc.icon = icon
}

const extra = [...bySlug.keys()].filter((s) => !data.some((d) => d.id === s))

fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8')
console.log(`Проставлено: ${data.length - missed.length} из ${data.length}`)
if (missed.length) console.log('Без иконки:', missed)
if (extra.length) console.log('Лишние в ICONS:', extra)
