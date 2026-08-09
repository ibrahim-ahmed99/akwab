import { Component } from 'react';

/**
 * Catches render-time errors anywhere below it and shows a friendly fallback
 * instead of a blank white page. Data/network errors are handled per-page; this
 * is the last resort for unexpected component crashes.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        dir="rtl"
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 24,
          textAlign: 'center',
          fontFamily: 'Cairo, sans-serif',
        }}
      >
        <div style={{ fontSize: 56 }}>🫖</div>
        <h1 style={{ fontFamily: 'Amiri, serif', fontSize: 28, color: '#3D2540', margin: 0 }}>
          حدث خطأ غير متوقع
        </h1>
        <p style={{ color: '#6B4E6E', maxWidth: 420, lineHeight: 1.8 }}>
          نأسف على الإزعاج — حصلت مشكلة أثناء عرض هذه الصفحة. جرّب إعادة التحميل.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={this.handleReload}
            style={{
              background: '#E0478A', color: '#fff', border: 'none',
              borderRadius: 999, padding: '11px 26px', fontWeight: 700,
              fontFamily: 'Cairo, sans-serif', cursor: 'pointer', fontSize: 15,
            }}
          >
            إعادة تحميل الصفحة
          </button>
          <a
            href="/"
            style={{
              background: '#fff', color: '#3D2540', border: '2px solid #F0E3E8',
              borderRadius: 999, padding: '9px 26px', fontWeight: 700, fontSize: 15,
            }}
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    );
  }
}
