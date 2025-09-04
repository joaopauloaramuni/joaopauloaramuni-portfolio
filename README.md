-----

# Repo Portfólio Terminal 🖥️

![GitHub repo size](https://img.shields.io/github/repo-size/joaopauloaramuni/joaopauloaramuni-portfolio?style=for-the-badge&logo=files) ![GitHub directory file count](https://img.shields.io/github/directory-file-count/joaopauloaramuni/joaopauloaramuni-portfolio?style=for-the-badge&logo=files) ![GitHub stars](https://img.shields.io/github/stars/joaopauloaramuni/joaopauloaramuni-portfolio?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/joaopauloaramuni/joaopauloaramuni-portfolio?style=for-the-badge&logo=git) ![GitHub language count](https://img.shields.io/github/languages/count/joaopauloaramuni/joaopauloaramuni-portfolio?style=for-the-badge&logo=python) ![GitHub license](https://img.shields.io/github/license/joaopauloaramuni/joaopauloaramuni-portfolio?style=for-the-badge&color=007ec6&logo=opensourceinitiative) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/joaopauloaramuni/joaopauloaramuni-portfolio?style=for-the-badge&color=007ec6&logo=gitkraken) ![GitHub last commit](https://img.shields.io/github/last-commit/joaopauloaramuni/joaopauloaramuni-portfolio?style=for-the-badge&logo=clockify) ![Vercel](https://vercelbadge.vercel.app/api/joaopauloaramuni/joaopauloaramuni-portfolio?style=for-the-badge) ![Views Counter](https://views-counter.vercel.app/badge?pageId=https%3A%2F%2Fgithub%2Ecom%2Fjoaopauloaramuni%2Fjoaopauloaramuni-portfolio&leftColor=555555&rightColor=007ec6&type=total&label=RepoViews)  

-----

Este é o repositório do meu portfólio pessoal, um projeto desenvolvido com React e Vite para apresentar meus projetos, habilidades e experiências de forma interativa e moderna. Sinta-se à vontade para explorá-lo e utilizá-lo como desejar.

🖥️ O portfólio simula um **terminal** web, permitindo que visitantes explorem meu conteúdo através de comandos, tornando a navegação divertida e única. Entre os comandos disponíveis estão:

* 👤 **sobre:** Mostra uma breve descrição sobre mim.
* 📜 **ajuda:** Exibe a lista de comandos disponíveis.
* 🏢 **experiencias:** Mostra minha trajetória profissional e experiências.
* 📧 **contato:** Exibe minhas informações de contato e envia email.
* 🧹 **limpar:** Limpa o histórico do terminal.
* 👍 **recomendacoes:** Exibe minhas recomendações do LinkedIn.
* 🏆 **premios:** Mostra prêmios e reconhecimentos.
* 📂 **projetos:** Lista meus projetos desenvolvidos.
* 🎵 **spotify:** Mostra o que estou ouvindo e últimas reproduções.
* ⏱️ **wakatime:** Mostra quanto tempo passei programando e em quais linguagens.
* 📄 **curriculo:** Exibe meu currículo com visualização em PDF.
* 🕹️ **game:** Permite jogar o Flappy Plane diretamente no terminal web.

O portfólio integra componentes como **ProjectCard** e **ExperienceCard**, exibindo informações de forma dinâmica, além de suporte a múltiplos idiomas e visualização interativa de PDFs. Ele combina design moderno, navegação intuitiva e funcionalidades interativas, proporcionando uma experiência imersiva para quem deseja conhecer meu trabalho.

-----

## 🏫 História do projeto

Este projeto surgiu durante a minha disciplina de **Laboratório de Desenvolvimento de Software**, no curso de Engenharia de Software da PUC Minas. A proposta era que cada aluno desenvolvesse seu próprio portfólio profissional, aplicando conceitos de **engenharia de software** aprendidos na disciplina de **Projeto de Software**, da qual também leciono.

O objetivo foi integrar teoria e prática, incentivando a experimentação e o aprendizado “mão na massa”, enquanto os alunos criavam uma apresentação interativa de suas habilidades e projetos.

🏆 O grupo com o melhor portfólio ganhou como premiação um ano de domínio **pago** por mim (.dev, .io etc.) para cada integrante.

O exercício completo pode ser encontrado [aqui](https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software/tree/main/LABORATORIOS).

-----

## 🚀 Demonstração ao vivo

A versão online deste projeto está hospedada e pode ser acessada através do link abaixo:

- ➡️ **[https://joaopauloaramuni-portfolio.vercel.app/](https://joaopauloaramuni-portfolio.vercel.app/)**
- ➡️ **[https://aramuni.dev/](https://aramuni.dev/)**
  - 🔹 O domínio `.dev` é uma extensão popular entre desenvolvedores e profissionais de tecnologia.  
    Em setembro de 2025, o custo de um domínio `.dev` adquirido através da Vercel é de **US$ 13** por ano.  
    Você pode adquirir o seu domínio diretamente no [site da Vercel](https://vercel.com/domains).

-----

## 🛠️ Tecnologias utilizadas

* **React:** Biblioteca principal para a construção da interface.
* **Vite:** Ferramenta de build para um desenvolvimento rápido e otimizado.

-----

## 📦 Dependências

O projeto utiliza várias dependências importantes para funcionalidades específicas:

* **i18next & react-i18next:** Para suporte a internacionalização e múltiplos idiomas.
* **react-icons:** Para adicionar ícones facilmente na interface.
* **react-router-dom:** Para navegação entre páginas dentro do React.
* **react-terminal-ui:** Um componente de terminal React com suporte a temas claros e escuros, baseado em termynal.js.
* **react-type-animation:** Para animações de digitação de texto.
* **@react-pdf-viewer/core, @react-pdf-viewer/default-layout & pdfjs-dist:** Para exibir PDFs diretamente na aplicação de forma interativa e estilizada.
* **emailjs-com**: Para enviar e-mails diretamente do frontend sem precisar de um backend próprio.

Essas dependências permitem funcionalidades avançadas como visualização de PDFs, animações de terminal e suporte multilíngue.

-----

## 📬 Guia de configuração do EmailJS

Este guia descreve o passo a passo para configurar o envio de e-mails no seu projeto React usando EmailJS. Com o EmailJS, você pode enviar até 500 e-mails por dia gratuitamente.

-----

### 1. Criar uma conta no EmailJS

1. Acesse: [https://www.emailjs.com/](https://www.emailjs.com/)
2. Clique em **Sign Up** e crie sua conta gratuita.

### 2. Criar um serviço de e-mail

1. Após o login, vá para **Dashboard** → **Email Services**.
2. Clique em **Add new service**.
3. Escolha seu provedor de e-mail (Gmail, Outlook, etc.) e conecte sua conta.
4. Copie o **Service ID** gerado.

### 3. Criar um template de e-mail

1. Vá para **Email Templates** → **Create New Template**.
2. Configure os campos que deseja enviar, por exemplo: `user_name`, `user_email`, `message`.
3. Copie o **Template ID**.

#### Exemplo de template usado no projeto

<details>
  <summary>Clique para exibir</summary>
  
```html
<div style="
  font-family: system-ui, sans-serif, Arial;
  font-size: 14px;
  color: #e2e8f0;
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  border: 2px solid #00ff9d;
  border-radius: 10px;
  background-color: #0f172a;
  line-height: 1.6;
">
  <!-- Cabeçalho -->
  <div style="text-align: center; margin-bottom: 1.5rem;">
    <h2 style="color: #00ff9d; margin-bottom: 0.5rem;">Obrigado por entrar em contato!</h2>
    <p style="color: #a0aec0; margin: 0;">
      Recebi sua mensagem e responderei em até <strong>3 dias úteis</strong>.
    </p>
  </div>

  <!-- Bloco da mensagem enviada -->
  <div style="
    margin-top: 20px;
    padding: 15px;
    border: 1px dashed #00ff9d;
    border-radius: 8px;
    background-color: #1e293b;
  ">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="vertical-align: top; width: 50px;">
          <div style="
            padding: 10px;
            background-color: #00ff9d;
            border-radius: 50%;
            text-align: center;
            font-size: 24px;
            color: #0f172a;
          " role="img">👤</div>
        </td>
        <td style="vertical-align: top; padding-left: 10px;">
          <div style="color: #e2e8f0; font-size: 16px; font-weight: bold;">{{name}}</div>
          <div style="color: #a0aec0; font-size: 13px;">{{time}}</div>
          <p style="font-size: 15px; color: #e2e8f0;">{{message}}</p>
        </td>
      </tr>
    </table>
  </div>

  <!-- Rodapé com links -->
  <div style="margin-top: 20px; text-align: center; font-size: 14px; color: #a0aec0;">
    <p>
      Enquanto isso, fique à vontade para visitar meu
      <a href="https://www.linkedin.com/in/joaopauloaramuni/" style="color: #00ff9d; text-decoration: none;">LinkedIn</a>
      ou
      <a href="https://github.com/joaopauloaramuni" style="color: #00ff9d; text-decoration: none;">GitHub</a>.
    </p>
  </div>
</div>
```
</details>

### 4. Pegar a Public Key

1. Vá para **Integration** → **API Keys**.
2. Copie a **Public Key**.

### 5. Configurar `emailjsConfig.js`

Crie ou edite o arquivo `emailjsConfig.js` no seu projeto React e substitua pelos IDs obtidos:

```javascript
// https://dashboard.emailjs.com/admin
const EMAILJS_CONFIG = {
  SERVICE_ID: "seu_service_id_aqui", // substitua pelo seu Service ID
  TEMPLATE_ID: "seu_template_id_aqui", // substitua pelo seu Template ID
  PUBLIC_KEY: "seu_public_key_aqui", // substitua pela sua Public Key
};

export default EMAILJS_CONFIG;
```

Agora o projeto está pronto para enviar e-mails diretamente do frontend.

-----

## ⚙️ Como rodar o projeto localmente

Para executar este projeto no seu ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos

Antes de começar, certifique-se de ter o **[Node.js](https://nodejs.org/en/)** instalado na sua máquina. Ele é essencial para gerenciar as dependências do projeto.

### Passo a passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/joaopauloaramuni/joaopauloaramuni-portfolio.git
   ```

2. **Acesse o diretório do projeto:**

   ```bash
   cd joaopauloaramuni-portfolio
   ```

3. **Instale as dependências:**

   ```bash
   npm install
   ```

4. **Execute a aplicação:**

   ```bash
   npm run dev
   ```

5. Abra o endereço local exibido no terminal (geralmente `http://localhost:5173`) no seu navegador para ver o projeto em execução.

-----

## 🔗 Documentação e links úteis

* **react-terminal-ui:** [GitHub](https://github.com/jonmbake/react-terminal-ui) | [Demo](https://jonmbake.github.io/react-terminal-ui/demo/)
* **termynal.js (estilo do terminal):** [GitHub](https://github.com/ines/termynal)

-----

## 📄 Licença

Este projeto é distribuído sob a MIT License.

-----






