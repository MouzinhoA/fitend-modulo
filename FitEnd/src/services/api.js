import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getApiBase() {
  const hostUri =
    Constants.manifest2?.hostUri ||
    Constants.manifest?.hostUri ||
    Constants.manifest?.debuggerHost ||
    Constants.expoConfig?.hostUri;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:3000/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api';
  }

  return 'http://localhost:3000/api';
}

const API_BASE = getApiBase();

let token = null;

export function setToken(t) {
  token = t;
}

export function getToken() {
  return token;
}

export function getBaseUrl() {
  return API_BASE.replace('/api', '');
}

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  };

  let res;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, config);
  } catch {
    throw new Error(
      `Não foi possível conectar ao servidor em ${API_BASE}${endpoint}. Verifique se o backend está rodando.`,
    );
  }

  if (res.status === 204) {
    return null;
  }

  const data = await res.json();

  if (!res.ok) {
    let msg = data.error || 'Erro na requisição';
    if (data.detalhes && Array.isArray(data.detalhes)) {
      msg += '\n' + data.detalhes.map(d => `- ${d.campo}: ${d.mensagem}`).join('\n');
    }
    throw new Error(msg);
  }

  return data;
}

async function uploadPhoto(uri) {
  const formData = new FormData();
  const filename = uri.split('/').pop() || 'photo.jpg';
  const ext = filename.split('.').pop() || 'jpg';
  formData.append('foto', {
    uri,
    name: `upload.${ext}`,
    type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
  });

  const config = {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  };

  let res;
  try {
    res = await fetch(`${API_BASE}/upload`, config);
  } catch {
    throw new Error('Não foi possível conectar ao servidor para upload');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erro no upload');
  }
  return data;
}

export const api = {
  auth: {
    login: (body) => request('/usuarios/login', { method: 'POST', body: JSON.stringify(body) }),
    cadastrar: (body) => request('/usuarios/cadastrar', { method: 'POST', body: JSON.stringify(body) }),
  },
  usuarios: {
    perfil: () => request('/usuarios/perfil'),
    atualizar: (body) => request('/usuarios/perfil', { method: 'PUT', body: JSON.stringify(body) }),
    deletar: () => request('/usuarios/perfil', { method: 'DELETE' }),
  },
  desafios: {
    listar: () => request('/desafios'),
    meus: () => request('/desafios/meus'),
    buscar: (id) => request(`/desafios/${id}`),
    criar: (body) => request('/desafios', { method: 'POST', body: JSON.stringify(body) }),
    atualizar: (id, body) => request(`/desafios/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deletar: (id) => request(`/desafios/${id}`, { method: 'DELETE' }),
    ranking: (id) => request(`/desafios/${id}/ranking`),
    buscarPorConvite: (codigo) => request(`/desafios/convite/${codigo}`),
  },
  metricas: {
    listar: () => request('/metricas'),
  },
  participacoes: {
    listar: () => request('/participacoes'),
    participar: (cod_convite) => request('/participacoes', { method: 'POST', body: JSON.stringify({ cod_convite }) }),
    sair: (id) => request(`/participacoes/${id}`, { method: 'DELETE' }),
  },
  checkins: {
    criar: (participacaoId, body) => request(`/checkins/${participacaoId}`, { method: 'POST', body: JSON.stringify(body) }),
    criarPorUsuario: (desafioId, body) => request(`/checkins/desafio/${desafioId}`, { method: 'POST', body: JSON.stringify(body) }),
    listar: (participacaoId) => request(`/checkins/${participacaoId}`),
    listarDoDesafio: (desafioId) => request(`/checkins/desafio/${desafioId}`),
  },
  upload: uploadPhoto,
};
