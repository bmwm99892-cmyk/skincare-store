import PageIntro from './PageIntro.jsx';
import CategorySection from '../components/CategorySection.jsx';

export default function Categories({ onSelectCategory, categories }) {
  return (
    <>
      <PageIntro
        index="02"
        eyebrow="BROWSE BY RITUAL"
        title={<>A routine for <em>every day.</em></>}
        description="Start with the step your skin is asking for. Find your feel-good place to begin."
      />
      <CategorySection onSelectCategory={onSelectCategory} categories={categories} />
    </>
  );
}
