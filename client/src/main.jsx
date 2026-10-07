import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * Top-level error boundary to catch runtime rendering errors.
 * Provides a readable error panel and a "Clear saved settings and reload" action.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Uncaught instrument runtime error:', error, errorInfo);
  }

  handleClearAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F1214] text-[#E6E3DA] font-mono p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-[#151A1D] border border-[#E5484D] rounded p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#E5484D]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5484D] animate-ping" />
              <h1 className="text-base font-bold uppercase tracking-wider">
                Instrument Runtime Exception
              </h1>
            </div>

            <p className="text-xs text-[#8A919A]">
              An unhandled rendering exception occurred in the instrument UI. You can review the trace below or reset the instrument state.
            </p>

            <div className="bg-[#0F1214] border border-[#262D31] p-3 rounded text-xs text-[#E5484D] overflow-x-auto whitespace-pre-wrap">
              {this.state.error?.toString() || 'Unknown error'}
            </div>

            {this.state.errorInfo?.componentStack && (
              <div className="bg-[#0F1214] border border-[#262D31] p-3 rounded text-[11px] text-[#8A919A] overflow-x-auto max-h-48 whitespace-pre-wrap">
                {this.state.errorInfo.componentStack}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleClearAndReload}
                className="px-4 py-2 bg-[#E5484D] text-[#0F1214] font-bold text-xs rounded hover:bg-[#E5484D]/90 transition"
              >
                Clear saved settings and reload
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#262D31] text-[#E6E3DA] font-bold text-xs rounded hover:bg-[#323B40] transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
