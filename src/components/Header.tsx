
import { useState, useEffect } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  date?: string;
}

const Header = ({ title, subtitle, date }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 py-6 px-8 transition-all duration-500 
        ${scrolled ? 'glass-panel shadow-md py-4' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="animate-fade-in">
            <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          
          {date && (
            <div className={`transition-all duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-sm font-medium px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground">
                {date}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
