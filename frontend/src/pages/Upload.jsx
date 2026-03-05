import { useEffect, useRef, useState } from "react"
import "./Upload.css"

function Upload() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [count, setCount] = useState(3)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(false)

  useEffect(() => {
    startCamera()
  }, [])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })

      videoRef.current.srcObject = stream
      
      videoRef.current.onloadedmetadata = () => {
        setCameraReady(true)
        startCountdown()
      }

    } catch (error) {
      console.error("Erro ao acessar câmera:", error)
      setCameraError(true)
    }
  }

  function startCountdown() {
    let counter = 3

    const interval = setInterval(() => {
      setCount(counter)
      counter--

      if (counter < 0) {
        clearInterval(interval)
        takePhoto()
      }
    }, 1000)
  }

  async function takePhoto() {
    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0)

    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append("image", blob, "photo.jpg")

      const token = localStorage.getItem("token")

      console.log("Iniciando upload...")

      try {
        const response = await fetch("http://localhost:3000/activation/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        })

        const data = await response.json()
        console.log("Resposta backend:", data)
      } catch (error) {
        console.error("Erro no upload:", error)
      }
    }, "image/jpeg")
  }

  if (cameraError) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="error-icon">
            <span>❌</span>
          </div>
          <h2 className="error-title">Erro na Câmera</h2>
          <p className="error-message">
            Não foi possível acessar sua câmera. Verifique as permissões e tente novamente.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="error-button"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-glow"></div>
        
        <div className="upload-content">
          
          <div className="upload-header">
            <h1 className="upload-title">
              📸 Captura de Foto
            </h1>
            <p className="upload-subtitle">
              Prepare-se para a foto perfeita
            </p>
          </div>

          <div className="camera-wrapper">
            
            {cameraReady && count > 0 && (
              <div className="countdown-overlay">
                <div className="countdown-container">
                  <div className="countdown-ring"></div>
                  <div className="countdown-number">
                    <span>{count}</span>
                  </div>
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="upload-video"
            />
            
            <div className="scanline-effect"></div>
            
            <div className="camera-corner corner-tl"></div>
            <div className="camera-corner corner-tr"></div>
            <div className="camera-corner corner-bl"></div>
            <div className="camera-corner corner-br"></div>
          </div>

          <div className="status-bar">
            <div className="status-indicator">
              <div className={`status-dot ${cameraReady ? 'ready' : 'loading'}`}></div>
              <span className="status-text">
                {cameraReady ? '📷 Câmera pronta' : '⏳ Inicializando câmera...'}
              </span>
            </div>
            
            <div className="timer-badge">
              <span>⏱️</span>
              <span>Foto automática em 3s</span>
            </div>
          </div>

          <div className="instructions">
            <p>
              <i>⚡</i>
              A foto será tirada automaticamente após a contagem regressiva
            </p>
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="upload-canvas"
      />
    </div>
  )
}

export default Upload

