// Funções de autenticação para gerenciamento de cookies e usuários

/**
 * Obtém dados do usuário a partir do cookie
 * @param {import('next/server').NextRequest} request
 * @returns {Object|null} Dados do usuário ou null se não estiver autenticado
 */
export function getUserFromCookie(request) {
  try {
    // Obter cookie com os dados do usuário
    const userCookie = request.cookies.get('userData');
    
    if (!userCookie?.value) {
      console.log('Auth: Nenhum cookie userData encontrado');
      return null;
    }
    
    // Decodificar cookie
    const userData = JSON.parse(decodeURIComponent(userCookie.value));
    console.log('Auth: Usuário obtido do cookie:', userData);
    
    return userData;
  } catch (error) {
    console.error('Auth: Erro ao obter usuário do cookie:', error);
    return null;
  }
}

/**
 * Define cookie com dados do usuário
 * @param {Object} userData Dados do usuário a serem armazenados
 * @returns {import('next/server').ResponseCookie} Objeto de cookie para incluir na resposta
 */
export function setUserCookie(userData) {
  // Garantir que userData é uma string JSON
  const userDataStr = typeof userData === 'string' ? userData : JSON.stringify(userData);
  
  // Codificar dados do usuário
  const encodedUserData = encodeURIComponent(userDataStr);
  
  // Definir cookie (válido por 24 horas)
  return {
    name: 'userData',
    value: encodedUserData,
    httpOnly: true,
    path: '/',
    maxAge: 24 * 60 * 60, // 24 horas em segundos
    sameSite: 'strict'
  };
}

/**
 * Verifica se o usuário tem permissão de administrador
 * @param {Object} userData Dados do usuário
 * @returns {boolean} true se o usuário for admin, false caso contrário
 */
export function isAdmin(userData) {
  return userData?.role === 'ADMIN';
} 