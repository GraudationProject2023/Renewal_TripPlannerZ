import { TripDetailPage } from '@ui/pages/trip-detail'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <TripDetailPage tripId={Number(id)} />
}
