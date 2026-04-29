import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

interface SlideData {
  id: number;
  companyLogo: string;
  tag: string;
  title: string;
  description: string;
  mainImage: string;
  accentColor: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    companyLogo: "/assets/logo_dimcultura.png", // Usamos tu logo real
    tag: "Cursos Académicos",
    title: "Convierte el conocimiento en aprendizaje real",
    description:
      "Creamos cursos claros y prácticos a partir de tesis, documentos académicos y contenido especializado.",
    mainImage: "/assets/gruculcol.png",
    accentColor: "#2563eb" // El azul de tu landing
  },
  {
    id: 2,
    companyLogo: "/assets/logo_dimcultura.png",
    tag: "Educación Digital",
    title: "Una plataforma para aprender de forma moderna",
    description:
      "Organiza contenidos, materiales y rutas de aprendizaje en experiencias educativas simples, visuales y profesionales.",
    mainImage: "/assets/logo_dimcultura.png",
    accentColor: "#4f46e5"
  },
  {
    id: 3,
    companyLogo: "/assets/logo_dimcultura.png",
    tag: "Formación Profesional",
    title: "Cursos diseñados para crecer y aplicar",
    description: "Transformamos información compleja en formación útil para estudiantes, docentes, empresas y profesionales.",
    mainImage: "/assets/logo_mega.png",
    accentColor: "#0d9488"
  }
];

const EducationSlider: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[index];

  const textVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const imageVariants: Variants = {
    initial: { opacity: 0, scale: 0.9, filter: 'blur(20px)' },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: { opacity: 0, scale: 1.05, filter: 'blur(15px)', transition: { duration: 0.4 } }
  };

  return (
    <section className='flex items-center justify-center'>
      <section className="relative w-full p-4 z-20 max-w-6xl">
        <div className=" mx-auto ">
          <div className="flex flex-col md:flex-row gap-4 md:gap-20 justify-center items-center">
            {/* TEXTO */}
            <div className="relative  flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div key={`text-${currentSlide.id}`} className="space-y-6">

                  <motion.span
                    custom={1}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="inline-block p-2  rounded-full text-xs font-semibold"
                    style={{ backgroundColor: `${currentSlide.accentColor}15`, color: currentSlide.accentColor }}
                  >
                    {currentSlide.tag}
                  </motion.span>

                  <motion.h2
                    custom={2}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-3xl md:text-4xl font-semibold text-slate-900 leading-[1.1]"
                  >
                    {currentSlide.title}
                  </motion.h2>

                  <motion.p
                    custom={3}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-lg text-slate-600 leading-relaxed max-w-md"
                  >
                    {currentSlide.description}
                  </motion.p>

                  <motion.div custom={4} variants={textVariants} initial="initial" animate="animate" exit="exit" className="flex gap-4 ">
                    <button
                      className="rounded-2xl px-8 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: currentSlide.accentColor, boxShadow: `0 14px 36px -10px ${currentSlide.accentColor}60` }}
                    >
                      Comenzar gestión
                    </button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Barras de progreso alineadas con el estilo de tu página */}
              <div className=" gap-2 mt-12 lg:flex hidden">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: index === i ? '48px' : '12px',
                      backgroundColor: index === i ? currentSlide.accentColor : '#e2e8f0'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* IMAGEN CON ESTILO DE TARJETA (Mismo que tu Building Card) */}
            <div className="relative flex justify-center lg:justify-center items-center ">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${currentSlide.id}`}
                  variants={imageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="relative p-6 rounded-sm items-center justify-center flex   backdrop-blur-xl max-h-55 aspect-square min-h-50"
                >
                  <Image
                    src={currentSlide.mainImage}
                    alt={currentSlide.title}
                    width={300}
                    height={300}
                    className=" object-contain  "
                  />
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>
    </section>
  );
};

export default EducationSlider;