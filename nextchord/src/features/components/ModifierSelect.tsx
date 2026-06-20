import { useState } from "react"

const modifiers = ["#", "b"] as const


export interface ModifierSelectProps {
    onSelect?: (value: string) => void,
}



export const ModifierSelect = (props: ModifierSelectProps) => {
    const [modifier, setModifier] = useState<string | null>(null)
    const handleModifierSelected = (value: string) => {
        setModifier(value)
        props.onSelect && props.onSelect(value)
    }

  return (
    <div className="key-row">
        <h2>Select Modifier: {modifier}</h2>
      {modifiers.map((modifier) => (
        <button key={modifier} className="key-button" onClick={() => handleModifierSelected(modifier)}>
          {modifier}
        </button>
      ))}
    </div>
  )
}