import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#060610",
            color: "#fff",
            flexDirection: "column",
          }}
        >
          <h1 style={{ fontSize: 24 }}>🚨 Something went wrong</h1>
          <p style={{ color: "#aaa", marginTop: 10 }}>
            {this.state.error?.message}
          </p>

          <button
            onClick={this.handleReload}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg,#00ffa3,#00c9ff)",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}