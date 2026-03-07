import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {

  const [email, setEmail] = useState("") // estado para armazenar email
  const [password, setPassword] = useState("") // estado para senha
  const navigate = useNavigate()

  async function handleSubmit(e) {


    e.preventDefault() // impede reload da página


    try {


      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST", // método HTTP
        headers: {
          "Content-Type": "application/json" // informa que estamos enviando JSON
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
    <div>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value) // atualiza estado
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value) // atualiza estado
          }}
        />

        <button
          type="submit"
          onClick={() => console.log("🖱 botão Entrar clicado")} // log do clique
        >
          Entrar
        </button>

      </form>

    </div>
  )
}

export default Login