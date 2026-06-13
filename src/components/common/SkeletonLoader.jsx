export default function SkeletonLoader({ type = 'card', count = 3 }) {
  const renderSkeletons = () => {
    const items = Array.from({ length: count });

    switch (type) {
      case 'card':
        return items.map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 flex flex-col gap-4 overflow-hidden relative">
            <div className="w-full h-44 rounded-xl shimmer" />
            <div className="h-6 w-2/3 rounded shimmer" />
            <div className="h-4 w-full rounded shimmer" />
            <div className="h-4 w-5/6 rounded shimmer" />
            <div className="flex justify-between items-center mt-2">
              <div className="h-5 w-1/4 rounded shimmer" />
              <div className="h-10 w-1/3 rounded-xl shimmer" />
            </div>
          </div>
        ));

      case 'table':
        return (
          <div className="w-full space-y-4">
            {items.map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 glass-card rounded-xl">
                <div className="flex items-center gap-4 w-1/2">
                  <div className="w-10 h-10 rounded-full shimmer" />
                  <div className="space-y-2 w-2/3">
                    <div className="h-4 w-full rounded shimmer" />
                    <div className="h-3 w-1/2 rounded shimmer" />
                  </div>
                </div>
                <div className="h-6 w-20 rounded-full shimmer" />
                <div className="h-4 w-16 rounded shimmer" />
                <div className="h-8 w-8 rounded-lg shimmer" />
              </div>
            ))}
          </div>
        );

      case 'dashboard':
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="h-4 w-20 rounded shimmer" />
                  <div className="h-8 w-8 rounded-xl shimmer" />
                </div>
                <div className="h-8 w-16 rounded shimmer" />
                <div className="h-3 w-28 rounded shimmer" />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return <>{renderSkeletons()}</>;
}
