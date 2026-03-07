import { useEffect, useRef, useState } from "react"
import "./Upload.css"
import { useNavigate } from "react-router-dom"
import logo from "../assets/images/Nex_Lab_horizontal.svg"
import moldura from "../assets/images/moldura.png" // importa a moldura png

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '') // remove barra final

function Upload() {

  const navigate = useNavigate() // cria função de navegação
  const videoRef = useRef(null) // referencia do video (camera)
  const canvasRef = useRef(null) // referencia do canvas
  const [count, setCount] = useState(null)
  const [photo, setPhoto] = useState(null) // foto capturada
  const [stream, setStream] = useState(null) // stream da camera
  const [started, setStarted] = useState(false) // controla se usuário clicou em iniciar
  const [capturing, setCapturing] = useState(false) 


  useEffect(() => {
    if (!started) return // só inicia câmera depois de clicar iniciar

    async function startCamera() {



      const media = await navigator.mediaDevices.getUserMedia({
        video: true
      })

      setStream(media) // salva stream

      if (videoRef.current) {
        videoRef.current.srcObject = media // conecta stream ao video

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
        }
      }

    }

    startCamera()

  }, [started])

  useEffect(() => {

    if (!started) return // só inicia depois de clicar iniciar
    if (!capturing) return // só roda se clicou em capturar
    if (photo) return // se já tirou foto, para
    if (count === null) return // ainda não começou contagem
    if (count <= 0) return // evita números negativos

    const timer = setTimeout(() => {
  
      if (count === 1) {
        takePhoto() // quando estiver em 1, dispara a foto
      }
  
      setCount(prev => prev - 1) // diminui contador
  
    }, 1000)
  
    return () => clearTimeout(timer) // limpa timeout
  
  }, [count, started, photo])

  function takePhoto() {

    const video = videoRef.current
    const canvas = canvasRef.current
  
    if (!video.videoWidth || !video.videoHeight) {
      console.log("video ainda não está pronto")
      return
    }
  
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
  
    const ctx = canvas.getContext("2d")
  
    // 1️⃣ desenha a foto da câmera
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
  
    // 2️⃣ carrega a moldura
    const frame = new Image()
    frame.src = moldura
    frame.crossOrigin = "anonymous"

  
    frame.onload = () => {
  
      // 3️⃣ desenha a moldura por cima
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
  
      // 4️⃣ gera imagem final
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
  
    // liga a câmera novamente
    const media = await navigator.mediaDevices.getUserMedia({
      video: true
    })
  
    setStream(media) // salva stream
  
    if (videoRef.current) {
      videoRef.current.srcObject = media // conecta câmera ao vídeo
    }
  
  }

  function startCountdown(){

    setCapturing(true) // ativa contagem
    setCount(3) // inicia contador em 3  
  }

  function startExperience() {

    setStarted(true) // inicia experiência
    setCount(null) // inicia contador
  
  }

  async function sendPhoto() {

    const blob = await fetch(photo).then(r => r.blob()) // converte base64 para blob
  
    const formData = new FormData()
  
    formData.append("image", blob, "photo.png") // adiciona imagem no form
  
    const token = localStorage.getItem("token")
    console.log("Token enviado:", token); // <-- VEJA O QUE APARECE NO CONSOLE DO NAVEGADOR
    
    const response = await fetch(`${API_URL}/activation/upload`, {
  
      method: "POST",
  
      headers: {
        Authorization: `Bearer ${token}` // envia token
      },
  
      body: formData
  
    })
  
    const data = await response.json() // aqui criamos data
  
    console.log("Resposta backend:", data)
  
    navigate("/result", {
      state: {
        imageUrl: data.s3_url // agora data existe
      }
    })
  
  }

  if (!started) {

    return (

      <div className="startScreen"> {/* container principal da tela */}

      <img 
        src={logo} // logo svg importada
        alt="NexLab"
        className="logo"
      />
  
      <h1 className="title">
        Photo <br/> Opp
      </h1> {/* quebra de linha para ficar igual ao layout */}
  
      <button 
        className="startButton"
        onClick={startExperience} // função que inicia experiência
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
        console.log("camera pronta")
      }}
    />

<p className="cameraLabel">
          [câmera aberta]
        </p> {/* texto pequeno no topo */}

    {/* contador só aparece quando iniciou */}
    {capturing && (
      <h1 className="countdown">
        {count}
      </h1>
    )}


    {/* botão desaparece quando inicia contagem */}
    {!capturing && (
          <button
            className="captureButton"
            onClick={startCountdown} // inicia contador
          />
        )}
  </>
)}



{photo && (
    <div className="photoWrapper">

    <div className="photoContainer">

  
      {/* área onde fica a foto */}
      <div className="photoArea">

        <img
          src={photo} // foto capturada
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