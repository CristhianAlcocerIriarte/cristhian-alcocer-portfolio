import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Expertise } from "@/components/Expertise";
import { Footer } from "@/components/Footer";
import { HashScroll } from "@/components/HashScroll";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { TestRunner } from "@/components/TestRunner";

export default function Home() {
  return (
    <>
      <HashScroll />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Expertise />
        <Experience />
        <Education />
        <Contact />
      </main>
      <Footer />
      <TestRunner />
    </>
  );
}
