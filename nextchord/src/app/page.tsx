'use client'

import { KeySelect } from "@/features/components/KeySelect"
import { ModifierSelect } from "@/features/components/ModifierSelect"
import { useState } from "react"


export default function Home() {
  const [key, setKey] = useState<string | null>(null)
  const [modifier, setModifier] = useState<string | null>(null)

  const handleKeySelected = (value: string) => {
    setKey(value)
  }

  const handleModifierSelected = (value: string) => {
    setModifier(value)
  }

  return (
    <div>
      <h2>Current Configuration</h2>
      <table border={1}>
        <tr>
          <td>key</td>
          <td>{key}</td>
        </tr>
        <tr>
          <td>modifier</td>
          <td>{modifier}</td>
        </tr>
      </table>


      <KeySelect onSelect={handleKeySelected}/>
      <ModifierSelect onSelect={handleModifierSelected}/>
    </div>
  )
}
