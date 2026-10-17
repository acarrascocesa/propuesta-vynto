import { House, GraduationCap, HeartPulse, BriefcaseBusiness, CarFront, Laptop, Building2, Utensils, Sprout, Shapes, type LucideIcon } from 'lucide-react';
export const categoryIcons: Record<string, LucideIcon> = {
  hogar: House, educacion: GraduationCap, salud: HeartPulse, negocios: BriefcaseBusiness,
  transporte: CarFront, tecnologia: Laptop, inmuebles: Building2, gastronomia: Utensils,
  agro: Sprout, otros: Shapes,
};
export const categoryColors: Record<string, string> = {
  hogar: 'var(--color-category-hogar)', educacion: 'var(--color-category-educacion)',
  salud: 'var(--color-category-salud)', negocios: 'var(--color-category-negocios)',
  transporte: 'var(--color-category-transporte)', tecnologia: 'var(--color-category-tecnologia)',
  inmuebles: 'var(--color-category-inmuebles)', gastronomia: 'var(--color-category-gastronomia)',
  agro: 'var(--color-category-agro)', otros: 'var(--color-category-otros)',
};
