import { useEffect, useState } from 'react'
import "./HeroPage.css";
import Map from '../../components/MapComponent/MapComponent'

export const HeroPage = () => {

  return (
    <div className="flex w-full items-center justify-center py-10 px-6">
      <div className="main-page">
        <div className="main-page-content">
          <h1>Перевір рівень радіації свого району в місті Кропивницький</h1>
          <Map />
          <div className="main-page-content-text">
            <p>
              У час, коли екологічна безпека має вирішальне значення, особливо
              поруч з техногенними об'єктами чи природними джерелами радіації, ми
              вважаємо, що знати — означає бути захищеним. Ми прагнемо, щоб
              Кропивницький був не лише чистим і комфортним, а й екологічно
              безпечним містом. Цей проєкт — наш спільний крок до прозорості,
              безпеки та відповідальності.
            </p>
          </div>
          <div className="main-page-content-goal">
            <h2>Мета...</h2>
          </div>
        </div>
      </div>
    </div>
  )
}