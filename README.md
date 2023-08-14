# api-roleplay-adonis
Projeto AdonisJS com TypeScript e TDD

### Tecnologias presente neste projeto
  - NodeJS
  - AdonisJS
  - Japa (Para testes - TDD)
  - MySql
  - SQlite
  - Insomnia
  - Docker
  - Docker-compose

### Instalação

#### Para realizar a instalação da aplicação (sem o docker):
 - Instale as dependências pelo comando `npm install` ou `yarn`;
 - Execute o comando `npm run dev` ou `yarn dev` ou `node ace serve --watch`;
 - A aplicação rodará na porta **3333** [localhost:3333](http://localhost:3333).
 
#### Para realizar a instalação da aplicação (com o docker):
 - Efetue a instalação do docker e docker-compose (link abaixo);
 - Execute o comando `sudo docker-compose up -d`;
 - Verifique se a aplicação está rodando corretamente com o comando `sudo docker ps -a`;
 - Caso tudo ok basta acessar via browser pelo link: http://localhost:3333.

### Execução de Testes
 - `npm test` ou `yarn test` - Executa testes unitários atraves do JAPA;
 - Para os testes serem executados nesta versão do JAPA ajuste as seguintes dependencias no package.json e suas respectivas versões conforme segue abaixo. 
 	`"execa": "^5.1.1",`
	`"get-port": "^5.1.1",`
	`"@adonisjs/mail": "^7.2.2",`
 - Execute `yarn` no terminal para atualização/downgrade das versões. 
 
#### Após a atualização do JAPA no Adonis alguns testes devem ser executados da seguinte forma. 
 - `node ace test` - Esse comando executa os testes que já foram refatorados, enquanto o comando anterior executa os testes que ainda estão na versão antiga do JAPA.
  - Para os testes serem executados nesta versão do JAPA ajuste as seguintes dependencias no package.json e suas respectivas versões conforme segue abaixo. 
 	`"execa": "^6.1.0",`
	`"get-port": "^6.1.2",`
	`"@adonisjs/mail": "^8.0.1",`
 - Execute `yarn` no terminal para atualização/downgrade das versões. 


### Utilização do Insomnia
 - No arquivo `Insomnia_Roleplay.json` , dentro do diretŕoio raiz você pode importar para o Insomnia onde já existe todas requisições pré configuradas para testes no mesmo. 
 
## Comandos Úteis
 - Atualizar dependência do Lucid com SQLITE3 - `yarn add @vscode/sqlite3 -D`
 - Buscar Updates Adonis - `npx npm-check-updates -i`
 - Atualizar comandos ACE - `node ace generate:manifest`
 - Configurar nova versão dos testes JAPA - `node ace configure tests`
 - Obs.: Necessário configurar o MySQL com usuário root e criação do database. 

### Links Úteis
 - https://docs.docker.com/
 - https://adonisjs.com/
 - https://docs.adonisjs.com/releases/april-2022-release (Atualização JAPA)
