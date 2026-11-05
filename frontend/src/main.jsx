import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react";
import { createBrowserRouter } from 'react-router-dom';
import { persistor } from "./redux/store";
import store from './redux/store.js'
import './index.css'
import App from './App.jsx'
import routes from './routes.jsx'

// Router is created ONCE at module scope. Creating it inside App() rebuilt it
// on every cart change, which remounted the page tree and made navigate()
// calls (e.g. to /order-success/:id) change the URL without changing the page.
const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App router={router} />
      </PersistGate>
    </Provider>


  </StrictMode>,
)
