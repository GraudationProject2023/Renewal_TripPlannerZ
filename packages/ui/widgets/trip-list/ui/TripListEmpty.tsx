import { Button } from '../../../shared/ui'

type TripListEmptyProps = {
  variant: 'no-trips' | 'no-match'
  onCreate?: () => void
  onReset?: () => void
}

export const TripListEmpty = ({ variant, onCreate, onReset }: TripListEmptyProps) => {
  if (variant === 'no-trips') {
    return (
      <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-neutral-300 bg-neutral-0 px-6 py-16 text-center">
        <span className="text-4xl" aria-hidden>
          🧳
        </span>
        <h3 className="mt-4 text-t600-16 font-semibold text-neutral-900">
          아직 여행 일정이 없습니다
        </h3>
        <p className="mt-2 text-l500-14 text-neutral-500">
          첫 여행을 만들고 일자별 동선을 정리해 보세요.
        </p>
        {onCreate && (
          <Button size="lg" className="mt-6" onClick={onCreate}>
            + 새 여행 만들기
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-neutral-300 bg-neutral-0 px-6 py-12 text-center">
      <span className="text-3xl" aria-hidden>
        🔎
      </span>
      <h3 className="mt-3 text-t600-16 font-semibold text-neutral-900">
        조건에 맞는 여행이 없습니다
      </h3>
      <p className="mt-1 text-l500-14 text-neutral-500">
        검색어나 필터를 초기화해 다시 시도해 보세요.
      </p>
      {onReset && (
        <Button variant="outlined-secondary" size="md" className="mt-4" onClick={onReset}>
          필터 초기화
        </Button>
      )}
    </div>
  )
}
