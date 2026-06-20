'use client'

import { useState } from "react"

const keys = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
] as const


export interface KeySelectProps {
  defaultKey?: string,
  onSelect?: (key: string) => void,
}

export const KeySelect = (props: KeySelectProps) => {
    const [selectedKey, setSelectedKey] = useState<string | null>("C")

    const handleKeySelect = (key: string) => {
      setSelectedKey(key)
      props.onSelect && props.onSelect(key)
    }

  return (
    <div className="key-row">
        <h2>Select Key: {selectedKey}</h2>
      {keys.map((key) => (
        <button key={key} className="key-button" onClick={() => handleKeySelect(key)}>
          {key}
        </button>
      ))}
    </div>
  )
}