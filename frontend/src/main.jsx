import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Diagnostic safety net for unhandled client errors
window.addEventListener('error', (event) => {
  console.error('Global client error:', event.error || event.message);
  const root = document.getElementById('root');
  if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
    root.innerHTML = `
      <div style="padding: 30px; font-family: sans-serif; background: #FEF2F2; border: 2px solid #EF4444; margin: 24px; border-radius: 8px; color: #991B1B;">
        <h2 style="margin-top: 0;">BhoomiDrishti AI: Client Initialization Error</h2>
        <p>An unexpected script error occurred during startup:</p>
        <pre style="background: #FFF; padding: 12px; border-radius: 6px; border: 1px solid #FCA5A5; overflow-x: auto;">${event.error ? (event.error.stack || event.error.message) : event.message}</pre>
        <button onclick="window.location.reload()" style="background: #0B3B60; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; margin-top: 12px;">
          Reload Application
        </button>
      </div>
    `;
  }
});

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', background: '#FEF2F2', border: '2px solid #EF4444', margin: '24px', borderRadius: '8px', color: '#991B1B' }}>
          <h2 style={{ marginTop: 0 }}>BhoomiDrishti AI: Component Render Exception</h2>
          <p>The interface encountered an unhandled exception:</p>
          <pre style={{ background: '#FFF', padding: '12px', borderRadius: '6px', border: '1px solid #FCA5A5', overflowX: 'auto' }}>
            {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            style={{ background: '#0B3B60', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, marginTop: '12px' }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
}
