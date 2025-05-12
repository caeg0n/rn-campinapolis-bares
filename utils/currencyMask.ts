// utils/currencyMask.ts

/**
 * Formata um valor para exibição como moeda brasileira (R$)
 * @param value Valor a ser formatado
 * @returns Valor formatado (ex: "R$ 1.234,56")
 */
export const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

/**
 * Converte uma string com formato de moeda para um número
 * @param value String no formato de moeda (ex: "R$ 1.234,56")
 * @returns Valor numérico (ex: 1234.56)
 */
export const parseCurrency = (value: string): number => {
  // Remove tudo que não é dígito ou vírgula
  const cleanValue = value.replace(/[^\d,]/g, '');
  
  // Converte vírgula para ponto (padrão de decimal em JavaScript)
  const numericValue = cleanValue.replace(',', '.');
  
  return parseFloat(numericValue) || 0;
};

/**
 * Aplica máscara de moeda brasileira a uma string
 * @param value Valor a ser mascarado
 * @returns String formatada como moeda brasileira
 */
export const maskCurrency = (value: string): string => {
  if (!value) return '';
  
  // Remove todos os caracteres não numéricos
  let numericValue = value.replace(/\D/g, '');
  
  // Converte para número em centavos
  const cents = parseInt(numericValue, 10);
  
  if (isNaN(cents)) {
    return 'R$ ';
  }
  
  // Converte centavos para formato real (divide por 100)
  const reais = cents / 100;
  
  // Formata como moeda brasileira
  return `R$ ${reais.toFixed(2).replace('.', ',')}`;
};

/**
 * Processa a entrada de texto aplicando a máscara de moeda
 * @param text Texto digitado pelo usuário
 * @returns Texto formatado com máscara de moeda
 */
export const handleCurrencyInput = (text: string): string => {
  // Verifica se o texto já começa com "R$ "
  if (text.startsWith('R$ ')) {
    // Mantém "R$ " e remove todos os outros caracteres não numéricos
    const numericPart = text.substring(3).replace(/\D/g, '');
    
    if (!numericPart) {
      return 'R$ ';
    }
    
    // Converte para centavos
    const cents = parseInt(numericPart, 10);
    
    // Formata como moeda
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  } else {
    // Se não começa com "R$ ", aplica a máscara completa
    return maskCurrency(text);
  }
};