import type { CardGridBlock as CardGridBlockType } from '@/lib/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

interface CardGridBlockProps {
  block: CardGridBlockType;
}

export function CardGridBlock({ block }: CardGridBlockProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      {block.cards.map((card) => {
        const content = (
          <Card key={card.title} className="transition-shadow hover:shadow-md">
            {card.image && (
              <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
            )}
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            {card.link && (
              <CardContent>
                <span className="text-sm text-primary">View project &rarr;</span>
              </CardContent>
            )}
          </Card>
        );

        if (card.link) {
          return (
            <a key={card.title} href={card.link} className="no-underline">
              {content}
            </a>
          );
        }

        return content;
      })}
    </div>
  );
}
