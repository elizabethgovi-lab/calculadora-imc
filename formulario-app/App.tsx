import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

import { calcularIMC, obtenerDiagnostico } from './src/utils/imc';
import type { Diagnostico, Registro } from './src/types';

export default function App() {
  const [nombre, setNombre] = useState<string>('');
  const [peso, setPeso] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [imc, setImc] = useState<string>('');
  const [diagnostico, setDiagnostico] = useState<Diagnostico | ''>('');
  const [registros, setRegistros] = useState<Registro[]>([]);

  const obtenerColor = (diag: Diagnostico | '') => {
    switch (diag) {
      case 'Bajo peso':
        return '#3B82F6';
      case 'Peso normal':
        return '#10B981';
      case 'Sobrepeso':
        return '#F59E0B';
      case 'Obesidad':
        return '#EF4444';
      default:
        return '#111827';
    }
  };

  const validarFormulario = () => {
    if (!nombre || !peso || !altura) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }

    const p = parseFloat(peso);
    const a = parseFloat(altura);

    if (isNaN(p) || p <= 0 || p >= 500) {
      Alert.alert('Error', 'El peso debe ser mayor a 0 y menor a 500');
      return false;
    }

    if (isNaN(a) || a <= 0 || a >= 3) {
      Alert.alert('Error', 'La altura debe ser mayor a 0 y menor a 3');
      return false;
    }

    return true;
  };

  const handleCalcular = () => {
    if (!validarFormulario()) return;

    const p = parseFloat(peso);
    const a = parseFloat(altura);

    const resultado = calcularIMC(p, a);
    const diag = obtenerDiagnostico(resultado) as Diagnostico;

    setImc(resultado.toFixed(2));
    setDiagnostico(diag);
  };

  const agregarHistorial = () => {
    if (imc === '' || diagnostico === '') {
      Alert.alert('Error', 'Primero debe calcular el IMC');
      return;
    }

    if (!validarFormulario()) return;

    const nuevoRegistro: Registro = {
      id: Date.now().toString(),
      nombre,
      peso: parseFloat(peso),
      altura: parseFloat(altura),
      imc: parseFloat(imc),
      diagnostico,
    };

    setRegistros([nuevoRegistro, ...registros]);

    setNombre('');
    setPeso('');
    setAltura('');
    setImc('');
    setDiagnostico('');
  };

  const eliminarRegistro = (id: string) => {
    const nuevaLista = registros.filter((registro) => registro.id !== id);
    setRegistros(nuevaLista);
  };

  const limpiarHistorial = () => {
    setRegistros([]);
  };

  const totalRegistros = registros.length;

  const promedioIMC =
    registros.length > 0
      ? registros.reduce((total, registro) => total + registro.imc, 0) /
        registros.length
      : 0;

  const imcMasAlto =
    registros.length > 0
      ? registros.reduce(
          (mayor, registro) => (registro.imc > mayor ? registro.imc : mayor),
          registros[0].imc
        )
      : 0;

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.fondo}>
        <View style={styles.telefono}>
          <Text style={styles.titulo}>Calculadora de IMC</Text>
          <Text style={styles.subtitulo}>
            {registros.length === 0
              ? 'Sin registros aún'
              : `${registros.length} registros`}
          </Text>

          <View style={styles.tarjeta}>
            <Text style={styles.seccion}>DATOS DEL PACIENTE</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ingrese el nombre"
            />

            <View style={styles.fila}>
              <View style={styles.campoMitad}>
                <Text style={styles.label}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  value={peso}
                  onChangeText={setPeso}
                  keyboardType="numeric"
                  placeholder="65.0"
                />
              </View>

              <View style={styles.campoMitad}>
                <Text style={styles.label}>Altura (m)</Text>
                <TextInput
                  style={styles.input}
                  value={altura}
                  onChangeText={setAltura}
                  keyboardType="numeric"
                  placeholder="1.68"
                />
              </View>
            </View>

            <View style={styles.botonesDiagnostico}>
              <Pressable style={styles.botonCategoria}>
                <Text>Bajo peso</Text>
              </Pressable>

              <Pressable style={styles.botonCategoria}>
                <Text>Normal</Text>
              </Pressable>

              <Pressable style={styles.botonCategoria}>
                <Text>Sobrepeso</Text>
              </Pressable>

              <Pressable style={styles.botonCategoria}>
                <Text>Obesidad</Text>
              </Pressable>
            </View>

            <Pressable style={styles.botonCalcular} onPress={handleCalcular}>
              <Text style={styles.textoBoton}>Calcular IMC</Text>
            </Pressable>
          </View>

          {imc !== '' && (
            <View style={styles.resultado}>
              <Text style={styles.nombreResultado}>{nombre}</Text>

              <Text
                style={[
                  styles.imcResultado,
                  { color: obtenerColor(diagnostico) },
                ]}
              >
                {imc}
              </Text>

              <Text
                style={[
                  styles.diagnostico,
                  { color: obtenerColor(diagnostico) },
                ]}
              >
                {diagnostico}
              </Text>

              <Pressable
                style={styles.botonAgregar}
                onPress={agregarHistorial}
              >
                <Text style={styles.textoAgregar}>+ Agregar al historial</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.tarjeta}>
            <Text style={styles.seccion}>ESTADÍSTICAS</Text>

            <View style={styles.fila}>
              <View style={styles.estadistica}>
                <Text style={styles.numero}>{totalRegistros}</Text>
                <Text style={styles.textoEstadistica}>Registros</Text>
              </View>

              <View style={styles.estadistica}>
                <Text style={styles.numero}>
                  {registros.length > 0 ? promedioIMC.toFixed(2) : '-'}
                </Text>
                <Text style={styles.textoEstadistica}>Promedio</Text>
              </View>

              <View style={styles.estadistica}>
                <Text style={styles.numero}>
                  {registros.length > 0 ? imcMasAlto.toFixed(2) : '-'}
                </Text>
                <Text style={styles.textoEstadistica}>Máximo</Text>
              </View>
            </View>
          </View>

          <View style={styles.tarjeta}>
            <View style={styles.encabezadoHistorial}>
              <Text style={styles.seccion}>HISTORIAL</Text>

              <Pressable style={styles.botonLimpiar} onPress={limpiarHistorial}>
                <Text>Limpiar todo</Text>
              </Pressable>
            </View>

            {registros.length === 0 ? (
              <Text style={styles.vacio}>Agrega tu primer registro</Text>
            ) : (
              registros.map((registro) => (
                <View key={registro.id} style={styles.itemHistorial}>
                  <View>
                    <Text style={styles.nombreHistorial}>
                      {registro.nombre}
                    </Text>

                    <Text
                      style={[
                        styles.textoHistorial,
                        { color: obtenerColor(registro.diagnostico) },
                      ]}
                    >
                      IMC: {registro.imc.toFixed(2)} - {registro.diagnostico}
                    </Text>
                  </View>

                  <Pressable
                    style={styles.botonEliminar}
                    onPress={() => eliminarRegistro(registro.id)}
                  >
                    <Text style={styles.textoEliminar}>Eliminar</Text>
                  </Pressable>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F3F2ED',
  },
  fondo: {
    flex: 1,
    backgroundColor: '#F3F2ED',
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 35,
  },
  telefono: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitulo: {
    fontSize: 14,
    color: '#8A8A8A',
    marginTop: 4,
    marginBottom: 28,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 14,
  },
  seccion: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#888',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E1E5EA',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  campoMitad: {
    flex: 1,
  },
  botonesDiagnostico: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  botonCategoria: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 9,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botonCalcular: {
    backgroundColor: '#6759FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultado: {
    marginBottom: 14,
    backgroundColor: '#ECFDF5',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  nombreResultado: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
  },
  imcResultado: {
    fontSize: 36,
    fontWeight: '800',
  },
  diagnostico: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  botonAgregar: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoAgregar: {
    color: '#10B981',
    fontWeight: '600',
  },
  estadistica: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  numero: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  textoEstadistica: {
    fontSize: 11,
    color: '#777',
    marginTop: 4,
  },
  encabezadoHistorial: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  botonLimpiar: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  vacio: {
    textAlign: 'center',
    color: '#B0B0B0',
    marginTop: 20,
  },
  itemHistorial: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nombreHistorial: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  textoHistorial: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  botonEliminar: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  textoEliminar: {
    color: '#EF4444',
    fontWeight: '600',
  },
});