/**
 * Dynamic Fields Renderer
 * Renderiza campos dinámicos registrados por países
 */

'use client';

import React from 'react';
import { useDynamicFields } from '../registry/dynamicFieldsRegistry';
import { useClaimInfoStore } from '../store/claimInfoStore';

interface DynamicFieldsRendererProps {
  /** Sección donde renderizar ('policy' o 'claim') */
  section: 'policy' | 'claim';
  /** Indica si está en modo loading */
  isLoading?: boolean;
}

/**
 * Componente que renderiza todos los campos dinámicos de una sección
 */
export const DynamicFieldsRenderer: React.FC<DynamicFieldsRendererProps> = ({
  section,
  isLoading = false,
}) => {
  const { getFieldsBySection } = useDynamicFields();
  const { setDynamicFieldValue, getDynamicFieldValue } = useClaimInfoStore();

  // Obtener campos dinámicos de esta sección
  const dynamicFields = getFieldsBySection(section);

  if (dynamicFields.length === 0) {
    return null;
  }

  // Ordenar por posición
  const sortedFields = [...dynamicFields].sort((a, b) => {
    const posA = typeof a.position === 'number' ? a.position : 999;
    const posB = typeof b.position === 'number' ? b.position : 999;
    return posA - posB;
  });

  return (
    <>
      {sortedFields.map((field) => {
        const FieldComponent = field.component;
        const value = getDynamicFieldValue(field.id);

        return (
          <FieldComponent
            key={field.id}
            fieldId={field.id}
            config={field.config}
            value={value}
            onChange={(newValue) => setDynamicFieldValue(field.id, newValue)}
            isLoading={isLoading}
          />
        );
      })}
    </>
  );
};
