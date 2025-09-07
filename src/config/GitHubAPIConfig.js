// gitHubApiConfig.js
const GITHUB_API_CONFIG = {
  USERNAME: "joaopauloaramuni",
  TOKEN: import.meta.env.VITE_GITHUB_TOKEN,
  BASE_URL: "https://api.github.com",
  PER_PAGE: 100, // quantidade máxima de repositórios por página
};

export default GITHUB_API_CONFIG;
