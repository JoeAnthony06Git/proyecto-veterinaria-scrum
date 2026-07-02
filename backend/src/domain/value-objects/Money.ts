export class Dinero {
  constructor(
    private readonly _monto: number,
    private readonly _moneda: string = 'PEN'
  ) {
    if (_monto < 0) {
      throw new Error('El monto no puede ser negativo');
    }
  }

  get monto(): number {
    return this._monto;
  }

  get moneda(): string {
    return this._moneda;
  }

  sumar(otro: Dinero): Dinero {
    if (this._moneda !== otro._moneda) {
      throw new Error('No se pueden sumar monedas diferentes');
    }
    return new Dinero(this._monto + otro._monto, this._moneda);
  }

  restar(otro: Dinero): Dinero {
    if (this._moneda !== otro._moneda) {
      throw new Error('No se pueden restar monedas diferentes');
    }
    if (this._monto < otro._monto) {
      throw new Error('El resultado no puede ser negativo');
    }
    return new Dinero(this._monto - otro._monto, this._moneda);
  }

  multiplicar(factor: number): Dinero {
    if (factor < 0) {
      throw new Error('El factor no puede ser negativo');
    }
    return new Dinero(this._monto * factor, this._moneda);
  }

  esMayorQue(otro: Dinero): boolean {
    if (this._moneda !== otro._moneda) {
      throw new Error('No se pueden comparar monedas diferentes');
    }
    return this._monto > otro._monto;
  }

  esIgualQue(otro: Dinero): boolean {
    return this._monto === otro._monto && this._moneda === otro._moneda;
  }

  toString(): string {
    return `${this._monto.toFixed(2)} ${this._moneda}`;
  }
}
