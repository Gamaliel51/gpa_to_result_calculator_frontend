import { Routes, Route } from 'react-router-dom'
import DashBoard from './pages/DashBoard'
import LoginPage from './pages/LoginPage'
import SignUp from './pages/SignUp'
import ProtectedRoute from './components/ProtectedRoutes'
import CgpaPage from './pages/CgpaCalcPage'
import SavedResults from './pages/SavedResults'



function App(){
  return(
    <>
      <div>
        <Routes>
          <Route path='/' element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/>
          <Route path='/cgpa' element={<ProtectedRoute><CgpaPage/></ProtectedRoute>}/>
          <Route path='/saved' element={<ProtectedRoute><SavedResults/></ProtectedRoute>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignUp/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
