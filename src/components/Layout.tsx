import type { ReactNode } from "react";
import HeaderWithSidebar from "./HeaderWithSidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <HeaderWithSidebar />
      <div className="main-content">
        <main className="content">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
