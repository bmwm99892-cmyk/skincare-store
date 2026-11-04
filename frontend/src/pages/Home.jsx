import Hero from '../components/Hero.jsx';
import CategorySection from '../components/CategorySection.jsx';
import ProductSection from '../components/ProductSection.jsx';
import BrandStory from '../components/BrandStory.jsx';
import Benefits from '../components/Benefits.jsx';
import Newsletter from '../components/Newsletter.jsx';

export default function Home({
  products,
  productsLoading,
  categories,
  onSelectCategory,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onQuickView,
  onNavigate,
}) {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <CategorySection onSelectCategory={onSelectCategory} categories={categories} />
      <ProductSection
        products={products.slice(0, 4)}
        productsLoading={productsLoading}
        categories={categories}
        wishlist={wishlist}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        onQuickView={onQuickView}
        onNavigate={onNavigate}
        showFilters={false}
        title="A little something for"
        accent="your skin."
        description="A considered edit of feel-good essentials for your everyday ritual."
      />
      <BrandStory onNavigate={onNavigate} />
      <Benefits />
      <Newsletter />
    </>
  );
}
