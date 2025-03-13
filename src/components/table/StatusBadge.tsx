
interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span 
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
        status === 'OK' ? 'bg-green-100 text-green-800' :
        status === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
        status === 'Pendiente' ? 'bg-amber-100 text-amber-800' :
        'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
