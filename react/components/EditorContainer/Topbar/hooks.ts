import { useCallback, useState } from 'react'

export const useHover = () => {
  const [hover, setHover] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setHover(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHover(false)
  }, [])

  return { handleMouseEnter, handleMouseLeave, hover }
}
