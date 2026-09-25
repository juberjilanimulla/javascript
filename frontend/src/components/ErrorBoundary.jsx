import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 text-red-700">
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <pre className="mt-2 text-sm">{String(this.state.error)}</pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}