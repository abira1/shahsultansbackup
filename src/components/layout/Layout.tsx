import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
  minimal?: boolean;
  userRole?: 'student' | 'teacher' | 'admin';
}
const Layout: React.FC<LayoutProps> = ({
  children,
  isLoggedIn = false,
  minimal = false,
  userRole = 'student'
}) => {
  return <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar isLoggedIn={isLoggedIn} minimal={minimal} userRole={userRole} />
      <main className="flex-grow">{children}</main>
      {!minimal && <Footer />}
    </div>;
};
export default Layout;