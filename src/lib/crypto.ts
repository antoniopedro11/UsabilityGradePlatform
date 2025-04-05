import crypto from 'crypto';

/**
 * Gera um código aleatório para recuperação de senha
 * @param length Comprimento do código (padrão: 6)
 * @returns Código numérico como string
 */
export function generateResetCode(length: number = 6): string {
  // Gera um número aleatório com o comprimento especificado
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const code = Math.floor(Math.random() * (max - min + 1)) + min;
  return code.toString();
}

/**
 * Gera um hash para uma senha
 * @param password Senha em texto plano
 * @returns Hash da senha
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verifica se uma senha corresponde ao seu hash
 * @param password Senha em texto plano
 * @param hash Hash armazenado
 * @returns Verdadeiro se a senha corresponde ao hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
}

/**
 * Calcula a data de expiração para um código de recuperação
 * @param minutes Minutos até a expiração (padrão: 30)
 * @returns Data de expiração
 */
export function getResetCodeExpiry(minutes: number = 30): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
}

/**
 * Verifica se um código de recuperação ainda é válido
 * @param expiryDate Data de expiração do código
 * @returns Verdadeiro se o código ainda é válido
 */
export function isResetCodeValid(expiryDate: Date | null): boolean {
  if (!expiryDate) return false;
  return new Date() < expiryDate;
} 