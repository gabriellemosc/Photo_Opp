import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "../pages/Login"
import Upload from "../pages/Upload"
import Result from "../pages/Result"
function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/auth/login" element={<Login />} /> {/* rota login */}

        <Route path="/upload" element={<Upload />} />

        <Route path="/result" element={<Result />} />

      </Routes>

    </BrowserRouter>

  )
}

export default AppRoutes