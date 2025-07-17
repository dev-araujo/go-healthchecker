
# Go Health Checker

O **Go Health Checker** é uma aplicação de monitoramento do status de saúde de URLs. Ele permite que os usuários insiram URLs e verifiquem se os serviços estão online, o tempo de latência e o status HTTP. A aplicação é construída com um backend em **Go** e um frontend em **Angular**.


## Resultado ✨

- **Você pode conferir o resultado nos seguintes locais:** 
  - **[Front - VERCEL](https://go-health-checker.vercel.app/)**
  - **[Backend - RENDER](https://go-healthchecker.onrender.com)**

![](./assets/ui.png)

> Nota: O acesso aos links pode conter instabilidade por estarem hospedados em serviços gratuitos. **Para uma melhor experiência rode localmente**. 

## ✨ Funcionalidades

  * **Verificação de Status de URL:** Verifica o status de uma lista de URLs de forma concorrente, aproveitando o poder das goroutines em Go.
  * **Adicionar e Remover URLs:** Interface intuitiva para adicionar e remover URLs da lista de monitoramento.
  * **Edição de URL:** Permite a alteração de uma URL diretamente na tabela de exibição.
  * **Detalhes da Verificação:** Exibe o status (Online/Offline), o código e a mensagem de status HTTP, e a latência em milissegundos para cada URL.

  * **Atualização em Tempo Real:** Permite que os usuários atualizem o status de todas as URLs com um único clique.
  * **Feedback Visual:** Utiliza indicadores de cor e ícones para um entendimento rápido do status dos serviços.

## 🚀 Tecnologias Utilizadas

### Backend

  * **Go:** Linguagem utilizada para construir um servidor web robusto e uma API eficiente.
  * **Goroutines:** Para tratamento concorrente das verificações de saúde, garantindo que a verificação de múltiplas URLs não bloqueie a aplicação.
  * **API RESTful:** Um único endpoint para verificar o status das URLs.

### Frontend

  * **Angular (v20):** Framework moderno para a construção da interface do usuário 
  * **Angular Material:** Biblioteca de componentes de UI 
  * **RxJS:** Usado para gerenciar eventos e chamadas assíncronas de forma reativa, especialmente na comunicação com a API.



## ⚡️ Rodando Localmente

#### 📋 Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas em sua máquina:

  * [Go](https://go.dev/dl/) (versão 1.18 ou superior)
  * [Node.js](https://nodejs.org/en/download/) (versão 20 ou superior)
  * [Angular CLI](https://angular.io/cli) (versão 20 ou superior)

Siga estas instruções para obter uma cópia do projeto em funcionamento na sua máquina local para fins de desenvolvimento e teste.

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

## ⚙️ API

A aplicação utiliza uma API RESTful simples para a comunicação entre o frontend e o backend.

### Endpoint de Verificação de Saúde

  * **Endpoint:** `/check`
  * **Método:** `POST`
  * **Descrição:** Recebe uma lista de URLs e retorna o status de saúde de cada uma.
  * **Payload da Requisição:**
    ```json
    {
      "urls": [
        "https://www.google.com",
        "https://api.github.com"
      ]
    }
    ```
  * **Resposta de Sucesso:**
    ```json
    {
        "status": "success",
        "checkedAt": "2024-07-18T19:55:41.134324Z",
        "durationSeconds": 0.2223,
        "summary": {
            "total": 4,
            "successful": 2,
            "failed": 2
        },
        "results": [
            {
                "url": "https://httpstat.us/500",
                "isUp": false,
                "statusCode": 500,
                "statusText": "Internal Server Error",
                "latencyMs": 221,
                "error": "500 Internal Server Error"
            },
            {
                "url": "https://www.google.com",
                "isUp": true,
                "statusCode": 200,
                "statusText": "OK",
                "latencyMs": 59
            },
            {
                "url": "https://api.github.com",
                "isUp": true,
                "statusCode": 200,
                "statusText": "OK",
                "latencyMs": 105
            },
            {
                "url": "https://httpstat.us/404",
                "isUp": false,
                "statusCode": 404,
                "statusText": "Not Found",
                "latencyMs": 218,
                "error": "404 Not Found"
            }
        ]
    }
    ```

---
#### Autor 👷

<img src="https://avatars.githubusercontent.com/u/97068163?v=4" width=120 />

[Adriano P Araujo](https://www.linkedin.com/in/araujocode/)