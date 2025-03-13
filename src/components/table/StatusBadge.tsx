
interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span 
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        status === 'OK' ? 'bg-blue-100 text-blue-800' :
        status === 'En Proceso' ? 'bg-amber-100 text-amber-800' :
        status === 'Pendiente' ? 'bg-red-100 text-red-800' :
        status === 'Nulo' ? 'bg-gray-200 text-gray-800' :
        status === 'En Revision' ? 'bg-sky-100 text-sky-800' :
        'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
