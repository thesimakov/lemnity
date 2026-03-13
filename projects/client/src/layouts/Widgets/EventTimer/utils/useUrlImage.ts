import { useQuery } from '@tanstack/react-query'
import { announcementWidgetDefaults } from '../defaults'

const convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  const reader = new FileReader
  reader.onerror = reject
  reader.onload = () => {
      resolve(reader.result)
  }
  reader.readAsDataURL(blob)
})

const useUrlImageOrDefault = (url: string | undefined) => {
  const {
    data: base64Image,
    error,
    isLoading,
  } = useQuery({
    queryKey: [url],
    queryFn: () =>
      fetch(
        url ?? announcementWidgetDefaults.infoSettings.contentUrl!
      )
      .then((result) => result.blob())
      .then(convertBlobToBase64)
  })

  return { base64Image, error, isLoading }
}

export default useUrlImageOrDefault
