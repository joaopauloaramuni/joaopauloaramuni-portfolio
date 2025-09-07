// https://dashboard.emailjs.com/admin
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID_FOR_ME: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOR_ME, // template para você
  TEMPLATE_ID_FOR_SENDER: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_FOR_SENDER, // template de confirmação
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

export default EMAILJS_CONFIG;
