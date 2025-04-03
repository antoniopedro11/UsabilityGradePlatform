'use client';

import { useEffect } from 'react';

export function ErrorSuppressor() {
  useEffect(() => {
    // Função para remover os elementos do portal de erro do Next.js
    const removeErrorElements = () => {
      const elementsToRemove = [
        '[data-nextjs-toast]',
        '[data-nextjs-error-dialog]',
        'nextjs-portal',
        '#__next_error__',
        '[data-next-error-dialog]',
        '[data-next-toast]'
      ];
      
      elementsToRemove.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          element.remove();
        });
      });
    };

    // Chama a função imediatamente
    removeErrorElements();

    // Configura um observador de mutação para remover elementos que possam aparecer posteriormente
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          removeErrorElements();
          break; // Só precisamos chamar removeErrorElements uma vez por lote de mutações
        }
      }
    });

    // Observa o corpo do documento para quaisquer alterações
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Limpa o observador quando o componente for desmontado
    return () => {
      observer.disconnect();
    };
  }, []); // Executa apenas uma vez durante a montagem do componente

  return null; // Este componente não renderiza nada
}

export default ErrorSuppressor; 