import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  badge: string;
  image: string;
  detailsLink?: string;
  onBuyClick?: () => void;
  purchaseLink?: string;
}

const ProductCard = ({
  title,
  description,
  price,
  badge,
  image,
  detailsLink,
  onBuyClick,
  purchaseLink,
}: ProductCardProps) => {
  return (
    <article 
      className="bg-card rounded-2xl shadow-soft overflow-hidden border border-border/60 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-elevated"
      itemScope 
      itemType="https://schema.org/Product"
    >
      <div 
        className="aspect-[4/3] overflow-hidden"
        itemProp="image"
      >
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h2 className="text-2xl font-semibold mb-2" itemProp="name">
          {title}
        </h2>
        <p className="text-muted-foreground mb-4 flex-1" itemProp="description">
          {description}
        </p>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/40 px-4 py-2">
            <span 
              className="text-xl font-semibold" 
              itemProp="offers" 
              itemScope 
              itemType="https://schema.org/Offer"
            >
              <meta itemProp="priceCurrency" content="USD" />
              <span itemProp="price">{price}</span>
            </span>
            <span className="text-sm text-gold">{badge}</span>
          </div>
          <div className="flex gap-2">
            {onBuyClick ? (
              <Button variant="rose" size="sm" aria-label={`Buy ${title}`} onClick={onBuyClick}>
                Buy
              </Button>
            ) : purchaseLink ? (
              <Button variant="rose" size="sm" aria-label={`Buy ${title}`} asChild>
                <a href={purchaseLink}>
                  Buy
                </a>
              </Button>
            ) : (
              <Button variant="rose" size="sm" aria-label={`Buy ${title}`} disabled>
                Buy
              </Button>
            )}
            {detailsLink ? (
              <Button variant="sage" size="sm" aria-label={`Learn more about ${title}`} asChild>
                <Link to={detailsLink}>Details</Link>
              </Button>
            ) : (
              <Button variant="sage" size="sm" aria-label={`Learn more about ${title}`}>
                Details
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
