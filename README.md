# Stage Project 🚀

Projeto desenvolvido e dedicado ao Case Tech da Stage Consulting. 

O projeto visa a criação de processos e subprocessos separados por área/departamento de uma empresa, visando a organização clara e visual.

A aplicação possui um back-end em .NET e um front-end moderno com React + Vite.

## 🏗️ Estrutura do Projeto

O repositório está dividido em duas partes principais:

* **/back**: API desenvolvida em ASP.NET Core (C#).
* **/front**: Interface de usuário desenvolvida com React, Vite e Axios.

---

## 🛠️ Tecnologias Utilizadas

### Back-end
* .NET 8 / ASP.NET Core
* Entity Framework Core (C#)
* MySQL (Workbench)
* Swagger (Documentação da API)

### Front-end
* React.js
* Vite (Build tool)
* Axios (Consumo de API)
* React Router Dom (Navegação)
* React Toastify (Para notificações de sucesso/alerta)

---

## 🚀 Como Executar o Projeto
### 1. Rodando o Back-end
1. Navegue até a pasta `back`.
2. Abra o arquivo `.csproj` no Visual Studio ou use o terminal:
   `dotnet restore`
   `dotnet run`
As API's estaram disponiveis no Swagger no endereço `https://localhost:7064/`

### 2. Rodando o Front-end
1. Navegue até a pasta `front`.
2. Instale as dependencias `npm install`, `npm install axios`, `npm install react-router-dom` e `npm install react-toastify`
3. NO terminal rode o comando:
   `npm run dev`
O Front estará disponivel no endereço `https://localhost:5173/`


