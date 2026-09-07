import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    /* Список закрытый: как только localPatterns задан, всё, чего в нём нет,
       next/image отклоняет с Invalid src prop. SVG-логотипы шапки сюда не
       попадают только потому, что SVG Next не оптимизирует и отдаёт мимо.
       Добавляешь картинку в public — добавляй сюда путь */
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/illustrations/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
