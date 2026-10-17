export type ProviderStatus = "approved" | "pending" | "suspended";
export type SubscriptionStatus = "active" | "cancelled" | "inactive";

export interface Provider {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  city: string;
  services: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  status: ProviderStatus;
  subscription: SubscriptionStatus;
  email: string;
  phone: string;
  initials: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  { id: "hogar", name: "Hogar y construcción", description: "Cuida y transforma tus espacios." },
  { id: "educacion", name: "Educación", description: "Aprende algo nuevo, a tu ritmo." },
  { id: "salud", name: "Salud y bienestar", description: "Encuentra apoyo para sentirte mejor." },
  { id: "negocios", name: "Negocios y finanzas", description: "Dale a tu negocio el siguiente impulso." },
  { id: "transporte", name: "Transporte", description: "Conecta personas, entregas y destinos." },
  { id: "tecnologia", name: "Tecnología", description: "Soluciones digitales que te simplifican la vida." },
  { id: "inmuebles", name: "Inmuebles", description: "Descubre tu próximo espacio." },
  { id: "gastronomia", name: "Gastronomía", description: "Sabores que hacen cada ocasión especial." },
  { id: "agro", name: "Agro y producción", description: "Ideas y servicios para cultivar mejor." },
  { id: "otros", name: "Otros servicios", description: "Talento para lo que tienes en mente." },
];

export const cities = ["Santo Domingo", "Santiago", "Punta Cana", "La Romana"];

type ProviderSeed = Omit<Provider, "email" | "phone">;

const providerSeeds: ProviderSeed[] = [
  {
    id: "p01", name: "Nido Hogar", tagline: "Pequeños arreglos. Grandes cambios.",
    description: "Un equipo ficticio de especialistas en mantenimiento residencial. Coordinamos cada visita con claridad, cuidamos tus espacios y te explicamos el trabajo antes de empezar.",
    category: "hogar", city: "Santo Domingo", services: ["Plomería y reparación de fugas", "Pintura de interiores", "Mantenimiento del hogar"],
    rating: 4.9, reviewCount: 38, verified: true, status: "approved", subscription: "active", initials: "NH", color: "var(--color-category-hogar)",
  },
  {
    id: "p02", name: "Voltio Estudio", tagline: "Energía bien conectada.",
    description: "Servicio ficticio de instalaciones eléctricas para hogares y pequeños comercios. Revisamos cada detalle para que tus proyectos funcionen con confianza.",
    category: "hogar", city: "Santiago", services: ["Electricista residencial", "Instalación de iluminación", "Revisión de paneles eléctricos"],
    rating: 4.8, reviewCount: 24, verified: true, status: "approved", subscription: "active", initials: "VE", color: "var(--color-category-hogar)",
  },
  {
    id: "p03", name: "Espacio Palma", tagline: "Tu espacio, con una nueva mirada.",
    description: "Estudio ficticio de diseño y decoración con inspiración tropical. Creamos propuestas prácticas para renovar habitaciones, terrazas y espacios de trabajo.",
    category: "hogar", city: "Punta Cana", services: ["Diseño de interiores", "Decoración residencial", "Planificación de remodelaciones"],
    rating: 4.9, reviewCount: 17, verified: true, status: "approved", subscription: "active", initials: "EP", color: "var(--color-category-hogar)",
  },
  {
    id: "p04", name: "Aula Brisa", tagline: "Cada aprendizaje abre una puerta.",
    description: "Proyecto educativo ficticio con tutorías cercanas y recursos adaptados a cada estudiante. Acompañamos el proceso de aprendizaje con paciencia y estructura.",
    category: "educacion", city: "La Romana", services: ["Tutorías de matemáticas", "Refuerzo escolar", "Preparación para exámenes"],
    rating: 4.9, reviewCount: 32, verified: true, status: "approved", subscription: "active", initials: "AB", color: "var(--color-category-educacion)",
  },
  {
    id: "p05", name: "Habla Claro", tagline: "Un idioma nuevo, más posibilidades.",
    description: "Academia ficticia de idiomas con clases prácticas para estudiantes y profesionales. La conversación y las situaciones cotidianas guían cada encuentro.",
    category: "educacion", city: "Santo Domingo", services: ["Clases de inglés", "Inglés para negocios", "Conversación en francés"],
    rating: 4.7, reviewCount: 21, verified: true, status: "approved", subscription: "active", initials: "HC", color: "var(--color-category-educacion)",
  },
  {
    id: "p06", name: "Taller Curioso", tagline: "Aprender haciendo, crear sin límites.",
    description: "Espacio ficticio de talleres creativos y educación tecnológica. Proponemos actividades para descubrir habilidades y convertir ideas en proyectos.",
    category: "educacion", city: "Santiago", services: ["Talleres de arte", "Robótica educativa", "Clases de música"],
    rating: 4.8, reviewCount: 16, verified: false, status: "approved", subscription: "active", initials: "TC", color: "var(--color-category-educacion)",
  },
  {
    id: "p07", name: "Pausa Bienestar", tagline: "Haz espacio para sentirte bien.",
    description: "Centro de bienestar ficticio con acompañamiento personalizado y hábitos sostenibles. Este perfil es de demostración y no ofrece atención clínica real.",
    category: "salud", city: "Punta Cana", services: ["Orientación de bienestar", "Sesiones de relajación", "Hábitos saludables"],
    rating: 4.9, reviewCount: 28, verified: true, status: "approved", subscription: "active", initials: "PB", color: "var(--color-category-salud)",
  },
  {
    id: "p08", name: "Movimiento Vivo", tagline: "Un paso a la vez, a tu ritmo.",
    description: "Equipo ficticio dedicado al movimiento y el acondicionamiento físico. Diseñamos rutinas adaptadas a objetivos cotidianos. No presta servicios clínicos reales.",
    category: "salud", city: "La Romana", services: ["Entrenamiento personal", "Movilidad y estiramiento", "Acondicionamiento físico"],
    rating: 4.8, reviewCount: 19, verified: true, status: "approved", subscription: "active", initials: "MV", color: "var(--color-category-salud)",
  },
  {
    id: "p09", name: "Balance Nutre", tagline: "Bienestar que encaja en tu día.",
    description: "Perfil ficticio sobre organización de hábitos de alimentación y bienestar. Toda su información es ilustrativa; no representa un profesional ni atención real.",
    category: "salud", city: "Santo Domingo", services: ["Educación alimentaria", "Organización de menús", "Talleres de bienestar"],
    rating: 4.7, reviewCount: 26, verified: true, status: "approved", subscription: "active", initials: "BN", color: "var(--color-category-salud)",
  },
  {
    id: "p10", name: "Cuenta Clara", tagline: "Números en orden. Ideas en marcha.",
    description: "Firma ficticia que acompaña a pequeños negocios en la organización de sus números. Traducimos la información contable en decisiones fáciles de entender.",
    category: "negocios", city: "Santiago", services: ["Asesoría contable", "Organización financiera", "Presupuestos para pymes"],
    rating: 4.9, reviewCount: 41, verified: true, status: "approved", subscription: "active", initials: "CC", color: "var(--color-category-negocios)",
  },
  {
    id: "p11", name: "Marca Marea", tagline: "Marcas con algo que contar.",
    description: "Estudio ficticio de estrategia y comunicación para negocios en crecimiento. Trabajamos conceptos claros, piezas útiles y una presencia coherente.",
    category: "negocios", city: "Punta Cana", services: ["Identidad de marca", "Marketing digital", "Gestión de redes sociales"],
    rating: 4.8, reviewCount: 23, verified: true, status: "approved", subscription: "active", initials: "MM", color: "var(--color-category-negocios)",
  },
  {
    id: "p12", name: "Impulso Oficina", tagline: "Más orden para llegar más lejos.",
    description: "Consultoría ficticia de procesos y apoyo administrativo. Ayudamos a documentar tareas, organizar equipos y establecer prioridades alcanzables.",
    category: "negocios", city: "La Romana", services: ["Consultoría de procesos", "Asistencia administrativa", "Planificación comercial"],
    rating: 4.6, reviewCount: 12, verified: false, status: "approved", subscription: "cancelled", initials: "IO", color: "var(--color-category-negocios)",
  },
  {
    id: "p13", name: "Ruta Ligera", tagline: "Cada entrega tiene un destino.",
    description: "Servicio ficticio de mensajería y logística urbana para pequeños comercios. Coordinación sencilla para documentos y paquetes de tamaño reducido.",
    category: "transporte", city: "Santo Domingo", services: ["Mensajería urbana", "Entrega de paquetes", "Logística para comercios"],
    rating: 4.8, reviewCount: 35, verified: true, status: "approved", subscription: "active", initials: "RL", color: "var(--color-category-transporte)",
  },
  {
    id: "p14", name: "Trayecto Azul", tagline: "Tu próxima parada empieza aquí.",
    description: "Operador ficticio de traslados y transporte programado. Diseñamos rutas y horarios para actividades, grupos y necesidades de movilidad.",
    category: "transporte", city: "Santiago", services: ["Traslados programados", "Transporte de grupos", "Rutas para eventos"],
    rating: 4.7, reviewCount: 18, verified: true, status: "approved", subscription: "active", initials: "TA", color: "var(--color-category-transporte)",
  },
  {
    id: "p15", name: "Pixel Naranja", tagline: "De una buena idea a una gran web.",
    description: "Estudio digital ficticio que crea sitios claros, rápidos y fáciles de usar. Acompañamos a negocios desde la idea inicial hasta su presencia en internet.",
    category: "tecnologia", city: "Santo Domingo", services: ["Diseño web", "Tiendas en línea", "Desarrollo de aplicaciones"],
    rating: 4.9, reviewCount: 44, verified: true, status: "approved", subscription: "active", initials: "PN", color: "var(--color-category-tecnologia)",
  },
  {
    id: "p16", name: "Nodo Soporte", tagline: "La tecnología, de tu lado.",
    description: "Equipo ficticio de asistencia tecnológica para hogares y oficinas. Diagnóstico, mantenimiento y ayuda para que tus herramientas funcionen mejor.",
    category: "tecnologia", city: "La Romana", services: ["Soporte técnico", "Reparación de computadoras", "Instalación de redes"],
    rating: 4.8, reviewCount: 29, verified: true, status: "approved", subscription: "active", initials: "NS", color: "var(--color-category-tecnologia)",
  },
  {
    id: "p17", name: "Llave Coral", tagline: "Un nuevo espacio para tu historia.",
    description: "Agencia inmobiliaria ficticia con opciones residenciales y comerciales de muestra. Te orientamos para comparar espacios según tus prioridades.",
    category: "inmuebles", city: "Punta Cana", services: ["Alquiler de apartamentos", "Asesoría inmobiliaria", "Búsqueda de locales"],
    rating: 4.8, reviewCount: 22, verified: true, status: "approved", subscription: "active", initials: "LC", color: "var(--color-category-inmuebles)",
  },
  {
    id: "p18", name: "Habita Norte", tagline: "Encuentra el lugar que va contigo.",
    description: "Servicio inmobiliario ficticio que organiza opciones y recorridos ilustrativos. Acompañamiento cercano para explorar la próxima etapa de tu negocio o familia.",
    category: "inmuebles", city: "Santiago", services: ["Venta de propiedades", "Alquiler residencial", "Administración de inmuebles"],
    rating: 4.7, reviewCount: 15, verified: true, status: "approved", subscription: "active", initials: "HN", color: "var(--color-category-inmuebles)",
  },
  {
    id: "p19", name: "Mesa Canela", tagline: "El sabor de compartir algo especial.",
    description: "Cocina ficticia para celebraciones y encuentros de equipo. Combinamos menús de inspiración local, presentación cuidada y opciones para cada ocasión.",
    category: "gastronomia", city: "Punta Cana", services: ["Catering para eventos", "Menús corporativos", "Cocina para celebraciones"],
    rating: 4.9, reviewCount: 37, verified: true, status: "approved", subscription: "active", initials: "MC", color: "var(--color-category-gastronomia)",
  },
  {
    id: "p20", name: "Miga de Sol", tagline: "Hecho para alegrar tu mesa.",
    description: "Taller gastronómico ficticio con repostería y panes artesanales de muestra. Cada propuesta se imagina para acompañar momentos cotidianos y celebraciones.",
    category: "gastronomia", city: "La Romana", services: ["Repostería por encargo", "Panadería artesanal", "Postres para restaurante"],
    rating: 4.8, reviewCount: 31, verified: true, status: "approved", subscription: "active", initials: "MS", color: "var(--color-category-gastronomia)",
  },
  {
    id: "p21", name: "Raíz Verde", tagline: "Ideas que crecen desde la tierra.",
    description: "Proyecto ficticio de jardinería productiva y huertos urbanos. Acompañamos la planificación de pequeños espacios de cultivo con ideas sencillas.",
    category: "agro", city: "Santo Domingo", services: ["Diseño de huertos urbanos", "Jardinería", "Sistemas de riego"],
    rating: 4.7, reviewCount: 14, verified: true, status: "approved", subscription: "active", initials: "RV", color: "var(--color-category-agro)",
  },
  {
    id: "p22", name: "Surco Futuro", tagline: "Un campo lleno de posibilidades.",
    description: "Iniciativa ficticia de asesoría de producción y organización agrícola. Perfil pendiente de revisión dentro de la demostración administrativa.",
    category: "agro", city: "Santiago", services: ["Planificación de cultivos", "Asesoría agrícola", "Organización de producción"],
    rating: 0, reviewCount: 0, verified: false, status: "pending", subscription: "inactive", initials: "SF", color: "var(--color-category-agro)",
  },
  {
    id: "p23", name: "Instante Estudio", tagline: "Historias que merecen quedarse.",
    description: "Estudio fotográfico ficticio para retratos, productos y eventos. Creamos propuestas visuales que conservan la personalidad de cada historia.",
    category: "otros", city: "Punta Cana", services: ["Fotografía de producto", "Retratos profesionales", "Fotografía para eventos"],
    rating: 4.9, reviewCount: 27, verified: true, status: "approved", subscription: "active", initials: "IE", color: "var(--color-category-otros)",
  },
  {
    id: "p24", name: "Detalle Papel", tagline: "Pequeños detalles que dicen mucho.",
    description: "Taller ficticio de papelería y personalización para eventos. Este perfil está suspendido como ejemplo del flujo de moderación de la plataforma.",
    category: "otros", city: "La Romana", services: ["Papelería personalizada", "Invitaciones", "Detalles para eventos"],
    rating: 4.5, reviewCount: 8, verified: false, status: "suspended", subscription: "active", initials: "DP", color: "var(--color-category-otros)",
  },
];

/** Every name, rating, review and contact is invented for the local demonstration. */
export const providers: Provider[] = providerSeeds.map((provider, index) => ({
  ...provider,
  email: `demo.${provider.id}@example.test`,
  phone: `CONTACTO-DEMO-${String(index + 1).padStart(2, "0")}`,
}));
