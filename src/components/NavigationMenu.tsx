
import { Link, useLocation } from 'react-router-dom';
import { Home, ChartGantt, Table } from 'lucide-react';

const NavigationMenu = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link 
              to="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out 
                ${isActive('/') 
                  ? 'border-[#040c67] text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Home className="w-5 h-5 mr-2" />
              Inicio
            </Link>
            
            <Link 
              to="/gantt"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out 
                ${isActive('/gantt') 
                  ? 'border-[#040c67] text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <ChartGantt className="w-5 h-5 mr-2" />
              Carta Gantt
            </Link>
            
            <Link 
              to="/analysis"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out 
                ${isActive('/analysis') 
                  ? 'border-[#040c67] text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Table className="w-5 h-5 mr-2" />
              Análisis
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
