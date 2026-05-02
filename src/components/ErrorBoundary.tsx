import { Component, type ReactNode } from 'react';
import { resetSave } from '../game/saveSystem';

interface Props { children: ReactNode; }
interface State { hasError: boolean; message: string; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  override componentDidCatch(error: Error) {
    console.error('Tiny Terra crashed:', error);
  }

  override render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main style={{ minHeight: '100vh', padding: 24, color: '#e9fff0', background: '#102726' }}>
        <h2>Tiny Terra needs a restart</h2>
        <p>We hit a runtime error. You can reset local save and continue.</p>
        <p style={{ opacity: 0.8 }}>{this.state.message}</p>
        <button onClick={() => { resetSave(); window.location.reload(); }}>Reset Save & Reload</button>
      </main>
    );
  }
}
