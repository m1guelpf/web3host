import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export const tap = async <T>(value: T, cb: (value: T) => Promise<unknown>): Promise<T> => {
	await cb(value)
	return value
}

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
