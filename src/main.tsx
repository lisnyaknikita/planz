import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import App from './App.tsx'

import './assets/styles/global.scss'
import './assets/styles/reset.scss'
import './assets/styles/variables.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<BrowserRouter>
		<React.StrictMode>
			<>
				<div>
					<Toaster />
				</div>
				<App />
			</>
		</React.StrictMode>
	</BrowserRouter>
)
