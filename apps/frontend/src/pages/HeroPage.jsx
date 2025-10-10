import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'
import { useEffect, useState } from 'react'

export const HeroPage = () => {
  const [userData, setUserData] = useState(null)
  const { isLoading, error, data, getData } = useVisitorData(
    { extendedResult: true },
    { immediate: true }
  )

  function getDa(){
    getData({ ignoreCache: true })
    setUserData(data)
  }
  console.log(data);

  useEffect(() => {
    setUserData(data)
    console.log(userData)
  }, [data])

  return (
    <div className="flex w-full items-center justify-center h-screen bg-[#F4F6FA] text-[#2C2C2C] h-full ml-[300px]">
      <h1 className="text-2xl font-bold">Hero Page</h1>
    </div>
  )
}