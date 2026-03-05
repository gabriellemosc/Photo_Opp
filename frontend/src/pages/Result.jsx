import { QRCodeCanvas } from "qrcode.react" // biblioteca para gerar QR Code
import { useLocation } from "react-router-dom"

function Result() {

  const location = useLocation() // pega dados enviados pela rota
  const imageUrl = location.state?.imageUrl // URL do S3

  function downloadImage() {

    const link = document.createElement("a") // cria link virtual
    link.href = imageUrl // define URL da imagem
    link.download = "photo.png" // nome do arquivo
    link.click() // dispara download

  }

  return (

    <div className="resultContainer">

      <h2>Fazer download</h2>

      <div className="qrBox">

        <QRCodeCanvas
          value={imageUrl} // QR Code aponta para URL do S3
          size={180}
        />

      </div>

      <button onClick={downloadImage}>
        Baixar imagem
      </button>

    </div>

  )

}

export default Result