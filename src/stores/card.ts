import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface Card {
  id: number
  name: string
  basePower: number
  group: string
  level: string
  skillDescription?: string
  countDescription?: string
  count?: number
}

export const useCardMapStore = defineStore('cardMap', () => {
  const cardMap = ref<Record<number, Card>>({})

  const setCardMap = (cardMapData: Record<number, Card>) => {
    cardMap.value = cardMapData
  }

  const getCardById = (id: number) => {
    return cardMap.value[id]
  }

  return { cardMap, setCardMap, getCardById }
})
