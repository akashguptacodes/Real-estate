import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketContextProvider } from './context/SocketContext.jsx'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthContextProvider>
          <SocketContextProvider>
            <App />
            <ToastContainer />
          </SocketContextProvider>
        </AuthContextProvider>
    </BrowserRouter>
)