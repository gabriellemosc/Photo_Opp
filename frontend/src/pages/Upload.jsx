import { useEffect, useRef, useState } from "react"
import "./Upload.css"
import frame from "../assets/images/frame.png" // importa moldura do figma
import { useNavigate } from "react-router-dom"

function Upload() {
  const navigate = useNavigate() // cria função de navegação
  const videoRef = useRef(null) // referencia do video (camera)
  const canvasRef = useRef(null) // referencia do canvas
  const [count, setCount] = useState(3) // contador
  const [photo, setPhoto] = useState(null) // foto capturada
  const [stream, setStream] = useState(null) // stream da camera
  const [started, setStarted] = useState(false) // controla se usuário clicou em iniciar


  useEffect(() => {
    if (!started) return // só inicia câmera depois de clicar iniciar

    async function startCamera() {

      const media = await navigator.mediaDevices.getUserMedia({
        video: true
      })

      setStream(media) // salva stream

      if (videoRef.current) {
        videoRef.current.srcObject = media // conecta stream ao video
      }

    }

    startCamera()

  }, [started])

  useEffect(() => {

    if (!started) return // só inicia depois de clicar iniciar
    if (photo) return // se já tirou foto, para
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

    console.log("tirando foto...") // debug

    const video = videoRef.current
    const canvas = canvasRef.current

  if (!video.videoWidth || !video.videoHeight) {
    console.log("video ainda não está pronto")
    return
  }

    canvas.width = video.videoWidth // largura real da camera
    canvas.height = video.videoHeight // altura real da camera

    

    const ctx = canvas.getContext("2d")

    ctx.drawImage(video, 0, 0) // desenha frame atual no canvas

    const imageData = canvas.toDataURL("image/png") // converte imagem para base64

    setPhoto(imageData) // salva foto no estado

    if (stream) {
      stream.getTracks().forEach(track => track.stop()) // desliga camera
    }

  }

  function retryPhoto() {

    setPhoto(null) // limpa foto
    setCount(3) // reinicia contador
    window.location.reload() // reinicia camera

  }

  function startExperience() {

    setStarted(true) // inicia experiência
    setCount(3) // inicia contador
  
  }

  async function sendPhoto() {

    const blob = await fetch(photo).then(r => r.blob()) // converte base64 para blob
  
    const formData = new FormData()
  
    formData.append("image", blob, "photo.png") // adiciona imagem no form
  
    const token = localStorage.getItem("token")
  
    const response = await fetch("http://localhost:3000/activation/upload", {
  
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

      <div className="startScreen">

        <h1>Photo App</h1>

        <button onClick={startExperience}>
          Iniciar
        </button>

      </div>

    )

  }

  return (

    <div className="container">

      {!photo && (
        <>
          <h1 className="countdown">{count}</h1>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera"
            onLoadedMetadata={() => {
                console.log("camera pronta") // confirma que o video carregou
              }}
          />
        </>
      )}

      {photo && (
        <>
           <div className="photoContainer">

                <img
                src={photo} // foto capturada da camera
                alt="foto"
                className="userPhoto"
                />

                <img
                src={frame} // moldura png
                alt="frame"
                className="frameOverlay"
                />

                </div>

          <div className="buttons">

            <button onClick={retryPhoto}>
              Refazer
            </button>

            <button onClick={sendPhoto}>
              Continuar
            </button>

          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />

    </div>

  )

}

export default Upload