import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import logo from "../assets/images/Nex_Lab_horizontal.svg"

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '') // remove barra final

function Login() {

  const [email, setEmail] = useState("") // estado para armazenar email
  const [password, setPassword] = useState("") // estado para senha
  const navigate = useNavigate()

  async function handleSubmit(e) {


    e.preventDefault() // impede reload da página


    try {


      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST", // método HTTP
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // email digitado
          password: password // senha digitada
        })
      })

    

      const data = await response.json() // converte resposta para JSON

      if(!response.ok){ // verifica erro do backend
        alert(data.error || "Erro no login")
        return
      }
  

      localStorage.setItem("token", data.token) // salva token

          // ✅ salvar dados do usuário para ProtectedRoutes
    localStorage.setItem("user", JSON.stringify(data.user));

      if(data.user?.role == "ADMIN"){

        navigate("/dashboard")

      }else{

        navigate("/upload")
        
      }
      

    } catch (error) {

        console.error("Erro:", error)


    }

  }

  return (

    
    <div className="login-container"> {/* container principal da tela */}

      <div className="login-box"> {/* caixa central onde fica o formulario */}


      <div className="logo"> {/* area da logo */}
          <div className="logo-square"></div> {/* quadrado acima da logo */}
          <img 
  src={logo} // caminho da imagem importada
  alt="Nex Lab Logo" // texto alternativo para acessibilidade
  className="logo-img" // classe para estilizar no css
/>        </div>


        <h1 className="login-title">Login</h1> {/* titulo */}


        <form onSubmit={handleSubmit} className="form">

    <div className="input-group"> 
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="login-input"
          />
                      <span className="icon">✉</span> {/* icone email */}


</div>

<div className="input-group"> {/* grupo do input senha */}

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="login-input"
          />
            <span className="icon">🔒</span> {/* icone cadeado */}

</div>

<div className="options"> {/* area lembrar e esqueceu senha */}
<label>
              <input type="checkbox"/> {/* checkbox lembrar */}
              Lembrar
            </label>

            <a href="#">Esqueci minha senha</a> {/* link recuperar senha */}

          </div>

          <button
            type="submit"
            className="login-button"
          >
            Entrar
          </button>

        </form>

      </div>

    </div>

  )

}

export default Login