 
import Map from '../components/MapComponent'

export const HeroPage = () => {

  return (
    <div className="flex w-full items-center justify-center py-10 px-6">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center mt-[50px] w-full h-full">
          <h1 className="text-2xl md:text-[36px] font-semibold w-full max-w-[690px] text-center mb-[30px] md:mb-[50px] px-2">
            Перевір рівень радіації свого району в місті Кропивницький
          </h1>
          <Map />
          <div className="max-w-[800px] mx-auto my-5 md:my-10 p-4 md:p-5 text-center font-sans leading-[1.8] text-[#333]">
            <p className="text-[16px] md:text-[18px] m-0 p-4 md:p-5 bg-white/90 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
              У час, коли екологічна безпека має вирішальне значення, особливо
              поруч з техногенними об'єктами чи природними джерелами радіації, ми
              вважаємо, що знати — означає бути захищеним. Ми прагнемо, щоб
              Кропивницький був не лише чистим і комфортним, а й екологічно
              безпечним містом. Цей проєкт — наш спільний крок до прозорості,
              безпеки та відповідальності.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}