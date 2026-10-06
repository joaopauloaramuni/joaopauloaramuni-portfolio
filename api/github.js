// Vercel Function: /api/github?path=... ou /api/github?graphql=...
// Repassa a chamada à GitHub API com o token do site (GITHUB_SITE_TOKEN), que
// fica só no servidor. Regras e cache em api/_github.js.

import { atenderGitHub } from "./_github.js";

export default function handler(req, res) {
  return atenderGitHub(req, res, process.env.GITHUB_SITE_TOKEN);
}
