import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StyleCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  selected: boolean;
  onClick: (id: string) => void;
}

const StyleCard = ({ id, name, description, imageUrl, selected, onClick }: StyleCardProps) => {
  return (
    <Card 
      className={cn(
        "border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors",
        selected && "border-primary"
      )}
      onClick={() => onClick(id)}
    >
      <div 
        className="h-32 bg-cover bg-center" 
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="p-3">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </Card>
  );
};

export default StyleCard;
