import { Link } from "@/lib/router"

export function JoinCta() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 pt-4 pb-20">
      <div className="rounded-[28px] bg-[var(--wn-shot)] px-8 py-14 text-center text-white sm:px-14">
        <h2 className="font-display mx-auto max-w-[620px] text-[32px] leading-tight font-[800] tracking-[-0.03em] sm:text-[40px]">
          Дараагийн дуудлага худалдаа хэдхэн минутын дараа
        </h2>
        <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-relaxed text-white/70">
          Бүртгүүлээд үнэ хаялцаж, худалдагчидтай чатлаж, дуртай шоугаа
          дагаарай.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/sign-up"
            className="rounded-full bg-white px-6 py-3.5 text-[16px] font-[700] text-[var(--wn-ink)] transition-opacity hover:opacity-90"
          >
            Бүртгүүлэх
          </Link>
          <Link
            to="/sign-in"
            className="rounded-full border border-white/25 px-6 py-3.5 text-[16px] font-[700] text-white transition-colors hover:bg-white/10"
          >
            Нэвтрэх
          </Link>
        </div>
      </div>
    </section>
  )
}
