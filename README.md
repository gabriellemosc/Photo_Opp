#  Photo Opp  


O projeto simula uma **ativação interativa em um estande de evento**, onde o participante:

1. Inicia a experiência
2. Tira uma foto usando a câmera
3. A foto recebe uma **moldura personalizada**
4. O usuário aprova ou refaz a foto
5. Um **QR Code é gerado para download da imagem**

Também existe um **painel administrativo** com RBAC (controle de acesso por função) para visualizar e gerenciar as fotos capturadas.

---

# 🌐 Deploy do Projeto

A aplicação está disponível online:

🔗 https://next-lab-challenge-hkx2.vercel.app/

---

# 🔑 Credenciais para Teste

### 👤 Promotor

```
email: promotor@teste.com
senha: 123456
```

Acesso ao fluxo da ativação (iniciar, preparar câmera,tirar foto, aprovar, gerar QR Code).

### 👨‍💼 Admin

```
email: admin@admin.com
senha: admin123
```

Acesso ao **painel administrativo**, onde é possível:

* visualizar fotos capturadas
* filtrar por data
* paginação de resultados
* abrir QR Code da foto

---

# 🧠 Tecnologias Utilizadas

## Frontend

* React
* React Router
* Canvas API (manipulação de imagem)
* QRCode.react

## Backend

* Node.js
* Express
* JWT Authentication
* RBAC (Role Based Access Control)

## Banco de Dados

* PostgreSQL - Supabase (salvamento URL) 

## Storage

* AWS S3 (armazenamento das fotos)

## Deploy

* Vercel (Frontend + API)

---

# 📂 Estrutura do Projeto

```
project
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── components
│   │   ├── services
│   │   └── styles
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── services
│   └── database
│
└── README.md
```

---

#  Como Rodar o Projeto Localmente

## 1️⃣ Clonar o repositório

```bash
git clone https://github.com/gabriellemosc/Next_lab-Challenge.git
```

Entrar na pasta do projeto:

```bash
cd Next_lab_Challenge
```

---

#  Rodando o Backend

Entrar na pasta do backend:

```bash
cd backend
```

Instalar as dependências:

```bash
npm install
```

Criar o arquivo `.env` com as variáveis:

```
JWT_SECRET=seu_segredo

DATABASE_URL=postgres_connection_string

AWS_REGION=us-east-1
AWS_BUCKET=nome_do_bucket

AWS_ACCESS_KEY=access_key
AWS_SECRET_KEY=secret_key
```

Iniciar o servidor:

```bash
npm run dev
```

O backend ficará disponível em:

```
http://localhost:3000
```

---

#  Rodando o Frontend

Entrar na pasta do frontend:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Configurar a URL da API no arquivo:

```
src/services/api.js
```

Exemplo:

```javascript
const API_URL = "http://localhost:3000"
```

Iniciar o frontend:

```bash
npm run dev
```

A aplicação ficará disponível em:

```
http://localhost:5173
```

---

#  Fluxo da Aplicação

* 1️⃣ Login do promotor
* 2️⃣ Tela inicial (touch para iniciar)
* 3️⃣ Preparação câmera
* 4️⃣ Contagem regressiva
* 5️⃣ Foto Tirada
* 6️⃣ Revisão da foto
* 7️⃣ Geração de QR Code
* 8️⃣ Download da imagem

---

#  Painel Administrativo

O admin pode:

* visualizar fotos capturadas
* aplicar filtros por data
* navegar entre páginas
* abrir QR Code para download da imagem

---

#  Responsividade

A aplicação foi projetada para funcionar em:

* **Touchscreen**
* **Mobile**
* **Desktop**

---

#  Funcionalidades Implementadas

✔ Login com autenticação JWT
✔ RBAC (Promotor / Admin)
✔ Captura de foto pela câmera
✔ Manipulação de imagem com Canvas
✔ Aplicação de moldura
✔ Upload de imagem para AWS S3
✔ Geração de QR Code para download
✔ Painel administrativo com filtros
✔ Paginação de fotos

---

# 📄 Licença

Projeto desenvolvido apenas para **avaliação técnica**.
