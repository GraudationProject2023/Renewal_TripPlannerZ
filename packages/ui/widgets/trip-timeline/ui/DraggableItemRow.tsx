'use client'
import { useRef } from 'react'
import { useDrag, useDrop, type Identifier } from 'react-dnd'
import { TripItemRow, type TripItem } from '../../../entities/trip'

export const TRIP_ITEM_DND_TYPE = 'trip-item'

interface DragObject {
  id: number
  index: number
  dayNumber: number
}

interface CollectedProps {
  handlerId: Identifier | null
}

type DraggableItemRowProps = {
  item: TripItem
  index: number
  onHover: (dragIndex: number, hoverIndex: number) => void
  onDrop: () => void
  onDelete: () => void
  disabled?: boolean
}

export const DraggableItemRow = ({
  item,
  index,
  onHover,
  onDrop,
  onDelete,
  disabled,
}: DraggableItemRowProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop<DragObject, void, CollectedProps>({
    accept: TRIP_ITEM_DND_TYPE,
    collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
    hover: (dragItem) => {
      if (!ref.current || dragItem.dayNumber !== item.dayNumber) return
      if (dragItem.index === index) return
      onHover(dragItem.index, index)
      dragItem.index = index
    },
    drop: () => onDrop(),
  })

  const [{ isDragging }, drag] = useDrag<DragObject, void, { isDragging: boolean }>({
    type: TRIP_ITEM_DND_TYPE,
    item: { id: item.id, index, dayNumber: item.dayNumber },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    canDrag: !disabled,
  })

  drag(drop(ref))

  return (
    <div ref={ref} data-handler-id={handlerId} className="cursor-grab active:cursor-grabbing">
      <TripItemRow
        item={item}
        index={index}
        isDragging={isDragging}
        actions={
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-error-50 hover:text-error-600 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`${item.placeName} 삭제`}
          >
            🗑
          </button>
        }
      />
    </div>
  )
}
