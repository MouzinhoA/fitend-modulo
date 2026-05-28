import { createContext, useContext, useState, useCallback } from 'react';
import { api, setToken } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [tokenState, setTokenState] = useState(null);

  const login = useCallback(async (email, senha) => {
    const data = await api.auth.login({ email, senha });
    setToken(data.token);
    setTokenState(data.token);
    setUsuario(data.usuario);
    return data;
  }, []);

  const cadastrar = useCallback(async (nome, email, senha) => {
    const usuario = await api.auth.cadastrar({ nome, email, senha });
    return usuario;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    setUsuario(null);
  }, []);

  const carregarPerfil = useCallback(async () => {
    const data = await api.usuarios.perfil();
    setUsuario(data);
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, token: tokenState, login, cadastrar, logout, carregarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
