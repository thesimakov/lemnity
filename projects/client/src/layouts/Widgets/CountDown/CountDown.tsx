import { Fragment, memo, useEffect, useMemo, useState } from 'react'

type CountDownProps = {
  className?: string
  /**
   * Target date for the countdown. Can be a Date instance or a string accepted by the Date constructor.
   * If not provided, a demo timestamp will be used to showcase the layout.
   */
  endDate?: Date | string
  /**
   * Preview-only fallback image. In production this can be replaced by widget settings.
   */
  imageUrl?: string
}

type TimeLeft = {
  totalMs: number
  hours: number
  minutes: number
  seconds: number
}

const DEMO_DIFF_MS = 56 * 60 * 60 * 1000 + 24 * 60 * 1000 + 12 * 1000
const DEMO_IMAGE =
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'

const ensureDate = (value?: Date | string): Date => {
  if (!value) return new Date(Date.now() + DEMO_DIFF_MS)
  if (value instanceof Date) return value
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return new Date(Date.now() + DEMO_DIFF_MS)
  return parsed
}

const formatUnit = (value: number) => value.toString().padStart(2, '0')

const CountDown = ({ className = '', endDate, imageUrl }: CountDownProps) => {
  const [now, setNow] = useState<Date>(() => new Date())
  const targetDate = useMemo(() => ensureDate(endDate), [endDate])

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  const timeLeft: TimeLeft = useMemo(() => {
    const diff = Math.max(0, targetDate.getTime() - now.getTime())
    const hours = Math.floor(diff / (60 * 60 * 1000))
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((diff % (60 * 1000)) / 1000)
    return { totalMs: diff, hours, minutes, seconds }
  }, [now, targetDate])

  const units = useMemo(
    () => [
      { label: 'часов', value: formatUnit(timeLeft.hours) },
      { label: 'минут', value: formatUnit(timeLeft.minutes) },
      { label: 'секунд', value: formatUnit(timeLeft.seconds) }
    ],
    [timeLeft.hours, timeLeft.minutes, timeLeft.seconds]
  )

  return (
    <div
      className={`flex min-h-[500px] w-full overflow-hidden rounded-lg p-4 font-rubik text-[#1F1F1F]  ${className}`}
    >
      <div className="grid h-full w-full gap-6 overflow-hidden lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white ">
          <div className="flex flex-1 flex-col">
            <div className=" self-center items-center rounded-full bg-[#E9EEFF] px-4 text-[14px] font-rubik  text-[#336EC2]">
              Концерт 08.10.2025
            </div>
            <h2 className="mt-[9px] w-full text-center text-[24px] font-rubik font-medium leading-[32px] tracking-[0.01em] text-[#111433]">
              ПОСВЯЩЕНИЕ ДЖОНУ ЛЕННОНУ. Концерт в честь 85-летия
            </h2>

            <div className="flex w-full flex-col items-center text-center">
              <div className="mt-4 text-center text-[16px] font-rubik font-normal text-black">
                Мероприятие через:
              </div>
              <div className="mt-1 flex flex-wrap justify-center gap-3">
                {units.map((unit, index) => (
                  <Fragment key={unit.label}>
                    <div className="flex h-[60px] w-[70px] items-center justify-center rounded-lg bg-[#F3F5FF]">
                      <span className="text-[35px] font-rubik font-medium text-black">
                        {unit.value}
                      </span>
                    </div>
                    {index < units.length - 1 && (
                      <div className="flex h-[60px] items-center justify-center text-[35px] font-roboto font-bold text-[#F5F5F5]">
                        :
                      </div>
                    )}
                  </Fragment>
                ))}
              </div>
              <div className="mt-[9px] flex flex-wrap justify-center gap-8.5">
                {units.map(unit => (
                  <div
                    key={`label-${unit.label}`}
                    className=" w-[70px] items-center justify-center rounded-lg  bg-[#E9EEFF]"
                  >
                    <span className="text-center text-[13.25px] font-Rubik  text-black">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex flex-col gap-3 rounded-[20px] border border-[#D9DBE8] p-3">
              <p className="text-center text-[16px] font-rubik text-black">
                Получите супер скидку до 30% на покупку билета в АРТ КАФЕ
              </p>
              <form className="flex flex-col gap-3" onSubmit={event => event.preventDefault()}>
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="h-10 w-full rounded-[16px] border border-[#D9DBE8] bg-white px-3 text-sm text-[#1F1F1F] outline-none transition focus:border-[#1E3AFF] focus:ring-2 focus:ring-[#C6D0FF]"
                />
                <button
                  type="submit"
                  className="h-15 w-full rounded-md bg-[#B88339] px-7 text-[16px] font-rubik font-normal text-[#FFFFFF] transition hover:bg-[#9F732E]"
                >
                  Получить скидку
                </button>
              </form>

              <p className=" text-[10px]  text-[#868AA1]">
                Я даю согласие на обработку моих персональных данных ООО Компания (ИНН 0000000000) в
                целях обработки заявки и обратной связи. Политика конфиденциальности по ссылке.
              </p>
            </div>
            <div className="mt-6 text-[12px] font-roboto  text-[#797979] text-center">
              Создано на Lemnity
            </div>
          </div>
        </div>

        <div className="rounded-[10px]  relative flex h-full flex-col overflow-hidden rounded-[28px] bg-[#11131F] text-white">
          <img
            src={imageUrl ?? DEMO_IMAGE}
            alt="John Lennon"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-[#020617]/40 to-[#020617]/70" />
          <div className="relative z-10 flex h-full flex-col justify-between p-8 sm:p-10">
            <div className="flex items-center justify-end gap-3 text-right">
              <div></div>
            </div>
            <div>
              <h3 className="text-[28px] leading-[34px] font-bold uppercase">
                Посвящение Джону Леннону
              </h3>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.26em] text-[#F1B350]">
                Концерт в честь 85-летия
              </p>
              <p className="mt-5 text-sm leading-6 text-white/80">
                Трибьют с женским вокалом: TMN-бэнд и Соня Озернова
              </p>
            </div>
          </div>
          <div className="pointer-events-none absolute right-[-60px] top-[-120px] h-[260px] w-[260px] rounded-full border border-white/10" />
          <div className="pointer-events-none absolute left-[-80px] bottom-[-120px] h-[220px] w-[220px] rounded-full border border-white/10" />
        </div>
      </div>
    </div>
  )
}

export default memo(CountDown)
