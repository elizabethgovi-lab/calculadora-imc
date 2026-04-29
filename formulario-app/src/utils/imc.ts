import type { Diagnostico } from '../types';

export const calcularIMC = (peso: number, altura: number): number => {
  return peso / (altura * altura);
};

export const obtenerDiagnostico = (imc: number): Diagnostico => {
  if (imc < 18.5) return 'Bajo peso';
  if (imc < 25) return 'Peso normal';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidad';
};