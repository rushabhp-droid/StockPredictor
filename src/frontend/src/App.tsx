import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from './theme/darkTheme';
import { Layout } from './components/Layout';
import { PredictorPage } from './pages/PredictorPage';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Layout>
        <PredictorPage />
      </Layout>
    </ThemeProvider>
  );
}

export default App;