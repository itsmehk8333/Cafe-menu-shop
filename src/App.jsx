import React from 'react'
import Menu from './Components/Homepage/Homepage'
import RouterComponent from './Routes/RouterComponent'
import AdminPage from './Admin/AdminPage'
import AdminPanel from './Admin/AdminPage'
import { LoadingProvider } from './Components/Loading/useLoading'
import Loader from './Components/Loading/Loader'
import { SnackbarProvider } from './Components/Snackbar/SnacbarComponent'
import "typeface-merriweather";
import "typeface-lora";

function App() {

  return (
    <div>
      <LoadingProvider>
        <SnackbarProvider>
          <Loader />
          <RouterComponent />
        </SnackbarProvider>
      </LoadingProvider>

    </div>
  )
}

export default App