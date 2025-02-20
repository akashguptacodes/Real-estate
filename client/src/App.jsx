import './layout.scss'
import './index.css'
import Navbar from './components/navbar/Navbar'
import { Routes, Route } from 'react-router-dom'
import Agents from './pages/Agents'
import Contacts from './pages/Contacts'
import About from './pages/About'
import Home from './pages/Home'
import List from './pages/List'
import SinglePage from './pages/SinglePage'
import ProfilePage from './pages/ProfilePage'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfileUpdatePage from './pages/profileUpdatePage'
import PrivateRoute from './components/privateRoute/PrivateRoute'
import ChangePassword from './pages/ChangePassword'
import NewPostPage from './pages/NewPostPage'

function App() {

  return (
    <div className='layout'>
      <div className='navbar'>
        <Navbar/>
      </div>
      <div className='content'>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/list/:unique" element={
            <PrivateRoute>
              <SinglePage />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <ProfilePage/>
            </PrivateRoute>
          } />
          <Route path="/profile/update" element={
            <PrivateRoute>
              <ProfileUpdatePage />
            </PrivateRoute>
          } />
          <Route path="/profile/update/changepassword" element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          } />
          <Route path="/addnewpost" element={
            <PrivateRoute>
              <NewPostPage />
            </PrivateRoute>
          } />
      </Routes>
      </div>
      {/* <div>
        
      </div> */}
    </div>
  )
}

export default App
