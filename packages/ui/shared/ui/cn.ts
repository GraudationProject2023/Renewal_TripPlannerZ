import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** clsx로 조합하고 tailwind-merge로 충돌 클래스를 병합. shadcn 컨벤션. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
