'use client'

import { useEffect, useRef, useState } from 'react'
import type { components } from '@/lib/backend/apiV1/schema'

type WordbookResponse = components['schemas']['WordbookResponse']

interface Props {
    wordbooks: WordbookResponse[]
    onWordbookSelect: (ids: number[]) => void
    studyType: 'EXPRESSION' | 'WORD'
}

export default function DropdownCheckBox({ wordbooks, onWordbookSelect, studyType }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // 초기에 모든 워드북을 선택된 상태로 설정하되, 자동 선택 코드 제거
        if (wordbooks.length > 0 && selectedIds.length === 0) {
            console.log('DropdownCheckBox 초기화 - 워드북:', wordbooks)
            const initialSelectedIds: number[] = wordbooks.map((wordbook) => wordbook.wordbookId || 0)
            console.log('초기 선택된 ID들:', initialSelectedIds)
            setSelectedIds(initialSelectedIds)
            onWordbookSelect(initialSelectedIds)
        }
    }, [wordbooks, selectedIds, onWordbookSelect])

    useEffect(() => {
        const handleClickOut = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOut)
        return () => {
            document.removeEventListener('mousedown', handleClickOut)
        }
    }, [])

    const handleCheckboxChange = (wordbook: WordbookResponse) => {
        const id = wordbook.wordbookId || 0
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter((selectedId) => selectedId !== id)
            : [...selectedIds, id]
        setSelectedIds(newSelectedIds)
        onWordbookSelect(newSelectedIds)
    }

    const getSelectedCount = () => {
        return selectedIds.length
    }

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    {studyType === 'EXPRESSION' ? '표현함 선택' : '단어장 선택'} ({getSelectedCount()})
                    <svg
                        className="-mr-1 size-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1" role="none">
                        {wordbooks.map((wordbook) => (
                            <label
                                key={wordbook.wordbookId || 0}
                                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                role="menuitem"
                            >
                                <span>{wordbook.name}</span>

                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(wordbook.wordbookId || 0)}
                                    onChange={() => handleCheckboxChange(wordbook)}
                                    className="sr-only"
                                />

                                <span
                                    className={`w-5 h-5 flex items-center justify-center rounded border border-[var(--color-main)] ${
                                        selectedIds.includes(wordbook.wordbookId || 0)
                                            ? 'bg-[var(--color-main)] text-white'
                                            : 'bg-white'
                                    }`}
                                >
                                    {selectedIds.includes(wordbook.wordbookId || 0) && (
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
