import PageIntro from './PageIntro.jsx';
import ProductSection from '../components/ProductSection.jsx';

export default function Shop({
  products,
  productsLoading,
  categories,
  activeCategory,
  onSelectCategory,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
}) {
  return (
    <>
      <PageIntro
        index="01"
        eyebrow="THE NUDU COLLECTION"
        title={<>Find your next <em>favourite.</em></>}
        description="Thoughtful skincare essentials for the little moments that make a day feel like yours."
      />
      <ProductSection
        products={products}
        productsLoading={productsLoading}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={onSelectCategory}
        wishlist={wishlist}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        onQuickView={onQuickView}
        title="The complete edit"
        accent="for your skin."
        description="A little care, chosen just for you."
      />
    </>
  );
}
