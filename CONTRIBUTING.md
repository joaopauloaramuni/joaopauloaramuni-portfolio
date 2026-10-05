# 🤝 Contribuindo com o Portfólio Terminal

```text
visitante@portfolio:~$ contribuir
[  OK  ] Fork criado
[  OK  ] Dependências instaladas
[ INFO ] Lendo CONTRIBUTING.md...
```

Que bom que você chegou até aqui! 🎉

Este repositório é o **portfólio pessoal** do Prof. João Paulo Aramuni e também serve como **material didático** da disciplina de Laboratório de Desenvolvimento de Software da PUC Minas. Por isso, existem duas formas de participar:

1. **Contribuir com este repositório**, por meio de issues e pull requests, seguindo as orientações deste guia.
2. **Usar o projeto como base para o seu próprio portfólio**: veja a seção [🍴 Criando o seu portfólio a partir deste](#-criando-o-seu-portfólio-a-partir-deste).

Se você é aluno(a) e está contribuindo como parte de uma disciplina, seja muito bem-vindo(a)! PRs pequenos e perguntas nas issues são sempre bem recebidos.

-----

## 📋 Sumário

- [🧭 Antes de começar](#-antes-de-começar)
- [🛠️ Configurando o ambiente](#️-configurando-o-ambiente)
- [🗂️ Estrutura do projeto](#️-estrutura-do-projeto)
- [⌨️ Como funciona um comando](#️-como-funciona-um-comando)
- [🌍 Traduções (i18n)](#-traduções-i18n)
- [🎨 Estilo e tema](#-estilo-e-tema)
- [✍️ Padrões de código](#️-padrões-de-código)
- [🔀 Fluxo de Git e Pull Requests](#-fluxo-de-git-e-pull-requests)
- [🐛 Abrindo uma issue](#-abrindo-uma-issue)
- [🍴 Criando o seu portfólio a partir deste](#-criando-o-seu-portfólio-a-partir-deste)
- [📄 Licença](#-licença)

-----

## 🧭 Antes de começar

- **O conteúdo pessoal é do autor.** Biografia, experiências, prêmios, recomendações, currículo e links de contato não devem ser alterados em PRs, exceto para corrigir um erro de digitação ou um link quebrado.
- **Mudanças grandes começam por uma issue.** Antes de criar um comando novo, adicionar uma dependência ou mexer no visual do terminal, abra uma issue explicando a ideia. Assim ninguém perde tempo com algo que talvez não entre.
- **Seja gentil.** Críticas ao código são bem-vindas; críticas a pessoas, não. Trate todos com respeito nas issues, PRs e revisões.

-----

## 🛠️ Configurando o ambiente

### Pré-requisitos

- **[Node.js](https://nodejs.org/) 20.19+ ou 22.12+** (exigência do Vite 7)
- **npm** (já vem com o Node)
- **Git**

### Passo a passo

1. Faça um **fork** do repositório pelo GitHub.

2. Clone o seu fork e entre na pasta:

   ```bash
   git clone https://github.com/<seu-usuario>/joaopauloaramuni-portfolio.git
   cd joaopauloaramuni-portfolio
   ```

3. Adicione o repositório original como `upstream`, para manter seu fork atualizado:

   ```bash
   git remote add upstream https://github.com/joaopauloaramuni/joaopauloaramuni-portfolio.git
   ```

4. Instale as dependências:

   ```bash
   npm install
   ```

5. *(Opcional)* Crie o seu `.env.local` a partir do modelo:

   ```bash
   cp .env.example .env.local
   ```

6. Rode o projeto e abra `http://localhost:5173`:

   ```bash
   npm run dev
   ```

### 🔑 Variáveis de ambiente

**Todas as variáveis são opcionais.** Sem `.env.local`, o portfólio abre normalmente; apenas os comandos que dependem de serviços externos ficam limitados:

| Variáveis | Comando | Sem elas... |
|:--|:--|:--|
| `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` | `guestbook` | `guestbook list` mostra "Nenhuma mensagem ainda." e `guestbook add` mostra "Erro ao enviar mensagem." |
| `VITE_EMAILJS_*` | `contato` | o formulário abre, mas o envio não funciona |
| `VITE_GITHUB_TOKEN` | `github` | os repositórios vêm da API pública do GitHub, que tem limite menor (60 requisições por hora por IP) |

Para testar esses recursos de verdade, siga os guias do [README](README.md) (EmailJS, GitHub API e Supabase) e use **as suas próprias contas**.

> 🧪 **Não teste o Livro de Visitas no banco de produção.** Crie um projeto gratuito no Supabase só para desenvolvimento, para que mensagens de teste não apareçam no portfólio publicado.

Alguns cuidados com as chaves:

- O `.env.local` já está no `.gitignore`. **Nunca** faça commit de tokens ou chaves; o que vai para o repositório é só o `.env.example`, sem valores.
- Toda variável `VITE_` é embutida no JavaScript enviado ao navegador. Por isso, o token do GitHub deve ser **fine-grained e só de leitura** de repositórios públicos.

### 🧪 Dicas para testar

- **Ver a sequência de boot de novo:** ela aparece uma vez por aba. Rode `sessionStorage.clear()` no console do navegador e recarregue a página.
- **Simular um visitante novo:** rode `localStorage.removeItem("aramuni-theme")` e recarregue; o site volta ao tema escuro padrão.
- **Testar o build de produção:** `npm run build` seguido de `npm run preview`.
- **Testar com Docker:** `docker build -t portfolio .` e depois `docker run -p 8080:80 portfolio`, acessando `http://localhost:8080`. Se existir um `.env.local`, ele entra no build da imagem.

-----

## 🗂️ Estrutura do projeto

```text
.
├── public/                → imagens, logos, fotos das recomendações e currículos (PDF)
├── src/
│   ├── App.jsx            → terminal e roteamento dos comandos (handleInput)
│   ├── commands.js        → registro dos comandos e seus aliases
│   ├── i18n.js            → todos os textos, em PT e EN
│   ├── components/        → um componente (.jsx + .css) por comando ou recurso
│   ├── data/              → estrutura dos dados (projetos, experiências, prêmios...)
│   ├── config/            → configuração do EmailJS, da GitHub API, do GitHub Stats e do WakaTime
│   ├── lib/               → cliente do Supabase (Livro de Visitas) e buscas do WakaTime e do GitHub Stats
│   └── theme/             → tokens de cor, contexto e ThemeProvider
├── scripts/               → script que importa o currículo Lattes (npm run lattes)
├── .github/workflows/     → workflow que mantém o Supabase ativo
├── vercel.json            → rewrites que repassam /api/wakatime e /api/github/* (contadores de visitas)
├── .env.example           → modelo das variáveis de ambiente
├── Dockerfile             → build com Node + NGINX (opcional)
└── README.md              → documentação completa e guias de configuração
```

-----

## ⌨️ Como funciona um comando

Cada comando do terminal passa por quatro arquivos. Usando um comando fictício `quiz` como exemplo:

**1. Registro em `src/commands.js`.** O `name` fica em português e os `aliases`, em inglês (ou atalhos):

```javascript
quiz: {
  name: 'quiz',
  aliases: ['trivia'],
},
```

**2. Componente** em `src/components/Quiz.jsx`, com o CSS ao lado (`Quiz.css`):

```jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "./Quiz.css";

const Quiz = () => {
  const { t } = useTranslation();

  return (
    <div className="quiz-container">
      <p>{t("quiz.titulo")}</p>
    </div>
  );
};

export default Quiz;
```

**3. Ligação no `switch` de `handleInput`**, em `src/App.jsx`:

```jsx
case "quiz":
  response = <Quiz />;
  break;
```

**4. Textos em `src/i18n.js`, nos dois idiomas.** O comando `ajuda` lista tudo o que está em `commands.js` automaticamente e busca a descrição em `ajuda.<name>.desc`; se ela faltar, a chave aparece crua na tela.

```javascript
// resources.pt.translation
ajuda: {
  // ...
  quiz: { desc: "Responda um quiz sobre programação." },
},
quiz: { titulo: "Quiz de programação" },

// resources.en.translation
ajuda: {
  // ...
  quiz: { desc: "Take a programming quiz." },
},
quiz: { titulo: "Programming quiz" },
```

Alguns detalhes que fazem diferença:

- **Subcomandos:** a entrada é convertida para minúsculas e dividida por espaços. O segundo termo chega como `subCommand` (é assim que funcionam `tema claro` e `guestbook add`).
- **Componentes interativos** (formulários, jogos) recebem `onExit` para voltar ao terminal e precisam desativar o `onInput` enquanto estão abertos. Veja como `isGameOpen`, `isContatoOpen` e `isGuestBookAddOpen` são usados em `App.jsx`.
- **Serviços externos** precisam funcionar sem as variáveis de ambiente, como o `supabase.js` e o `ProjetosGitHub.jsx` já fazem: o site nunca pode deixar de abrir por falta de uma chave.
- **README:** todo comando novo entra também na lista do início do README.

-----

## 🌍 Traduções (i18n)

- **Todo texto visível passa pelo `i18n.js`**, com `t("chave")`. Nada de frases fixas no JSX.
- **Toda chave existe nos dois idiomas**: `resources.pt` e `resources.en`. O idioma padrão é `pt` e o fallback é `en`.
- **As chaves seguem o padrão do arquivo**: português, em `snake_case`, agrupadas por componente (ex.: `contato.voltar_terminal`).
- **Os arquivos de `src/data/` guardam só a estrutura** (ids, imagens, links, anos). O texto fica no `i18n.js`, referenciado por campos como `titleId`, `descriptionId` e `roleId`.

-----

## 🎨 Estilo e tema

- **Use só tokens de cor.** Os componentes usam `var(--token)`, inclusive em estilos inline: `style={{ color: "var(--accent)" }}`. Os tokens ficam em `src/theme/theme.css`.
- **Precisa de um token novo?** Defina-o em `:root` (tema escuro) e, se o valor mudar no tema claro, também em `[data-theme="light"]`.
- **Respeite o contraste:** no tema claro, texto precisa de pelo menos 4.5:1 e ícones/bordas de 3:1 sobre o fundo `#ddd`. O [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) ajuda.
- **Um CSS por componente**, com o mesmo nome do `.jsx` e classes prefixadas pelo componente (ex.: `.ajuda-container`, `.ajuda-item`), para evitar conflitos.
- **Teste sempre** nos dois temas, nos dois idiomas e em uma tela de celular (o DevTools em modo responsivo serve).

-----

## ✍️ Padrões de código

- **Componentes funcionais com hooks**, um por arquivo, com `export default`.
- **Nomes:** componentes de comando costumam ter nome em português (`SobreMim`, `Experiencias`, `LivroVisitas`); componentes de apoio podem estar em inglês (`ProjectCard`, `ThemeToggle`). Na dúvida, siga o padrão dos vizinhos.
- **Formatação:** o projeto não usa Prettier, então mantenha o estilo do arquivo que você está editando (indentação de 2 espaços, aspas, ponto e vírgula).
- **Finais de linha:** a maior parte dos arquivos de `src/` usa CRLF. Configure o editor para manter o final de linha de cada arquivo; caso contrário, o diff mostra o arquivo inteiro como alterado.
- **Comentários em português**, como no restante do código.
- **Lint e build precisam passar, sem erros:**

  ```bash
  npm run lint
  npm run build
  ```

- **Dependências novas só com conversa prévia** em uma issue. O bundle já é grande, então cada pacote precisa se justificar.
- **Imagens** vão em `public/` e são referenciadas com caminho absoluto (`/minha-imagem.png`). Comprima antes de adicionar.

-----

## 🔀 Fluxo de Git e Pull Requests

### Branches

Crie uma branch a partir do `main` atualizado, com um prefixo que indique o tipo da mudança:

```bash
git checkout main
git pull upstream main
git checkout -b feat/comando-quiz
```

Exemplos: `feat/comando-quiz`, `fix/contraste-tema-claro`, `docs/guia-supabase`, `refactor/handle-input`.

### Commits

Sugerimos o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/), em português:

```text
feat: adiciona comando quiz
fix: corrige contraste dos links no tema claro
docs: detalha variáveis de ambiente no README
refactor: extrai lógica de subcomandos do App.jsx
```

### Abrindo o PR

1. Atualize sua branch com o `main` antes de abrir o PR:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Faça o push para o seu fork e abra o PR para o `main` deste repositório.
3. No PR, explique **o que** mudou e **por quê**, e referencie a issue (ex.: `Closes #12`).
4. Para mudanças visuais, anexe **prints ou um GIF**, de preferência nos dois temas.

O `main` alimenta o site publicado, então a revisão é cuidadosa. Pode ser que eu peça ajustes; faz parte do processo. 😉

### ✅ Checklist do PR

```markdown
- [ ] `npm run lint` passa sem erros
- [ ] `npm run build` passa
- [ ] O site abre sem `.env.local`
- [ ] Testado nos temas escuro e claro
- [ ] Testado em PT e EN
- [ ] Testado em tela de celular
- [ ] Textos novos estão no `i18n.js`, nos dois idiomas
- [ ] Cores usam os tokens do `theme.css`
- [ ] README atualizado (se mudou comando ou configuração)
- [ ] Nenhum token, chave ou `.env.local` no commit
- [ ] Prints/GIF anexados (se houve mudança visual)
```

-----

## 🐛 Abrindo uma issue

Antes de abrir uma issue, veja se o assunto já não foi reportado. Para relatar um problema, inclua:

```markdown
**O que aconteceu?**

**O que era esperado?**

**Como reproduzir** (comandos digitados no terminal, na ordem)
1. `ajuda`
2. `guestbook add`
3. ...

**Ambiente**
- Navegador e versão:
- Sistema / dispositivo:
- Tema (claro/escuro):
- Idioma (PT/EN):

**Prints ou erros do console** (F12 → Console)
```

Para propor uma ideia, descreva o problema que ela resolve e, se for um comando, como seria usá-lo no terminal.

-----

## 🍴 Criando o seu portfólio a partir deste

O projeto nasceu como exercício de aula, e a ideia é justamente que você o use como ponto de partida. Para isso, **não é preciso abrir PR**: faça um fork e adapte à vontade.

O que trocar para deixar o portfólio com a sua cara:

| Onde | O quê |
|:--|:--|
| `src/i18n.js` | Biografia, cargos, descrições e todos os textos |
| `src/data/*.js` | Projetos, experiências, habilidades, prêmios e recomendações |
| `public/` | Avatar, logos, imagens dos projetos, favicon e os currículos `cv-pt.pdf` / `cv-en.pdf` |
| `scripts/lattes.mjs` | Rode `npm run lattes -- <CV_xxx.zip> [curriculo.pdf]` com a exportação do **seu** Lattes (veja o guia do comando lattes no README) |
| `src/config/gitHubApiConfig.js` | `USERNAME` do GitHub |
| `src/components/Contato.jsx` | Links de LinkedIn, GitHub, e-mail, WhatsApp, Discord e Instagram |
| `src/components/Calendly.jsx` | URL do seu Calendly |
| `src/components/Spotify.jsx` | Seus usuários do Spotify e do Last.fm |
| `src/config/wakaTimeConfig.js` e `vercel.json` | Seu usuário do WakaTime (veja o guia da WakaTime API no README) |
| `src/config/gitHubStatsConfig.js` e `vercel.json` | Seu usuário do GitHub no comando `stats` (veja o guia do comando stats no README) |
| `src/components/BoasVindas.jsx` e `BootSequence.jsx` | Arte ASCII, tela de boas-vindas e as linhas do boot (`BOOT_LINES`) |
| `index.html` | Título da aba e favicon |
| `.github/workflows/keep-supabase-awake.yml` | URL do seu projeto Supabase (e o secret `SUPABASE_API_KEY`) |

Alguns cuidados:

- **Remova as recomendações e as fotos em `public/linkedin/`.** São de pessoas reais e fazem sentido apenas no portfólio do autor.
- **Configure suas próprias contas** de EmailJS, GitHub e Supabase seguindo os guias do [README](README.md), e preencha o seu `.env.local` a partir do `.env.example`.
- **Mantenha o aviso de copyright do `LICENSE`**, que é a única exigência da licença MIT. Um link de volta para este repositório é bem-vindo, mas não obrigatório.

Fez o seu? Vou adorar ver! Mande o link pelo comando `contato` em [aramuni.dev](https://aramuni.dev/). 🚀

-----

## 📄 Licença

Ao contribuir, você concorda que sua contribuição será distribuída sob a mesma [MIT License](LICENSE) do projeto.

-----

## 💚 Apoie o projeto

Se este repositório te ajudou, deixe uma ⭐ no GitHub. Se quiser ir além, o projeto também aceita apoio pelo [GitHub Sponsors](https://github.com/sponsors/joaopauloaramuni).

Obrigado por contribuir! 💻
