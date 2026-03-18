import { useEffect, useRef, useState } from "react"
import "./Upload.css"
import { useNavigate } from "react-router-dom"
import moldura from "../assets/images/moldura.png" // importa a moldura png

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '') // remove barra final

function Upload() {

  const navigate = useNavigate() 
  const videoRef = useRef(null) //  video (camera)
  const canvasRef = useRef(null) 
  const [count, setCount] = useState(null)
  const [photo, setPhoto] = useState(null) // foto taken
  const [stream, setStream] = useState(null) // stream  camera
  const [started, setStarted] = useState(false) // if user clicked
  const [capturing, setCapturing] = useState(false) 


  useEffect(() => {
    if (!started) return 

    async function startCamera() {



      const media = await navigator.mediaDevices.getUserMedia({
        video: true
      })

      setStream(media) // salva stream

      if (videoRef.current) {
        videoRef.current.srcObject = media 

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
        }
      }

    }

    startCamera()

  }, [started])

  useEffect(() => {

    if (!started) return 
    if (!capturing) return 
    if (photo) return 
    if (count === null) return 
    if (count <= 0) return 

    const timer = setTimeout(() => {
  
      if (count === 1) {
        takePhoto()
      }
  
      setCount(prev => prev - 1) 
  
    }, 1000)
  
    return () => clearTimeout(timer) // clean timeout
  
  }, [count, started, photo])

  function takePhoto() {

    const video = videoRef.current
    const canvas = canvasRef.current
  
    if (!video.videoWidth || !video.videoHeight) {
      return
    }
  
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
  
    const ctx = canvas.getContext("2d")
  
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  
    const frame = new Image()
    frame.src = moldura
    frame.crossOrigin = "anonymous"

  
    frame.onload = () => {
  
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
  
      // imagem final
      const finalImage = canvas.toDataURL("image/png")
  
      setPhoto(finalImage)
  
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
  
    }
  
  }

  async function retryPhoto() {

    setPhoto(null) // remove foto capturada
    setCount(null) // zera contador
    setCapturing(false) // volta para botão capturar
  
    const media = await navigator.mediaDevices.getUserMedia({
      video: true
    })
  
    setStream(media) // salve stream
  
    if (videoRef.current) {
      videoRef.current.srcObject = media // conect camera to vídeo
    }
  
  }

  function startCountdown(){

    setCapturing(true) 
    setCount(3) 
  }

  function startExperience() {

    setStarted(true) 
    setCount(null) 
  
  }

  async function sendPhoto() {

    const blob = await fetch(photo).then(r => r.blob()) // convert base64 para blob
  
    const formData = new FormData()
  
    formData.append("image", blob, "photo.png") 
  
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/activation/upload`, {
  
      method: "POST",
  
      headers: {
        Authorization: `Bearer ${token}` 
      },
  
      body: formData
  
    })
  
    const data = await response.json() 
  
  
    navigate("/result", {
      state: {
        imageUrl: data.s3_url 
      }
    })
  
  }

  if (!started) {

    return (

      <div className="startScreen"> {/* container principal */}

    
  
      <h1 className="title">
        Photo <br/> Opp
      </h1> {/* breakline to layout */}
  
      <button 
        className="startButton"
        onClick={startExperience} 
      >
        Iniciar
      </button>
  
    </div>
    )

  }

  return (

    <div className="container">
{!photo && (
  <>
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="camera"
      onLoadedMetadata={() => {
      }}
    />

<p className="cameraLabel">
          [câmera aberta]
        </p> {/* small text */}

    {/* counter */}
    {capturing && (
      <h1 className="countdown">
        {count}
      </h1>
    )}


    {/* erase button */}
    {!capturing && (
          <button
            className="captureButton"
            onClick={startCountdown} //  counter
          />
        )}
  </>
)}



{photo && (
    <div className="photoWrapper">

    <div className="photoContainer">

  
      {/* photo AREA  */}
      <div className="photoArea">

        <img
          src={photo} // photo taken 
          alt="foto"
          className="userPhoto"
        />

        <img
          src={moldura} // moldura png
          alt="frame"
          className="frameOverlay"
        />

      </div>

    </div>

    <div className="buttons">

      <button onClick={retryPhoto} className="retryButton">
        Refazer
      </button>

      <button onClick={sendPhoto} className="continueButton">
        Continuar
      </button>

    </div>

    </div>

)}

      <canvas ref={canvasRef} style={{ display: "none" }} />

    </div>

  )

}

export default Upload