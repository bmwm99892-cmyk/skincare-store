import PageIntro from './PageIntro.jsx';
import BrandStory from '../components/BrandStory.jsx';
import Benefits from '../components/Benefits.jsx';

export default function About({ onNavigate }) {
  return <>
    <PageIntro index="03" eyebrow="A LITTLE ABOUT US" title={<>Beauty begins with <em>care.</em></>} description="Meet NUDU: thoughtful little rituals, a gentler pace, and a feel-good moment in every day." />
    <BrandStory onNavigate={onNavigate} isPage />
    <Benefits />
    <section className="about-note"><span className="about-note-mark" aria-hidden="true">N</span><p>Keep it simple. Make it yours.<br /><em>Glow gently.</em></p><span>THE NUDU POINT OF VIEW</span></section>
  </>;
}
