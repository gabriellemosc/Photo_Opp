import { useEffect, useState } from "react"
import { getPhotos } from "../services/api"
import { QRCodeCanvas } from "qrcode.react"
import { useNavigate } from "react-router-dom"
import './Dashboard.css';


function Dashboard(){

  const [stats,setStats] = useState(null) // guarda métricas
  const [photos,setPhotos] = useState([]) // guarda fotos
  const [page,setPage] = useState(1) // página atual
  const [limit,setLimit] = useState(10) // fotos por página
  const [startDate,setStartDate] = useState("") // filtro inicial
  const [endDate,setEndDate] = useState("") // filtro final
  const [total, setTotal] = useState(0)
  const [filteredTotal, setFilteredTotal] = useState(0)
  const [selectedPhoto, setSelectedPhoto] = useState(null) // foto para modal QR

  const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '') // remove barra final



    // Carrega fotos do backend
    const loadPhotos = async () => {
        const token = localStorage.getItem("token")
        const params = new URLSearchParams({ page, limit, startDate, endDate })
        const res = await fetch(`${API_URL}/photos?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setPhotos(data.photos)
        setTotal(data.total)
        setFilteredTotal(data.filteredTotal)
      }

      const navigate = useNavigate()

      const handleLogout = () => {
        localStorage.removeItem("token") // ou qualquer dado de login
        navigate("/auth/login")
      }

  // =============================
  // Carrega métricas
  // =============================

  useEffect(()=>{

    async function loadStats(){

      const token = localStorage.getItem("token")

      const res = await fetch(`${API_URL}/admin/stats`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      const data = await res.json()

      setStats(data)

    }

    loadStats()

  },[])


  // =============================
  // Carrega fotos com paginação
  // =============================

  useEffect(()=>{

    async function loadPhotos(){

      const data = await getPhotos(page,limit,startDate,endDate)

      setPhotos(data.photos)

    }

    loadPhotos()

  },[page,limit,startDate,endDate])


  if(!stats) return <p>Carregando...</p>


  return (

    
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Painel Administrativo</h1>

  
        
        <div className="header-actions">
          <span className="date-indicator">{new Date().toLocaleDateString('pt-BR')}</span>
        </div>

        
        <button onClick={handleLogout} className="btn btn-logout">
        Logout
      </button>

      </header>

      {/* ============================= */}
      {/* MÉTRICAS */}
      {/* ============================= */}

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📸</div>
          <div className="metric-content">
            <span className="metric-label">Total de Fotos</span>
            <span className="metric-value">{stats.totalPhotos}</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">✨</div>
          <div className="metric-content">
            <span className="metric-label">Fotos Hoje</span>
            <span className="metric-value">{stats.todayPhotos}</span>
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* FILTROS */}
      {/* ============================= */}

      <div className="filters-section">
        <h3>Filtros</h3>
        <div className="filters-container">
          <div className="date-inputs">
            <div className="input-group">
              <label>Data Inicial</label>
              <input 
                type="datetime-local" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)} 
                className="date-input"
              />
            </div>
            <div className="input-group">
              <label>Data Final</label>
              <input 
                type="datetime-local" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)} 
                className="date-input"
              />
            </div>
          </div>
          <div className="filter-actions">
            <button onClick={() => { setPage(1); loadPhotos() }} className="btn btn-primary">
              Filtrar
            </button>
            <button onClick={() => {
              setStartDate('')
              setEndDate('')
              setPage(1)
              loadPhotos()
            }} className="btn btn-outline">
              Redefinir Filtros
            </button>
          </div>
        </div>
      </div>

      {/* ============================= */}
      {/* CONTROLES DE PÁGINA */}
      {/* ============================= */}

      <div className="pagination-controls">
        <div className="per-page-selector">
          <label>Fotos por página:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="per-page-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* ============================= */}
      {/* LISTA DE FOTOS */}
      {/* ============================= */}

      <div className="photos-grid">
        {photos.map(photo => (
          <div key={photo.id} className="photo-card" onClick={() => setSelectedPhoto(photo)}>
            <div className="photo-wrapper">
              <img
                src={photo.s3_url}
                alt={`Foto ${photo.id}`}
                className="photo-image"
              />
              <div className="photo-overlay">
                <span className="view-qr">Ver QR Code</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================= */}
      {/* CONTROLE DE PAGINAÇÃO */}
      {/* ============================= */}

      <div className="pagination">
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 1}
          className="pagination-btn"
        >
          ← Anterior
        </button>
        
        <span className="page-indicator">Página {page}</span>
        
        <button 
          onClick={() => setPage(page + 1)}
          className="pagination-btn"
        >
          Próxima →
        </button>
      </div>

      {/* ============================= */}
      {/* MODAL QR CODE */}
      {/* ============================= */}

      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPhoto(null)}>×</button>
            <h3>QR Code da Foto</h3>
            <div className="qr-container">
              <QRCodeCanvas value={selectedPhoto.s3_url} size={250} />
            </div>
            <p className="qr-instruction">Escaneie para acessar a foto</p>
            <button onClick={() => setSelectedPhoto(null)} className="btn btn-primary">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;