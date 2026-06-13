export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size] || sizeClasses.md} rounded-full border-t-emerald-500 border-r-transparent border-b-emerald-100 border-l-transparent animate-spin`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
}
