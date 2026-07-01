import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export default class LocalizedErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ""
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || "An unexpected rendering error occurred" };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Output rendering captured error:", error.name, error.message);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: "" });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[350px] bg-rose-50/50 rounded-2xl border border-dashed border-rose-200 text-center relative shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-rose-950 text-base">
            Output Rendering Error
          </h3>
          <p className="text-rose-700 text-xs mt-2 max-w-sm leading-relaxed">
            Something went wrong while rendering the simplified output markdown. The text may contain unsupported formatting structures.
          </p>
          <div className="mt-4 p-2 bg-rose-50 border border-rose-150 rounded text-[11px] font-mono text-rose-800 max-w-md break-all">
            Error: {this.state.errorMessage}
          </div>
          <button
            onClick={this.handleReset}
            className="mt-5 flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-medium text-xs rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Rendering Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
