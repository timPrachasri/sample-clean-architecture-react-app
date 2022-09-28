import React, { ImgHTMLAttributes, useState } from 'react'

export const ImageWithFallback = ({ src, ...props }: ImgHTMLAttributes<any>) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src)

  return <img {...props} src={imgSrc as string} onError={() => setImgSrc('/images/default-item-image.jpeg')} />
}
