import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Idioma = 'es' | 'jopara';

const IDIOMA_KEY = '@sphynx/idioma';

type Traducciones = typeof traducciones.es;
type Clave = keyof Traducciones;

const traducciones = {
  es: {
    'bottom.inicio': 'Inicio',
    'bottom.progreso': 'Progreso',
    'bottom.perfil': 'Perfil',
    'bottom.ajustes': 'Ajustes',
    'header.atras': 'Atrás',
    'inicio.titulo': 'UNIDADES TEMÁTICAS\nDE APRENDIZAJE',
    'inicio.comenzar': 'Comenzar',
    'inicio.proximamente': 'Próximamente',
    'unidad.aprender': 'Aprender',
    'unidad.experimentar': 'Experimentar (Jugar)',
    'unidad.ejercicios': 'Ejercicios',
    'teoria.titulo': 'TEORÍA',
    'teoria.ejercicios': 'EJERCICIOS',
    'teoria.back': 'Back page',
    'teoria.fuente': 'Fuente: Cuadernillo MEC · Física 3er curso',
    'niveles.ejercicios': 'Ejercicios',
    'niveles.tema': 'TEMA',
    'niveles.seleccion': 'Selección',
    'niveles.empezar': 'Empezar',
    'niveles.completado': '✅ Completado',
    'niveles.activo': '▶ ¡Nde turno!',
    'niveles.bloqueado': '🔒 Bloqueado',
    'subtemas.bloqueado': 'Completá el nivel anterior para desbloquear',
    'leccion.siguiente': 'Siguiente',
    'leccion.finalizar': 'Finalizar',
    'leccion.correcto': '✅ ¡Iporã! Correcto',
    'leccion.error': '❌ Ndahaʼéi... ¡Probá jey!',
    'leccion.volver': 'Volver',
    'leccion.sinPreguntas': 'Sin preguntas aún',
    'progreso.titulo': 'Nde progreso',
    'progreso.subtitulo': 'Peteĩ ára de racha, peteĩ logro jahupyty',
    'progreso.racha': 'días de racha',
    'progreso.xp': 'XP total (+10 por acierto)',
    'progreso.detalle': 'aciertos / intentos',
    'progreso.lecciones': 'lecciones listas',
    'progreso.seguir': 'Seguir aprendiendo',
    'perfil.estudiante': 'Estudiante',
    'perfil.sub': 'Cada día, peteĩ logro pyahu',
    'perfil.racha': 'Racha',
    'perfil.xp': 'XP Total',
    'perfil.aciertos': 'aciertos',
    'perfil.editar': 'Editar perfil',
    'perfil.tituloEdicion': 'Editar perfil',
    'perfil.nombre': 'Nombre',
    'perfil.foto': 'Foto de perfil',
    'perfil.elegirFoto': 'Elegir foto del dispositivo',
    'perfil.elegiMascota': 'O elegí una mascota',
    'perfil.guardar': 'Guardar',
    'perfil.cancelar': 'Cancelar',
    'perfil.actualizado': 'Perfil actualizado',
    'perfil.actualizadoDesc': '¡Listo! Tu perfil quedó guardado.',
    'ajustes.titulo': 'Ajustes',
    'ajustes.idioma': 'Idioma Jopara',
    'ajustes.idiomaDescJopara': 'Preguntas en guaraní',
    'ajustes.idiomaDescEs': 'Preguntas en español',
    'ajustes.sonido': 'Sonido',
    'ajustes.sonidoOn': 'Activado',
    'ajustes.sonidoOff': 'Silenciado',
    'ajustes.servidor': 'Servidor IA',
    'ajustes.servidorDesc': 'IP de tu PC con el backend (cambiala en cada Wi-Fi)',
    'ajustes.servidorPlaceholder': 'http://192.168.1.5:8000',
    'ajustes.guardar': 'Guardar',
    'ajustes.guardadoDesc': 'Servidor guardado. Probá el chat de SPHYNX IA.',
    'ajustes.verPresentacion': 'Ver presentación',
    'ajustes.verPresentacionDesc': 'Bienvenida del robot de nuevo',
    'ajustes.creditos': 'Créditos y referencias',
    'ajustes.creditosDesc': 'Fuentes, licencias y atribuciones',
    'ajustes.proyecto': 'Proyecto Sphynx',
    'ajustes.proyectoDesc': 'Abrir página oficial',
    'ajustes.borrar': 'Borrar progreso',
    'ajustes.borrarConfirm': '¿Seguro? Se eliminarán las lecciones completadas de este dispositivo.',
    'ajustes.borrarOk': 'Progreso borrado. ¡A empezar de nuevo!',
    'bienvenida.paso1': '¡Mbaʼéichapa! Soy el asistente de Sphynx.',
    'bienvenida.paso2': 'Acá vas a aprender física en Jopara',
    'bienvenida.continuar': 'Continuar',
    'bienvenida.empezar': '¡Empezar ahora!',
    'comunes.cancelar': 'Cancelar',
    'comunes.borrar': 'Borrar',
    'comunes.listo': 'Listo',
    'comunes.bloqueado': 'Bloqueado',
    'comunes.cargando': 'Cargando...',
  },
  jopara: {
    'bottom.inicio': 'Ñepyrũ',
    'bottom.progreso': 'Nde progreso',
    'bottom.perfil': 'Nde reko',
    'bottom.ajustes': 'Mba\'e porã',
    'header.atras': 'Jevy',
    'inicio.titulo': 'UNIDADES TEMÁTICAS\nDE APRENDIZAJE',
    'inicio.comenzar': 'Ñepyrũ',
    'inicio.proximamente': 'Oúta',
    'unidad.aprender': 'Kuaa',
    'unidad.experimentar': 'Ha\'echa (Jugar)',
    'unidad.ejercicios': 'Tembiaporã',
    'teoria.titulo': 'TEORÍA',
    'teoria.ejercicios': 'TEMBIAPORÃ',
    'teoria.back': 'Jevy',
    'teoria.fuente': 'Fuente: Cuadernillo MEC · Física 3er curso',
    'niveles.ejercicios': 'Tembiaporã',
    'niveles.tema': 'TEMA',
    'niveles.seleccion': 'Poravo',
    'niveles.empezar': 'Ñepyrũ',
    'niveles.completado': '✅ Opa',
    'niveles.activo': '▶ Nde turno!',
    'niveles.bloqueado': '🔒 Oñemboty',
    'subtemas.bloqueado': 'Emohu\'ã mboyve oúva eike hag̃ua',
    'leccion.siguiente': 'Umi',
    'leccion.finalizar': 'Mohu\'ã',
    'leccion.correcto': '✅ ¡Iporã!',
    'leccion.error': '❌ Ndaha\'éi... Eñeha\'ã jey!',
    'leccion.volver': 'Jevy',
    'leccion.sinPreguntas': 'Ndaipóri porandu',
    'progreso.titulo': 'Nde progreso',
    'progreso.subtitulo': 'Peteĩ ára de racha, peteĩ logro jahupyty',
    'progreso.racha': 'ára de racha',
    'progreso.xp': 'XP total (+10 ojehupytývo)',
    'progreso.detalle': 'ojehupytýva / oñeha\'ãva',
    'progreso.lecciones': 'tembiaporã opa',
    'progreso.seguir': 'Tañemoarandu ve',
    'perfil.estudiante': 'Temimbo\'e',
    'perfil.sub': 'Ára ha ára, peteĩ logro pyahu',
    'perfil.racha': 'Racha',
    'perfil.xp': 'XP',
    'perfil.aciertos': 'ojehupytýva',
    'perfil.editar': 'Moambue perfil',
    'perfil.tituloEdicion': 'Moambue perfil',
    'perfil.nombre': 'Téra',
    'perfil.foto': 'Ta\'anga',
    'perfil.elegirFoto': 'Eiporavo ta\'anga nde celula-gui',
    'perfil.elegiMascota': 'Terã eiporavo peteĩ mymba',
    'perfil.guardar': 'Ñongatu',
    'perfil.cancelar': 'Heja',
    'perfil.actualizado': 'Oñemoambue',
    'perfil.actualizadoDesc': '¡Iporã! Nde reko oñeñongatu.',
    'ajustes.titulo': 'Mba\'e porã',
    'ajustes.idioma': 'Ñe\'ẽ Jopara',
    'ajustes.idiomaDescJopara': 'Porandu guaraníme',
    'ajustes.idiomaDescEs': 'Porandu español-pe',
    'ajustes.sonido': 'Pu',
    'ajustes.sonidoOn': 'Oñehendu',
    'ajustes.sonidoOff': 'Kirirĩ',
    'ajustes.servidor': 'Servidor IA',
    'ajustes.servidorDesc': 'Nde PC IP backend reheve (emoambue Wi-Fi oĩro)',
    'ajustes.servidorPlaceholder': 'http://192.168.1.5:8000',
    'ajustes.guardar': 'Ñongatu',
    'ajustes.guardadoDesc': 'Oñeñongatu. Eprueba SPHYNX IA chat.',
    'ajustes.verPresentacion': 'Echa presentacion',
    'ajustes.verPresentacionDesc': 'Robot ñemomaitei jey',
    'ajustes.creditos': 'Créditos ha referencias',
    'ajustes.creditosDesc': 'Mamoguápa ou ha licencias',
    'ajustes.proyecto': 'Proyecto Sphynx',
    'ajustes.proyectoDesc': 'Eike página oficial-pe',
    'ajustes.borrar': 'Mbogue progreso',
    'ajustes.borrarConfirm': 'Añete? Oñembogueta opaite heta rembiapo ko dispositivo-gui.',
    'ajustes.borrarOk': 'Oñembogue. ¡Ñepyrũ jey!',
    'bienvenida.paso1': '¡Mba\'éichapa! Che ha\'e Sphynx remimbo\'e.',
    'bienvenida.paso2': 'Ko\'ápe reikuaáta física Joparape',
    'bienvenida.continuar': 'Tapeho',
    'bienvenida.empezar': '¡Jahápy!',
    'comunes.cancelar': 'Heja',
    'comunes.borrar': 'Mbogue',
    'comunes.listo': 'Iporã',
    'comunes.bloqueado': 'Oñemboty',
    'comunes.cargando': 'Oñembosako\'i...',
  },
} as const;

type Contexto = {
  idioma: Idioma;
  setIdioma: (v: Idioma) => void;
  t: (clave: Clave) => string;
};

const IdiomaContext = createContext<Contexto>({
  idioma: 'es',
  setIdioma: () => {},
  t: (k) => traducciones.es[k] ?? k,
});

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdiomaState] = useState<Idioma>('es');

  useEffect(() => {
    AsyncStorage.getItem('@sphynx/idioma').then((v) => {
      if (v === 'jopara' || v === 'es') setIdiomaState(v);
    });
  }, []);

  const setIdioma = async (v: Idioma) => {
    setIdiomaState(v);
    await AsyncStorage.setItem('@sphynx/idioma', v);
  };

  const t = (clave: Clave) => traducciones[idioma][clave] ?? traducciones.es[clave] ?? clave;

  return <IdiomaContext.Provider value={{ idioma, setIdioma, t }}>{children}</IdiomaContext.Provider>;
}

export function useIdioma() {
  return useContext(IdiomaContext);
}

export function useTraduccion() {
  const { t } = useContext(IdiomaContext);
  return t;
}