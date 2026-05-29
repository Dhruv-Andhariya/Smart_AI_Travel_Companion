import { Component, type ReactNode } from "react";

type Props = { children?: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6 text-center">
          <div className="glass-card max-w-lg rounded-[var(--radius-2xl)] p-8">
            <p className="mono-badge text-[0.72rem] text-[var(--accent-cyan)]">Trip AI</p>
            <h1 className="mt-4 font-display text-4xl text-[var(--text-primary)]">Something went wrong</h1>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              The interface hit an unexpected error. Refresh the page or return to the dashboard.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children as ReactNode;
  }
}