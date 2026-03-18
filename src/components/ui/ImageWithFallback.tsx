'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
  src: string
  fallbackSrc: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export default function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className,
  width,
  height,
  priority = false
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  return (
    <img
      src={error ? fallbackSrc : imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => {
        setError(true)
        setImgSrc(fallbackSrc)
      }}
    />
  )
}