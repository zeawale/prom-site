import { revalidatePath } from 'next/cache'

/**
 * Сброс кеша целого раздела сайта — всех страниц под общим layout.
 *
 * Почему не просто revalidatePath('/services', 'layout'). С типом 'layout'
 * или 'page' Next ищет тег не по адресу страницы, а по пути в дереве
 * app/, а все страницы сайта лежат в группе (frontend). Тег у каталога
 * называется `_N_T_/(frontend)/services/layout`, и revalidatePath без
 * группы искал бы `_N_T_/services/layout` — такого тега нет, вызов
 * молча ничего не сбрасывает. Так и выглядела «ревалидация не работает
 * локально» из старых заметок: хук отрабатывал без ошибки, страница
 * оставалась HIT. Проверено на production-сборке 29.09.2026 по
 * x-next-cache-tags в .next/server/app/*.meta.
 *
 * Без типа (revalidatePath('/its')) тег строится по адресу страницы —
 * `_N_T_/its` — и группа не нужна. Поэтому точечные сбросы одной
 * страницы в хуках остаются как были, а сюда идут только разделы.
 */
const FRONTEND_GROUP = '/(frontend)'

export function revalidateSection(path: `/${string}`): void {
  revalidatePath(`${FRONTEND_GROUP}${path}`, 'layout')
}
