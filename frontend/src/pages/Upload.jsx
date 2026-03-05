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

  useEffect(() => {

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

  }, [])

  useEffect(() => {

    if (photo) return // se já tirou foto não conta

    if (count === 0) {
      takePhoto() // quando contador chega a 0 tira foto
      return
    }

    const timer = setTimeout(() => {
      setCount(count - 1)
    }, 1000)

    return () => clearTimeout(timer)

  }, [count, photo])


  function takePhoto() {

    const video = videoRef.current
    const canvas = canvasRef.current
  if (video.readyState !== 4) {
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