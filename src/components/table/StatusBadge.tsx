
interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  // Normalize status to handle case insensitivity
  const normalizedStatus = status.toLowerCase();
  
  return (
    <span 
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        normalizedStatus === 'ok' ? 'bg-blue-100 text-blue-800' :
        normalizedStatus === 'en proceso' ? 'bg-amber-100 text-amber-800' :
        normalizedStatus === 'pendiente' ? 'bg-red-100 text-red-800' :
        normalizedStatus === 'nulo' ? 'bg-gray-200 text-gray-800' :
        normalizedStatus === 'en revision' ? 'bg-blue-600 text-white' :
        'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
