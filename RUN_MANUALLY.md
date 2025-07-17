## ⚡️ Rodando Localmente (Manualmente)

Siga estas instruções para obter uma cópia do projeto em funcionamento na sua máquina local para fins de desenvolvimento e teste.

#### 📋 Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas em sua máquina:

  * [Go](https://go.dev/dl/) (versão 1.18 ou superior)
  * [Node.js](https://nodejs.org/en/download/) (versão 20 ou superior)
  * [Angular CLI](https://angular.io/cli) (versão 20 ou superior)


#### Backend

1.  Clone o repositório:
    ```bash
    git clone https://github.com/dev-araujo/go-healthchecker.git
    ```
2.  Navegue até o diretório do backend:
    ```bash
    cd go-healthchecker/backend
    ```
3.  Execute o servidor:
    ```bash
    go run cmd/api/main.go
    ```
    O servidor do backend estará em execução em `http://localhost:8080`.

### Frontend

1.  Abra um novo terminal e navegue até o diretório do frontend:
    ```bash
    cd go-healthchecker/frontend
    ```
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento do Angular:
    ```bash
    npm run dev
    ```
    A aplicação frontend estará acessível em `http://localhost:4200/`. O aplicativo se conectará automaticamente ao backend em `http://localhost:8080` conforme definido no ambiente de desenvolvimento.