import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Settings } from './globals/Settings'
import { Categories } from './collections/Categories'
import { Services } from './collections/Services'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Leads } from './collections/Leads'
import { Programs } from './collections/Programs'
import { LegalPages } from './collections/LegalPages'
import { Reviews } from './collections/Reviews'
import { ProgramsSection } from './globals/ProgramsSection'
import { ITS } from './globals/ITS'
import { Fresh } from './globals/Fresh'
import { FreshVsGrm } from './globals/FreshVsGrm'
import { GRM } from './globals/GRM'
import { Home } from './globals/Home'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  collections: [Users, Media, Categories, Services, Leads, Programs, LegalPages, Reviews],
  globals: [Settings, Home, ProgramsSection, ITS, Fresh, GRM, FreshVsGrm],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
