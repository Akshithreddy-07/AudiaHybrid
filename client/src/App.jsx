import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ControlsProvider } from './context/ControlsContext.jsx';
import { AppFrame } from './components/layout/AppFrame.jsx';
import { AppRoutes } from './routes.jsx';

/**
 * Root Application component.
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <ControlsProvider>
      <BrowserRouter>
        <AppFrame>
          <AppRoutes />
        </AppFrame>
      </BrowserRouter>
    </ControlsProvider>
  );
}
