export function getPlaceholderImage(id, index = 0) {
  return `https://picsum.photos/400/300?random=${id}_${index}`
}

export function isExternalImage(url) {
  return url && (url.includes('muscache') || url.includes('airbnb'))
}

export function processImageUrl(url, id, index = 0) {
  if (isExternalImage(url)) {
    return getPlaceholderImage(id, index)
  }
  return url
}
