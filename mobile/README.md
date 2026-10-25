# Plataforma de Eventos — Aplicativo Mobile (React Native + Expo)

Aplicativo para consultar eventos e gerenciar inscrições.
Projeto da atividade avaliativa de **Desenvolvimento Mobile** — IFMA Campus Timon.

**Integrantes:** _Nome 1_ e _Nome 2_

O app consome a API do projeto `../web` (Next.js). Os eventos são cadastrados pelo administrador no sistema web, e o usuário do app apenas consulta eventos e gerencia as próprias inscrições. O app **não** cria nem edita eventos.

## Funcionalidades

- Criar conta (cadastro)
- Realizar login
- Visualizar a lista de eventos disponíveis
- Visualizar os detalhes de um evento
- Inscrever-se em um evento
- Visualizar as próprias inscrições
- Cancelar uma inscrição
- Encerrar a sessão (logout)

## Tecnologias

- React Native + Expo (SDK 58) + TypeScript
- Expo Router (navegação baseada em arquivos)
- Context API (autenticação e inscrições)
- `fetch` para consumir a API
- AsyncStorage (sessão persistente)

## Pré-requisitos

- Node.js 18 ou superior
- O projeto `web` rodando (API e banco de dados), conforme o README dele
- Celular com o app **Expo Go**, ou um emulador Android/iOS
- Celular e computador na **mesma rede Wi-Fi**

## Como executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Configurar o endereço da API

Edite `src/config.ts` e coloque o IP do computador onde o projeto `web` está rodando:

```typescript
export const API_URL = "http://192.168.0.32:3000";
```

Não use `localhost`: no celular, `localhost` aponta para o próprio aparelho. O IP da rede aparece no terminal do `npm run dev` do projeto `web` (linha `Network`) e também no comando `ipconfig`.

Para conferir se o celular enxerga a API, abra `http://SEU_IP:3000/api/events` no navegador do celular. Se não abrir, o Firewall do Windows pode estar bloqueando a porta 3000.

### 3. Iniciar o aplicativo

```bash
npx expo start
```

Escaneie o QR code com o Expo Go (no Android, pelo próprio app; no iPhone, pela câmera).

### Login no Expo (necessário em iPhone físico)

Nas versões recentes do Expo Go, em **iPhone físico** o Expo CLI e o Expo Go precisam estar logados na **mesma conta Expo**. Caso contrário, o Expo Go mostra um erro "You need to be signed in to Expo Go and Expo CLI".

- No Expo Go: toque no avatar (canto superior direito) e entre com a conta.
- No computador: `npx expo login`. Se a conta foi criada com o Google (sem senha), crie um token em <https://expo.dev/settings/access-tokens> e defina no terminal onde o Expo vai rodar:

```powershell
$env:EXPO_TOKEN="seu-token"
npx expo start
```

O token é como uma senha: não deve ser compartilhado nem enviado ao repositório. Em Android, emulador Android e simulador iOS essa exigência não existe.

## Usuário para teste

Qualquer usuário comum pode ser criado pela tela de cadastro do app. Exemplo de usuário usado nos testes:

| E-mail | Senha |
|---|---|
| `teste@email.com` | `123456` |

Os eventos são criados no painel web (`http://localhost:3000/admin/login`) com o administrador (`admin@email.com` / `admin123`).

## Estrutura do projeto

```
mobile/src/
├── config.ts                    (URL da API)
├── api.ts                       (função apiFetch: token, timeout e erros)
├── types.ts
├── utils/format.ts
├── components/
│   └── EventCard.tsx
├── context/
│   ├── AuthContext.tsx          (usuário, token, login, cadastro, logout)
│   └── RegistrationsContext.tsx (inscrições do usuário)
└── app/                         (rotas do Expo Router)
    ├── _layout.tsx              (AuthProvider)
    ├── (auth)/                  (telas públicas)
    │   ├── _layout.tsx
    │   ├── login.tsx
    │   └── register.tsx
    └── (app)/                   (telas protegidas)
        ├── _layout.tsx          (proteção de rota + RegistrationsProvider)
        ├── (tabs)/
        │   ├── _layout.tsx      (abas e botão Sair)
        │   ├── index.tsx        (lista de eventos)
        │   └── registrations.tsx (minhas inscrições)
        └── event/
            └── [id].tsx         (detalhes do evento)
```

## Como o app funciona

- **Navegação (Expo Router):** as pastas `(auth)` e `(app)` são grupos de rotas que não aparecem na URL. `event/[id]` é uma rota dinâmica, lida com `useLocalSearchParams`.
- **Autenticação (Context API):** o `AuthProvider` guarda usuário e token e expõe `signIn`, `signUp` e `signOut` pelo hook `useAuth()`.
- **Sessão persistente:** ao entrar, o token e o usuário são salvos no AsyncStorage. Ao abrir o app, a sessão é restaurada, e o usuário continua logado.
- **Rotas protegidas:** o layout de `(app)` redireciona para o login quando não há usuário, e o layout de `(auth)` redireciona para o app quando já há sessão. Ao sair, todas as telas protegidas deixam de ser acessíveis.
- **Inscrições (Context API):** o `RegistrationsProvider` mantém a lista de inscrições compartilhada entre as telas. Inscrever-se ou cancelar atualiza a lista, o selo "Inscrito" e os botões automaticamente.
- **Consumo da API:** toda comunicação passa pela função `apiFetch` (`src/api.ts`), que usa `fetch`, envia o header `Authorization: Bearer <token>` quando há token, aplica timeout de 10 segundos e converte erros da API em mensagens legíveis.
- **Carregamento e erros:** indicadores de carregamento (`ActivityIndicator`), botões desativados durante as ações, mensagem de erro com botão "Tentar novamente", *pull-to-refresh* nas listas e confirmação antes de cancelar inscrição.

## Problemas comuns

- **"Failed to fetch" ao testar:** isso acontece na versão web do Expo (`localhost:8081`), porque o navegador bloqueia chamadas para outra origem (CORS). Teste no celular com o Expo Go ou em um emulador.
- **"Não foi possível conectar ao servidor":** confira se o projeto `web` está rodando, se o `API_URL` tem o IP correto e se celular e computador estão na mesma rede.
- **Tela branca ao abrir:** verifique se não sobrou um arquivo `index.tsx` direto em `src/app/` ou em `src/app/(app)/` conflitando com `(app)/(tabs)/index.tsx`.
- **Erro de SDK incompatível no Expo Go:** o SDK do projeto deve ser o mesmo que o Expo Go instalado no celular suporta.