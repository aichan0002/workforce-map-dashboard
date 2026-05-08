function TopBanner() {
  return (
    <header className="top-banner">
      <div className="notional-strip">NOTIONAL</div>
      <div className="title-bar">
        <div className="brand-mark" aria-hidden="true">
          <span className="brand-shield" />
          <span className="brand-node node-a" />
          <span className="brand-node node-b" />
          <span className="brand-node node-c" />
        </div>
        <div>
          <h1>組織人力態勢展示平台</h1>
          <p>ORGANIZATIONAL WORKFORCE SITUATION DISPLAY</p>
        </div>
        <div className="header-badge">展示原型</div>
      </div>
    </header>
  );
}

export default TopBanner;
