/**
 * Formata número de telefone brasileiro
 * Entrada: 556296899855
 * Saída: +55 (62) 96899-855 ou +55 (62) 9689-9855
 */
export function formatPhoneBrazil(phone: string): string {
  if (!phone) return 'N/A'
  
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '')
  
  // Se não começar com 55 (Brasil), retorna original
  if (!cleaned.startsWith('55')) {
    return phone
  }
  
  // Remove o código do país (55)
  const withoutCountry = cleaned.slice(2)
  
  // Verifica se tem DDD (2 dígitos) e número
  if (withoutCountry.length < 10) {
    return phone // Número inválido
  }
  
  const ddd = withoutCountry.slice(0, 2)
  const number = withoutCountry.slice(2)
  
  // Celular (9 dígitos) ou Fixo (8 dígitos)
  if (number.length === 9) {
    // Celular: +55 (62) 96899-855
    const part1 = number.slice(0, 5)
    const part2 = number.slice(5)
    return `+55 (${ddd}) ${part1}-${part2}`
  } else if (number.length === 8) {
    // Fixo: +55 (62) 9689-9855
    const part1 = number.slice(0, 4)
    const part2 = number.slice(4)
    return `+55 (${ddd}) ${part1}-${part2}`
  }
  
  // Se não se encaixar nos padrões, retorna formatado básico
  return `+55 (${ddd}) ${number}`
}
