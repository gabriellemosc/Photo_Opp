import { QRCodeCanvas } from "qrcode.react" 
import { useLocation } from "react-router-dom"
import {useNavigate } from "react-router-dom"
import { useState } from "react"

import "./Result.css"
import frame from "../assets/images/frame.png"


function Result() {

  const navigate = useNavigate() // 

  const location = useLocation() // datas send for the route
  const imageUrl = location.state?.imageUrl // URL  S3 image

  const [showThanksBox, setShowThanksBox] = useState(false) 



  function goToThanks(){

    setShowThanksBox(true) 

    setTimeout(() => {

      navigate("/thanks", { 
        state:{
          imageUrl: imageUrl
        }
      })
  
    }, 2000)
  
  }
  return(

    <div className="resultContainer">

      <div className="photoArea">

        <img
          src={imageUrl}
          className="userPhoto"
          alt="foto"
        />

        <img
          src={frame}
          className="frameOverlay"
          alt="frame"
        />

        <div className="qrCard">

          <p>Fazer download</p>

          <QRCodeCanvas
            value={imageUrl} 
            size={120}
          />

        </div>

      </div>

      <button
        className="finishButton"
        onClick={goToThanks}
      >
        Finalizar
      </button>

      {showThanksBox && (

      <div className="thanksOverlay"> 
        <div className="thanksPopup">

          <h2>Obrigado!</h2>
          <p>Preparando sua tela de download...</p>

        </div>
        </div>
      )}

    </div>

  )

}

export default Result