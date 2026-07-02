'use client'
import { useMemo, useState } from 'react'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import {
  CompanionCard,
  useMyCompanions,
  useRecruitingCompanions,
  type CompanionListScope,
  type CompanionSummary,
} from '../../../entities/companion'
import { CompanionCreateDialog } from '../../../features/companion-create'
import { CompanionScopeTabs } from './CompanionScopeTabs'

const matchesKeyword = (companion: CompanionSummary, keyword: string): boolean => {
  if (!keyword) return true
  const normalized = keyword.trim().toLowerCase()
  return (
    companion.title.toLowerCase().includes(normalized) ||
    companion.destination.toLowerCase().includes(normalized)
  )
}

export const CompanionListSection = () => {
  const [scope, setScope] = useState<CompanionListScope>('recruiting')
  const [keyword, setKeyword] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const recruiting = useRecruitingCompanions()
  const mine = useMyCompanions()
  const active = scope === 'recruiting' ? recruiting : mine

  const items = active.data?.content ?? []
  const filtered = useMemo(
    () => items.filter((c) => matchesKeyword(c, keyword)),
    [items, keyword],
  )

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-h700-24 font-bold text-neutral-900">동행 찾기</h1>
          <p className="mt-1 text-l500-14 text-neutral-500">
            함께 갈 사람을 모집하거나 다른 여행자의 모집에 지원해보세요.
            {active.data && (
              <span className="ml-2 text-neutral-400">
                총 {active.data.totalElements.toLocaleString('ko-KR')}건
              </span>
            )}
          </p>
        </div>
        <Button size="lg" onClick={() => setDialogOpen(true)}>
          + 모집글 작성
        </Button>
      </header>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CompanionScopeTabs value={scope} onChange={setScope} />
        <div className="relative w-full md:w-72">
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="제목·목적지 검색"
            className="w-full rounded-lg border border-neutral-300 bg-neutral-0 px-3 py-2 pr-9 text-l500-14 outline-none focus:border-primary-600"
            aria-label="모집 검색"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            🔍
          </span>
        </div>
      </div>

      {active.isLoading ? (
        <CompanionListSkeleton />
      ) : active.isError ? (
        <div className="rounded-card border border-error-200 bg-error-50 p-6 text-center">
          <p className="text-t600-16 font-semibold text-error-700">
            목록을 불러오지 못했습니다
          </p>
          <p className="mt-1 text-l500-14 text-error-600">
            {active.error instanceof ApiRequestError
              ? active.error.message
              : '잠시 후 다시 시도해 주세요.'}
          </p>
          <Button
            variant="outlined-secondary"
            size="md"
            className="mt-4"
            onClick={() => active.refetch()}
          >
            다시 시도
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <CompanionListEmpty
          scope={scope}
          hasKeyword={keyword.length > 0}
          onCreate={() => setDialogOpen(true)}
          onClearKeyword={() => setKeyword('')}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CompanionCard key={c.id} companion={c} href={`/companions/${c.id}`} />
          ))}
        </div>
      )}

      <CompanionCreateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={(id) => window.location.assign(`/companions/${id}`)}
      />
    </section>
  )
}

const CompanionListSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="h-36 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-50"
      >
        <div className="h-3 w-24 rounded bg-neutral-200" />
        <div className="mt-3 h-4 w-40 rounded bg-neutral-200" />
        <div className="mt-8 h-3 w-48 rounded bg-neutral-100" />
      </div>
    ))}
  </div>
)

type CompanionListEmptyProps = {
  scope: CompanionListScope
  hasKeyword: boolean
  onCreate: () => void
  onClearKeyword: () => void
}

const CompanionListEmpty = ({
  scope,
  hasKeyword,
  onCreate,
  onClearKeyword,
}: CompanionListEmptyProps) => {
  if (hasKeyword) {
    return (
      <div className="rounded-card border border-dashed border-neutral-300 bg-neutral-0 p-12 text-center">
        <span className="text-3xl" aria-hidden>
          🔎
        </span>
        <p className="mt-3 text-t600-16 font-semibold text-neutral-900">
          검색 결과가 없습니다
        </p>
        <Button
          variant="outlined-secondary"
          size="md"
          className="mt-4"
          onClick={onClearKeyword}
        >
          검색어 초기화
        </Button>
      </div>
    )
  }
  return (
    <div className="rounded-card border border-dashed border-neutral-300 bg-neutral-0 p-16 text-center">
      <span className="text-4xl" aria-hidden>
        🤝
      </span>
      <p className="mt-4 text-t600-16 font-semibold text-neutral-900">
        {scope === 'mine' ? '작성한 모집글이 없습니다' : '모집 중인 동행이 없습니다'}
      </p>
      <p className="mt-2 text-l500-14 text-neutral-500">
        {scope === 'mine'
          ? '함께 여행할 사람을 모집해 보세요.'
          : '첫 번째 모집글을 등록해 동행을 만들어보세요.'}
      </p>
      <Button size="lg" className="mt-6" onClick={onCreate}>
        + 모집글 작성
      </Button>
    </div>
  )
}
