export const emailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // Pour le développement uniquement
  }
}; 