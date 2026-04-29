export type Diagnostico =
  | 'Bajo peso'
  | 'Peso normal'
  | 'Sobrepeso'
  | 'Obesidad';

export interface Registro {
  id: string;
  nombre: string;
  peso: number;
  altura: number;
  imc: number;
  diagnostico: Diagnostico;
}