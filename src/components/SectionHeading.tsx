import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  className?: string;
}

/** عنوان قسم موحّد: نص تمهيدي + عنوان متدرّج + فاصل + مقدمة اختيارية */
export default function SectionHeading({ eyebrow, title, intro, className = 'text-center mb-12 md:mb-16' }: SectionHeadingProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <p className="section-eyebrow text-sm md:text-base mb-3">{eyebrow}</p>
      <h2 className="section-title text-3xl sm:text-4xl md:text-5xl mb-4">{title}</h2>
      <div className="divider mb-6" />
      {intro && <p className="section-intro text-lg sm:text-xl px-4">{intro}</p>}
    </motion.div>
  );
}
