import { specializations, Specialization } from '@/data/advocates';

interface SpecializationFilterProps {
  selected: string;
  onChange: (value: string) => void;
}

const SpecializationFilter = ({ selected, onChange }: SpecializationFilterProps) => {
  const getButtonClass = (value: string) => {
    const isSelected = selected === value;
    const baseClass = 'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 cursor-pointer';
    
    if (isSelected) {
      return `${baseClass} bg-primary text-primary-foreground border-primary shadow-md`;
    }
    return `${baseClass} bg-card border-border hover:border-primary/30 hover:shadow-sm`;
  };

  return (
    <div className="py-8">
      <h2 className="font-serif text-2xl font-semibold text-center mb-6">
        Browse by Specialization
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {specializations.map((spec) => (
          <button
            key={spec.value}
            onClick={() => onChange(spec.value)}
            className={getButtonClass(spec.value)}
          >
            <span className="text-2xl">{spec.icon}</span>
            <span className="text-sm font-medium text-center leading-tight">
              {spec.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpecializationFilter;
