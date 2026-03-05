import { QRCodeCanvas } from "qrcode.react" // biblioteca para gerar QR Code
import { useLocation } from "react-router-dom"

function Result() {

  const location = useLocation() // pega dados enviados pela rota
  const imageUrl = location.state?.imageUrl // URL da imagem no S3

  async function downloadImage() { // função async para permitir uso de await

    const response = await fetch(imageUrl) // faz requisição HTTP para baixar imagem
    const blob = await response.blob() // transforma resposta em arquivo blob

    const url = window.URL.createObjectURL(blob) // cria URL temporária para o arquivo

    const link = document.createElement("a") // cria elemento <a> dinamicamente
    link.href = url // aponta para o blob gerado
    link.download = "photo.png" // define nome do arquivo no download

    document.body.appendChild(link) // adiciona link ao DOM
    link.click() // dispara download automaticamente

    link.remove() // remove elemento do DOM
    window.URL.revokeObjectURL(url) // libera memória usada pela URL temporária

  }

  return (

    <div className="resultContainer">

      <h2>Fazer download</h2>

      <div className="qrBox">

        <QRCodeCanvas
          value={imageUrl} // QR Code aponta para URL da imagem
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