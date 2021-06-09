export function currencyFormat(value: number) {
  const valueFormatted = value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  return valueFormatted;
}