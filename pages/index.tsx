// import StartScreen from "@/components/StartScreen"
import dynamic from 'next/dynamic'
const StartScreen = dynamic(() => import("@/components/StartScreen"), {
    ssr: false
  })

export default function Home() {
  return (
    <>
      <StartScreen />
    </>
  )
}
