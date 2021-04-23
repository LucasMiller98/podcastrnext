# Anotações

## Configurando o typeScript no next

- yarn add typescript @types/react @types/node -D

## Datas no JS

- yarn add date-fns

## GetStaticPaths

### Paths

- Se forem passados sozinhos, a build não irá gerar nada estático
- Se alguem acessar a página estática de um episodio e o ep não fio gerado no momento da build, ou seja, ele não foi passado no paths, ele vai retornar Erro 404;
- fallback false não retorna nada;
- fallback true se o ep não foi gerado de forma estática ele vai tentar gerar o episódio que a pessoa ta acessando pra criar uma página estática do ep, mas ele contece tudo no lado do client;
- fallback: 'blocking' e o true, dentro do next.js, chamamos de incremental static regeneration, pemite gerar páginas conforme as pessoas forem acessando e revalidar páginas e regerar paginas que estão com dados inválidos

## Context API

- Permite compartilhar dados a partir de componentes da aplicação

## Slider

- yarn add rc-slider

## Props

- Children -> não pode ficar como any, tem que tipar;
- O children pode ser qualquer coisa dendro do JSX do react;
- Na tipagem, ele deve ser colocado como ReactNode;
- ReactNode from 'react' ;