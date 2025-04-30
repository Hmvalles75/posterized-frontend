import { Card, CardContent } from "@/components/ui/card";

interface ExampleItem {
  id: number;
  imageUrl: string;
  title: string;
  style: string;
}

const examples: ExampleItem[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "Basketball",
    style: "Hero Mode"
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "Soccer",
    style: "Magazine Cover"
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1560089000-7433a4ebbd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "Baseball",
    style: "Arcade Legends"
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1551989745-347c28b620e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    title: "Tennis",
    style: "Motion Glitch"
  }
];

const ExamplesPanel = () => {
  return (
    <Card id="examples">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Example Transformations</h2>
        <p className="text-gray-500 mb-6">See what our AI can do with sports photos.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {examples.map((example) => (
            <div key={example.id}>
              <div className="relative overflow-hidden rounded-lg group">
                <img 
                  src={example.imageUrl} 
                  alt={`${example.title} player with ${example.style}`}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gray-900/75 text-white p-2 text-xs">
                  <span className="font-medium">
                    {example.title} - {example.style}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button className="text-primary font-medium text-sm hover:underline">
            View More Examples
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamplesPanel;
