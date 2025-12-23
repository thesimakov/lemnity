import { heroui } from '@heroui/theme'
const plugin = heroui() as unknown
export default plugin

// необходимо избавиться от heroui и tailwind в виджетах, как можно скорее
// кастомные компоненты и стили будут лучшим вариантом за счет
// хэщирования имен стилей и максимального контроля над ними
