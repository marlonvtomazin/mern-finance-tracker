### Estrutura
├── node_modules/
├── index.js             # Ponto de entrada e conexão com DB
├── package.json
├── package-lock.json
├── .env                 # Variáveis de ambiente
├── models/              # Schemas do Mongoose (User.js, WealthHistory.js)
├── routes/              # Definição das Rotas da API
|── middleware/          # Funções de Middleware (ex: JWT Protection)
|── controllers/         # Lógica da Aplicação (O que fazer quando uma rota é acessada)



### Tecnologias
* express: O framework do servidor.
* mongoose: Para interagir com o MongoDB Atlas.
* dotenv: Para gerenciar variáveis de ambiente (.env).
* cors: Para permitir requisições do seu front-end React.
* bcryptjs: Para criptografar senhas (segurança).
* jsonwebtoken (JWT): Para autenticação (login).
* nodemon: Para reiniciar o servidor automaticamente durante o desenvolvimento.