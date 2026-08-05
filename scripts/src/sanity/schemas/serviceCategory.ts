import {fieldHelp} from './helpers';

const serviceCategory = {
  name: 'serviceCategory',
  title: 'Categorías de servicios',
  type: 'document',
  description:
    'Lista maestra de categorías. Se usan en el Catálogo y pueden asociarse a Servicios.',
  fields: [
    {
      name: 'title',
      title: 'Nombre de la categoría',
      type: 'string',
      description:
        'Nombre visible de la categoría. Ejemplo: Recepciones, Diseño editorial, Ambientación.',
      validation: (Rule: any) =>
        Rule.required().error('La categoría necesita un nombre.'),
    },
    {
      name: 'visible',
      title: 'Disponible para selección',
      type: 'boolean',
      initialValue: true,
      description:
        'Si está desactivada, la categoría no aparecerá como opción al editar elementos del catálogo. Los elementos que ya la usen no se afectan.',
    },
  ],
  preview: {
    select: {title: 'title', visible: 'visible'},
    prepare({title, visible}: {title?: string; visible?: boolean}) {
      return {
        title: title || 'Sin nombre',
        subtitle: visible === false ? 'Oculta' : 'Disponible',
      };
    },
  },
};

export default serviceCategory;
