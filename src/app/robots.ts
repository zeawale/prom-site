import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

/**
 * /robots.txt — с нуля, из старого сайта не переносится ничего: там
 * Sitemap указывал на чужой домен, а закрытые пути (/links.php, /nk9)
 * в WordPress по умолчанию не встречаются — след либо копипасты, либо
 * SEO-инъекции.
 *
 * Закрыты только админка и API Payload: индексировать там нечего. Одно
 * исключение — /api/media, оттуда отдаются картинки со страниц (фото
 * директора, отзывы); закрыть их — значит отдать роботу страницу без
 * картинок. Юридические страницы и /services/new
 * не закрываются здесь: у них стоит noindex в метаданных, а Disallow
 * запрещает робота ЧИТАТЬ страницу — и noindex он тогда не увидит.
 *
 * Host для Яндекса не пишется: директива упразднена в 2018-м, главное
 * зеркало он берёт из 301 на www и canonical.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/media/'],
      disallow: ['/admin', '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
