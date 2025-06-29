# Trabalho #2 - API MASHUP

##  Autor
**António Pedro Magalhães Canelas**  
**Número:** 31834

---

## 📄 Descrição do Trabalho

Este projeto consiste numa aplicação web com autenticação que permite pesquisar filmes e séries, combinando informações de múltiplas APIs externas.

### O que faz:
- Permite ao utilizador registar-se, fazer login e logout.
- Pesquisar por filmes ou séries (mesmo com pequenos erros nos títulos).
- Apresenta os dados recolhidos da **API TMDB** (título, imagem, data, resumo).
- Mostra também um resumo da **Wikipedia**.
- Guarda e apresenta o histórico de pesquisas de cada utilizador.

---

##  Publicação Online
O projeto está disponível aqui:  
🔗 **[https://mashup-filmes-series.onrender.com](https://mashup-filmes-series.onrender.com)**

---

## 🛠️ Como instalar e correr localmente

### 1. Clonar o repositório:
```bash
git clone https://github.com/PWEB-2425/trabalho2-mashup-apis-antonio1canelas.git
cd trabalho2-mashup-apis-antonio1canelas
```

### 2. Instalar dependências:
```bash
npm install
```

### 3. Criar ficheiro `.env` na raiz com:
```env
MONGO_URI=mongodb+srv://admin:admin@cluster0.dqzmlwx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
SESSION_SECRET=batatinha123segredo
TMDB_API_KEY=1bb3ddba950835ceaef558913b653d59
```

### 4. Correr o servidor:
```bash
node server.js
```

---

##  Descrição da Base de Dados (MongoDB)

- Utiliza **MongoDB Atlas**.
- Coleção `users`:
  ```js
  {
    username: String,
    password: String (hashed com bcrypt),
    searches: [String] // histórico de pesquisas
  }
  ```

---

##  Descrição da Autenticação

- Autenticação implementada com **Passport.js** e **session-based login**.
- Passwords armazenadas com **bcrypt (hash)**.
- Apenas utilizadores autenticados podem aceder à dashboard e pesquisar filmes/séries.

---

##  APIs Usadas

- [TMDB API](https://www.themoviedb.org/documentation/api)
- [Wikipedia REST API](https://en.wikipedia.org/api/rest_v1/)

---

##  Notas finais

- O projeto foi desenvolvido com Node.js, Express e EJS.
- O deploy foi feito com [Render.com](https://render.com).
- Foram seguidas boas práticas de modularização (routes, models, views).
- A aplicação é responsiva e testada com filmes e séries em português e inglês.

---

### ✅ Concluído com sucesso! 🚀