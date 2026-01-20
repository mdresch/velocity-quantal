import React from 'react';

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: any) {
    // TODO: integrate with monitoring (Sentry, Application Insights, etc.)
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl text-center rounded-2xl border border-[#2e3244] bg-[#161821] p-8">
            <h2 className="text-2xl font-bold text-[#f8fafc]">Something went wrong</h2>
            <p className="mt-2 text-[#94a3b8]">An unexpected error occurred. Try refreshing the page or contact support.</p>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
