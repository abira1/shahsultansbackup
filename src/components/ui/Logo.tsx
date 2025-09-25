import React from 'react';
import { Link } from 'react-router-dom';
interface LogoProps {
  navbarLogo?: boolean;
}
const Logo: React.FC<LogoProps> = ({
  navbarLogo = false
}) => {
  return <Link to="/" className="flex items-center">
      <div className="flex items-center">
        <img src="https://i.postimg.cc/KzQq5SY8/405825909-122104265906126286-8399617709455200420-n.png" alt="Shah Sultan's IELTS Academy Logo" className="h-10 md:h-12" />
        <div className="ml-2">
          <h1 className={`text-lg md:text-xl font-bold ${navbarLogo ? 'text-primary' : 'text-white'}`}>
            Shah Sultan's
          </h1>
          <p className="text-xs text-accent font-medium">IELTS ACADEMY</p>
        </div>
      </div>
    </Link>;
};
export default Logo;