import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import logo from "../assets/images/Nex_Lab_horizontal.svg"

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '') // REMOVE FINAL VAR

function Login() {

  const [email, setEmail] = useState("") // STATE TO STORAGE email
  const [password, setPassword] = useState("") // STORAGE PASSWORD 
  const navigate = useNavigate()

  async function handleSubmit(e) {


    e.preventDefault() 


    try {


      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST", // HTTP
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, 
          password: password 
        })
      })

    

      const data = await response.json() 

      if(!response.ok){ 
        alert(data.error || "Erro no login")
        return
      }
  

      localStorage.setItem("token", data.token) 

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

    
    <div className="login-container"> 

      <div className="login-box"> 




        <h1 className="login-title">Login</h1> 


        <form onSubmit={handleSubmit} className="form">

    <div className="input-group"> 
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="login-input"
          />
                      <span className="icon">✉</span> 


</div>

<div className="input-group"> 

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="login-input"
          />
            <span className="icon">🔒</span> 

</div>

<div className="options"> 
<label>
              <input type="checkbox"/> 
              Lembrar
            </label>

            <a href="#">Esqueci minha senha</a> 

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