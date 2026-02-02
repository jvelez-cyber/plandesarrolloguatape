// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configuración de Firebase (reemplazar con tus credenciales reales)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "guatape-compromisos", // Ejemplo de ID de proyecto
  storageBucket: "guatape-compromisos.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// ==================== COMPROMISOS ====================

/**
 * Obtener todos los compromisos
 */
export const obtenerCompromisos = async () => {
  try {
    const compromisosRef = collection(db, 'compromisos');
    const snapshot = await getDocs(compromisosRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener compromisos:', error);
    throw error;
  }
};

/**
 * Obtener compromisos por responsable
 */
export const obtenerCompromisosPorResponsable = async (codigoResponsable) => {
  try {
    const compromisosRef = collection(db, 'compromisos');
    const q = query(
      compromisosRef,
      where('responsable1', '==', codigoResponsable)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener compromisos por responsable:', error);
    throw error;
  }
};

/**
 * Obtener compromisos por estado
 */
export const obtenerCompromisosPorEstado = async (estado) => {
  try {
    const compromisosRef = collection(db, 'compromisos');
    const q = query(compromisosRef, where('cumplimiento', '==', estado));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener compromisos por estado:', error);
    throw error;
  }
};

/**
 * Crear un nuevo compromiso
 */
export const crearCompromiso = async (compromiso) => {
  try {
    const compromisosRef = collection(db, 'compromisos');
    const docRef = await addDoc(compromisosRef, {
      ...compromiso,
      fechaCreacion: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error al crear compromiso:', error);
    throw error;
  }
};

/**
 * Actualizar un compromiso
 */
export const actualizarCompromiso = async (id, datosActualizados) => {
  try {
    const compromisoRef = doc(db, 'compromisos', id);
    await updateDoc(compromisoRef, {
      ...datosActualizados,
      ultimaActualizacion: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al actualizar compromiso:', error);
    throw error;
  }
};

/**
 * Eliminar un compromiso
 */
export const eliminarCompromiso = async (id) => {
  try {
    const compromisoRef = doc(db, 'compromisos', id);
    await deleteDoc(compromisoRef);
  } catch (error) {
    console.error('Error al eliminar compromiso:', error);
    throw error;
  }
};

// ==================== RESPONSABLES ====================

/**
 * Obtener todos los responsables
 */
export const obtenerResponsables = async () => {
  try {
    const responsablesRef = collection(db, 'responsables');
    const snapshot = await getDocs(responsablesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener responsables:', error);
    throw error;
  }
};

/**
 * Crear un nuevo responsable
 */
export const crearResponsable = async (responsable) => {
  try {
    const responsablesRef = collection(db, 'responsables');
    const docRef = await addDoc(responsablesRef, responsable);
    return docRef.id;
  } catch (error) {
    console.error('Error al crear responsable:', error);
    throw error;
  }
};

// ==================== SECRETARIOS ====================

/**
 * Obtener todos los secretarios
 */
export const obtenerSecretarios = async () => {
  try {
    const secretariosRef = collection(db, 'secretarios');
    const snapshot = await getDocs(secretariosRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error al obtener secretarios:', error);
    throw error;
  }
};

/**
 * Subir foto de secretario al Storage
 */
export const subirFotoSecretario = async (file, codigoResponsable) => {
  try {
    const storageRef = ref(storage, `secretarios/${codigoResponsable}.jpg`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir foto:', error);
    throw error;
  }
};

/**
 * Crear un nuevo secretario
 */
export const crearSecretario = async (secretario) => {
  try {
    const secretariosRef = collection(db, 'secretarios');
    const docRef = await addDoc(secretariosRef, secretario);
    return docRef.id;
  } catch (error) {
    console.error('Error al crear secretario:', error);
    throw error;
  }
};

// ==================== ESTADÍSTICAS ====================

/**
 * Obtener estadísticas generales
 */
export const obtenerEstadisticas = async () => {
  try {
    const compromisos = await obtenerCompromisos();
    
    const total = compromisos.length;
    const cumplidos = compromisos.filter(c => c.cumplimiento === 'Si').length;
    const enProceso = compromisos.filter(c => c.cumplimiento === 'En proceso').length;
    const noCumplidos = compromisos.filter(c => c.cumplimiento === 'No').length;
    const enTermino = compromisos.filter(c => c.cumplimiento === 'En término').length;
    
    // Estadísticas por responsable
    const estadisticasPorResponsable = {};
    compromisos.forEach(compromiso => {
      const responsables = [
        compromiso.responsable1,
        compromiso.responsable2,
        compromiso.responsable3
      ].filter(Boolean);
      
      responsables.forEach(resp => {
        if (!estadisticasPorResponsable[resp]) {
          estadisticasPorResponsable[resp] = {
            total: 0,
            cumplidos: 0,
            enProceso: 0,
            noCumplidos: 0
          };
        }
        estadisticasPorResponsable[resp].total++;
        if (compromiso.cumplimiento === 'Si') estadisticasPorResponsable[resp].cumplidos++;
        if (compromiso.cumplimiento === 'En proceso') estadisticasPorResponsable[resp].enProceso++;
        if (compromiso.cumplimiento === 'No') estadisticasPorResponsable[resp].noCumplidos++;
      });
    });
    
    return {
      general: {
        total,
        cumplidos,
        enProceso,
        noCumplidos,
        enTermino,
        porcentajeCumplimiento: total > 0 ? ((cumplidos / total) * 100).toFixed(1) : 0
      },
      porResponsable: estadisticasPorResponsable
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

// ==================== MIGRACIÓN DE DATOS ====================

/**
 * Migrar datos desde Excel a Firebase
 * Esta función se ejecuta UNA SOLA VEZ para cargar los datos iniciales
 */
export const migrarDatosExcelAFirebase = async (datosExcel) => {
  try {
    console.log('Iniciando migración de datos...');
    
    // Migrar compromisos
    const compromisosRef = collection(db, 'compromisos');
    for (const compromiso of datosExcel.compromisos) {
      await addDoc(compromisosRef, compromiso);
    }
    console.log(`${datosExcel.compromisos.length} compromisos migrados`);
    
    // Migrar responsables
    const responsablesRef = collection(db, 'responsables');
    for (const responsable of datosExcel.responsables) {
      await addDoc(responsablesRef, responsable);
    }
    console.log(`${datosExcel.responsables.length} responsables migrados`);
    
    // Migrar secretarios
    const secretariosRef = collection(db, 'secretarios');
    for (const secretario of datosExcel.secretarios) {
      await addDoc(secretariosRef, secretario);
    }
    console.log(`${datosExcel.secretarios.length} secretarios migrados`);
    
    console.log('Migración completada exitosamente');
  } catch (error) {
    console.error('Error en la migración:', error);
    throw error;
  }
};

export { db, storage };
