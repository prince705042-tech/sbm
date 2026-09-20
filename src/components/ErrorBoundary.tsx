import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Swachh Campus Application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 font-sans text-stone-900">
          <div className="max-w-md w-full bg-white rounded-lg p-6 shadow-md border border-stone-300 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center border border-amber-300">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider border border-stone-200 mb-2 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Swachh Campus Recovery</span>
              </div>
              <h1 className="text-xl font-bold text-stone-900">
                Application Restored to Safe Mode
              </h1>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                An unexpected interface issue was intercepted. You can safely restore the application state.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-stone-50 rounded border border-stone-200 text-left">
                <div className="text-[10px] font-bold uppercase text-stone-500 font-mono">
                  Diagnostic Information
                </div>
                <div className="text-xs font-mono text-rose-700 mt-1 break-all">
                  {this.state.error.message || 'Unknown runtime error'}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-2.5 rounded bg-[#134E3A] hover:bg-[#0F3E2E] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Cache &amp; Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
