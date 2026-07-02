'use client'
import { GripVertical, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { useDrag, useDrop, type Identifier } from 'react-dnd'
import { Button } from '../../../shared/ui'
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
          <>
            <GripVertical
              className="h-4 w-4 text-neutral-300 group-hover:text-neutral-400"
              aria-hidden
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={disabled}
              className="text-neutral-400 hover:bg-error-50 hover:text-error-600"
              aria-label={`${item.placeName} 삭제`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        }
      />
    </div>
  )
}
