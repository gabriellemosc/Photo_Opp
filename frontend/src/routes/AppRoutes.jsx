import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Upload from "../pages/Upload"

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/auth/login" element={<Login />} /> {/* rota login */}
        
        <Route path="/upload" element={<Upload />} />

      </Routes>

    </BrowserRouter>

  )
}

export default AppRoutes