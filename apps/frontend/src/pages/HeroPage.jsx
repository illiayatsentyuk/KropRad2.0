import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'
import { useEffect, useState } from 'react'

export const HeroPage = () => {
  const [userData, setUserData] = useState(null)
  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  )

  useEffect(() => {
    setUserData(data)
    console.log(userData)
  }, [data])

  return (
    <div className="flex w-full items-center justify-center py-10 px-6">
      <h1 className="text-2xl font-bold">Hero Page</h1>
    </div>
  )
}