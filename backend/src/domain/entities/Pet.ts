export class Mascota {
  constructor(
    public readonly id: string,
    public nombre: string,
    public especie: string,
    public raza: string,
    public sexo: 'Macho' | 'Hembra',
    public fechaNacimiento: Date,
    public pesoKg: number,
    public color: string,
    public tutorId: string,
    public fotoUrl?: string
  ) {}

  // Ejemplo de regla de negocio: calcular edad
  get edad(): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
    return edad;
  }
}
