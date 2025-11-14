const logRegistroUsuario = ({ username, email, token, expiracion }) => {
  console.log('✅ Registro exitoso');
  console.log(`👤 Usuario: ${username}`);
  console.log(`📧 Email: ${email}`);
  console.log(`🔐 Token: ${token}`);
  console.log(`⏰ Expira: ${expiracion}`);
};

module.exports = { logRegistroUsuario };

