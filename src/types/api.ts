// O parâmetro genérico <T> permite que você defina qual será o tipo de dado esperado na resposta da API.
// Por exemplo, se você espera receber um usuário, pode usar ApiResponse<User>.
// Se espera uma lista de produtos, pode usar ApiResponse<Product[]>.
// Assim, o TypeScript garante que o campo "data" da resposta terá o tipo correto em cada situação.
// Ao declarar <T>, você está criando um tipo genérico, ou seja, a interface ApiResponse pode ser reutilizada para qualquer tipo de dado, e o TypeScript garante que o campo "data" terá o tipo correto em cada uso. Por exemplo: ApiResponse<User>, ApiResponse<Product[]>, etc.
// Já ao usar any, você perde a verificação de tipo do TypeScript, pois "any" aceita qualquer valor e não oferece segurança de tipos.
// Exemplo com T (genérico):
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// AuthUser moved to auth.ts to avoid conflicts
