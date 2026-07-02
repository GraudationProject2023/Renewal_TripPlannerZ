import type { Companion } from '../../../entities/companion'

type CompanionDetailBodyProps = {
  companion: Companion
}

export const CompanionDetailBody = ({ companion }: CompanionDetailBodyProps) => (
  <section className="rounded-card border border-neutral-200 bg-neutral-0 p-6 shadow-50">
    <h2 className="text-t600-16 font-semibold text-neutral-900">상세 내용</h2>
    {companion.content ? (
      <p className="mt-3 whitespace-pre-wrap text-l500-14 leading-relaxed text-neutral-700">
        {companion.content}
      </p>
    ) : (
      <p className="mt-3 text-l500-14 text-neutral-500">호스트가 남긴 내용이 없습니다.</p>
    )}
  </section>
)
