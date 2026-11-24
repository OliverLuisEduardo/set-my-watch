import { createContext, useContext } from 'react';
import { TEXTOS, type Textos } from './textos';

export const ContextoTextos = createContext<Textos>(TEXTOS['pt-BR']);

/** Textos do idioma ativo. */
export const useTextos = () => useContext(ContextoTextos);
