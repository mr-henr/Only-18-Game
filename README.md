# Noite de Desafios — v0.7

Jogo social adulto (18+) com dados, cartas paramétricas e sistema de limites
individuais. Roda no navegador, em celular, PC ou TV.

## Rodar

```bash
npm install

# Modo tela única (um aparelho só)
npm run dev        # abre em http://localhost:5173

# Modo TV + celulares
npm run start      # build + servidor em http://<seu-ip>:8787
npm run dev:tv     # Vite + servidor juntos, para desenvolver

npm run check      # valida as regras do motor e da rede, sem navegador
npm run docs       # regenera docs/CARTAS.md a partir dos baralhos
npm run build      # gera dist/
```

> Os celulares precisam usar o **endereço de rede** que o servidor imprime
> (`http://192.168.x.x:8787`), não `localhost` — `localhost` só existe dentro
> do aparelho onde a mesa foi aberta. A própria tela avisa quando isso acontece.

## Publicar

O servidor de partidas **também serve a interface**. Então o jeito mais simples
de ter tudo funcionando — incluindo TV + celulares — é uma hospedagem só, com
Node. Não precisa de GitHub Pages junto.

### Opção 1 — tudo em um lugar (recomendado)

Qualquer hospedagem gratuita que rode um processo Node e aceite WebSocket serve.
O repositório já vem com os dois formatos que elas pedem:

- **`render.yaml`** — no [Render](https://render.com), *New → Blueprint*,
  aponte para este repositório e pronto. Ele lê o arquivo, constrói e sobe.
- **`Dockerfile`** — para qualquer lugar que aceite container (Koyeb, Fly,
  Railway, um Raspberry Pi na sua casa). A imagem já sai com a interface
  construída e só as dependências de produção.

Uma coisa a saber sobre planos gratuitos: eles **derrubam o servidor depois de
alguns minutos parado** e ele leva até um minuto para voltar. Quem abrir a mesa
primeiro paga essa espera. O jogo detecta isso e mostra uma tela explicando —
em vez de parecer quebrado.

### Opção 2 — o servidor na sua casa

Para o modo TV + celulares, **todo mundo já está na mesma sala e no mesmo
wi-fi**. Um servidor na nuvem não traz vantagem nenhuma: só adiciona latência e
uma espera para acordar.

```bash
npm run start
```

Ele imprime o endereço de rede. Abra na TV, os celulares entram pelo QR code.
Zero hospedagem, zero conta, zero espera — só precisa de um computador ligado.

### Opção 3 — GitHub Pages (só o modo de um aparelho)

**https://mr-henr.github.io/Only-18-Game/**

O Pages serve apenas arquivos estáticos, então lá funciona:

| | no Pages |
|---|---|
| 📱 **Um aparelho só** | ✅ completo — 243 cartas, limites, prendas, cronômetro, som |
| 📺 **TV + celulares** | ❌ precisa do Node; o jogo detecta e explica na tela |

Dá para combinar: interface no Pages e servidor em outro lugar. Crie a
*repository variable* `VITE_SERVER_URL` no GitHub apontando para o servidor
(ex.: `https://noite-de-desafios.onrender.com`) e a publicação passa a usar
esse endereço sozinha.

A cada push na `main`, o workflow `.github/workflows/pages.yml` roda
`npm run check` (as 99 verificações de regra, privacidade e autorização),
confere se `docs/CARTAS.md` está atualizado e só então publica.

> **Antes de publicar em qualquer lugar:** o conteúdo é adulto e explícito.
> Vale conferir a política de uso da plataforma escolhida — algumas restringem
> conteúdo sexual, e isso vale tanto para o repositório quanto para o site. O
> `<meta name="robots" content="noindex">` já está no HTML desde a v0.3.

## O que existe nesta versão

- **5 modos de jogo** — Leve, Ousado, Adulto, Bate-Pronto e Livre. O modo define
  o **teto** do conteúdo e esse teto não pode ser furado por configuração.

  | Modo | Teto do conteúdo |
  |---|---|
  | 🌙 **Leve** | Perguntas picantes, constrangimento, desafios sociais e contato físico não sexual. Sem nudez, sem sexo. |
  | 🔥 **Ousado** | Contato físico, beijos e a roupa saindo **até a nudez completa**. Nenhum contato sexual: seios, glúteos e genitais não existem como alvo de ação. |
  | 🔥🔥 **Adulto** | Onde começa o **contato físico sexual** — partes íntimas como alvo, atos sexuais, BDSM e exposição, tudo sujeito aos limites individuais. |
  | ⚡ **Bate-Pronto** | Mesmo teto do Adulto, mas define os limites uma vez e a partida vira rola → revela → faz. |
  | 🛠️ **Livre** | Mesmo teto do Adulto, com nada ligado por padrão: cada jogador monta item por item. |
- **🍻 Opção de bebida**, marcada antes do modo. Liga um baralho inteiro e uma
  aba própria de limites. Desligada, nenhuma carta alcoólica é carregada.
- **123 limites individuais** em 10 grupos, cada um com três estados:
  ✅ permitir · ⚠️ perguntar antes · 🚫 bloquear.
- **243 moldes de carta** paramétricos, que geram milhares de variações reais.
  O catálogo completo está em [`docs/CARTAS.md`](docs/CARTAS.md) (`npm run docs`).
- **🎭 Prendas opcionais** combinadas pelo grupo para quem não cumprir — sempre
  com a saída de pular mesmo assim.
- **Fluxo completo**: bebida → modo → jogadores → limites (passe o aparelho) →
  conferência e prendas → partida → encerramento.
- **📺 Dois jeitos de jogar**: um aparelho só (passa de mão em mão, funciona sem
  internet) ou **TV + celulares**, com a tela grande mostrando a partida e cada
  celular como controle.

## Arquitetura

```
src/
  data/                 conteúdo — nenhuma regra, só dados
    gameModes.js        os 5 modos, seu tier e a política padrão por grupo
    limitsCatalog.js    os 123 itens de limite (fonte única da verdade)
    bodyParts.js        partes do corpo, com formas gramaticais
    pools.js            valores possíveis das lacunas das cartas
    penalties.js        sugestões de prenda para quem não cumprir
    decks/              os baralhos, um arquivo por tema

  engine/               regras — puro, sem DOM, pronto para virar backend
    limitsEngine.js     estado dos limites, cascatas e dupla confirmação
    slotResolver.js     resolve as lacunas das cartas contra os limites
    contentFilter.js    o pipeline que decide qual carta pode aparecer
    diceEngine.js       os três dados e sua conversão em filtro
    gameEngine.js       turnos, consentimento, intensidade e pontuação

  net/
    session.js          cliente WebSocket: recebe a visão, envia ações

  ui/                   telas — só lê estado e chama o engine
    fx.js               som sintetizado, vibração e clarão de tela
    components/         dados 3D e cronômetro

  styles/
    main.css            base, layout e componentes
    themes.css          a paleta de cada modo
    motion.css          dados 3D, virada de carta e transições
    tv.css              mesa, controle e responsividade

server/                 o mesmo motor, rodando de verdade no modo TV
  index.js              HTTP + WebSocket
  rooms.js              salas, entrada e reconexão
  views.js              o que cada papel pode ver
  actions.js            o que cada papel pode fazer
```

O `engine/` não importa nada de `ui/` e nunca toca no DOM. Foi essa disciplina
que permitiu, na v0.5, mover o motor inteiro para `server/` sem alterar uma
linha: a interface passou a falar por WebSocket em vez de chamar os métodos
direto.

## Equilíbrio do baralho

| | 🌙 Leve | 🔥 Ousado | 🔥🔥 Adulto |
|---|---|---|---|
| Cartas disponíveis | 102 | 186 | 243 |

Cada baralho fica entre 25 e 48 cartas, e o conteúdo é equilibrado também entre
formatos: **182 cartas para um casal** e **223 para um grupo**, sendo 20
exclusivas de dois jogadores (`maxPlayers: 2`) e 61 exclusivas de grupo
(`minPlayers: 3`). Votação com duas pessoas não é votação, e carta de
intimidade a dois não funciona com a sala inteira olhando — o filtro separa as
duas coisas. `npm run check` falha se esse equilíbrio se perder.

## As cinco regras que não podem quebrar

**1. Teto do modo.** Cartas e limites acima do `tier` do modo nem são
carregados. É impossível chegar a conteúdo do Modo 3 jogando no Modo 1.

**2. O bloqueio vale para quem bloqueou.** Um requisito é avaliado contra quem
**participa** da carta, e no papel em que participa. Quem bloqueou roupa nunca
precisa tirar a própria roupa — mas as cartas de roupa entre as outras pessoas
continuam existindo normalmente. Bloquear protege você, não apaga o jogo dos
outros. A exceção é a carta que envolve a mesa inteira: nessa, todos precisam
topar.

Se alguém marcou "perguntar antes", a carta entra com confirmação privada — e
**sem os nomes de quem está envolvido**, para a decisão ser sobre o desafio e
não sobre a pessoa. Os nomes aparecem depois do "Pode vir". Recusar não custa
pontos nem revela quem recusou.

**3. Dupla confirmação.** Permitir "Beijo nos genitais" na aba 💋 pré-marca
"Fazer sexo oral" na aba 🔞, sinalizado como herdado. Até o jogador passar pela
aba adulta e confirmar, o motor trata o item como ⚠️ — ou seja, pergunta antes
de usar em vez de executar direto.

**4. Regra do parceiro.** Quem marca "somente com meu parceiro" só entra em
cartas físicas ao lado do próprio par, e o par recebe um aviso na tela dele.
Não existe escolher alvo arbitrário: o alvo é o parceiro, um sorteio entre
elegíveis, ou todos.

**5. Pular é sempre grátis.** Sem justificativa e sem custo. O grupo pode
combinar prendas na preparação — o jogo então *lembra* do combinado quando
alguém pula, mas a tela nunca deixa de oferecer "passo mesmo assim". Prendas
que dependem de bebida, roupa ou BDSM só são oferecidas se **todos** aceitarem
aquele limite.

## Cartas paramétricas

Uma carta é um molde com lacunas. O `SlotResolver` testa **valor a valor**
contra os limites de quem está envolvido:

```js
{
  id: 'c_kiss_part',
  text: '{actor}, dê {style} em {target} — {bodyPart.em}.',
  slots: {
    bodyPart: { pool: 'bodyParts', filter: { kissable: true }, limitKey: 'kiss_{id}' },
    style:    { pool: 'kissStyle' }
  }
}
```

Se alguém bloqueou os pés, a carta não morre — ela sai com outra parte do corpo.
Ela só é descartada se *nenhuma* combinação sobreviver. Esse molde sozinho gera
56 variações válidas para um casal no nível 5.

## Pipeline do ContentFilter

```
baralho
 → byMode          teto duro do modo (+ bebida ligada ou não)
 → byIntensity     nível da partida ∧ teto individual de cada um
 → byParticipants  nº de jogadores, minPlayers/maxPlayers e papéis
 → byDynamics      regra do parceiro, trios, desafio coletivo
 → resolveSlots    poda as combinações bloqueadas
 → byLimits        estado efetivo = pior estado entre todos os envolvidos
 → weight          desejos declarados, variedade, repetição recente
 → pick
```

Os dados são uma **sugestão**, nunca uma obrigação: se o resultado exato não tem
carta viável, o filtro afrouxa nesta ordem — alvo, tipo, intensidade — em vez de
travar o turno ou forçar conteúdo bloqueado.

## A noite sobe sozinha (v0.7)

A partida começa leve e vai esquentando conforme o grupo joga — sem ninguém
precisar apertar nada. O ritmo sai de três coisas:

| | efeito |
|---|---|
| **Quantos jogadores** | mais gente = mais cartas por nível, para todo mundo passar pela vez antes de o clima mudar |
| **Quanto foi liberado** | mesa que permitiu quase tudo sobe rápido; mesa restrita sobe devagar |
| **Cumprir ou pular** | cada "Feito" empurra (carta ousada vale por duas); cada "Pular" segura |

Na prática: um casal que liberou tudo sobe a cada 2 cartas cumpridas; um grupo
de seis com bastante bloqueio leva 9. A barrinha abaixo da intensidade mostra o
quanto falta, e o texto avisa — a mudança nunca é inexplicada.

De vez em quando o jogo **solta uma carta um nível acima** do atual, para o
grupo sentir o próximo degrau antes de subir de vez. A chance começa em 15% e
cresce conforme o embalo. Nunca passa do teto do modo nem do menor limite
individual da mesa. E os botões de subir e baixar na mão continuam ali.

## Partida de dois (v0.7)

Cartas escritas para grupo ganharam uma **segunda redação** para quando só
existem duas pessoas: "o grupo dá nota" vira "{target} dá a nota", "todos
bebem" vira "os dois bebem". São 19 cartas com redação própria, e o motor
escolhe sozinho pelo tamanho da mesa.

Cartas que só funcionam com plateia (votação, "quem chegar mais perto") ficam
de fora de uma mesa de dois, e as escritas para casal ganham prioridade no
sorteio. Um casal no Modo Adulto tem 145 jogadas possíveis.

## Tutorial e clareza (v0.6)

Na primeira vez que alguém abre o jogo, ele se explica antes de pedir qualquer
coisa: **8 telas, uma ideia cada**, com as peças de verdade — os dados são os
dados, a carta é uma carta, e no passo dos limites a pessoa **toca nos três
botões e vê na hora o que cada um faz**.

Regras que segui nos textos, em todas as telas:

- uma ideia por tela, frase curta, exemplo concreto antes da definição;
- **zero vocabulário interno**. "Teto do modo", "dupla confirmação" e "carta
  paramétrica" são palavras nossas, de quem construiu — não de quem senta para
  jogar. Na tela virou "o modo é o limite máximo da noite", "você permitiu a
  mesma coisa em outra aba, com outro nome" e nada;
- toda tela difícil ganhou ajuda no lugar onde a dúvida aparece.

A tela de limites, que é a mais densa do jogo, agora abre com os **três estados
explicados por extenso** sempre à vista, e uma caixa de dúvidas que responde o
que as pessoas realmente perguntam: *preciso marcar tudo? alguém vai ver o que
eu marquei? por que já veio amarelo? e se eu me arrepender no meio?*

## TV + celulares (v0.5)

A TV mostra a partida; cada celular é um controle. A divisão segue o que faz
sentido na sala de verdade:

| | decide |
|---|---|
| 📺 **Mesa** | modo, bebida, pares, prendas, intensidade, começar e encerrar |
| 📱 **Celular** | os próprios limites, a própria rolagem, a própria confirmação, cumprir ou pular a própria carta |

**O motor roda no servidor**, não em cada navegador — era para isso que
`src/engine/` foi mantido sem uma linha de DOM desde a v0.3. Os mesmos arquivos
subiram para `server/` sem nenhuma alteração.

**Cada cliente recebe só o que pode ver.** Isso é feito em `server/views.js`, no
servidor, e não escondendo elementos na interface — esconder na tela não
bastaria, bastaria abrir o inspetor na TV:

- **carta privada** → o texto vai só para o celular de quem é da vez. A TV
  recebe `{ kind: 'private-hidden', holder: 'ANA' }` e mais nada;
- **confirmação privada** → o texto vai só para quem precisa responder, e a TV
  **nem fica sabendo de quem** o jogo está esperando. Dizer o nome já entregaria
  que aquela pessoa marcou "⚠️ perguntar antes" naquele assunto;
- **limites** → cada celular recebe apenas os seus. A mesa vê só quantos itens
  cada um permitiu, nunca quais.

`npm run check` tem uma seção inteira só para isso: ela monta uma sala de
verdade, força uma carta privada e uma confirmação, e falha se o texto aparecer
em qualquer visão que não seja a certa.

**Nada é aceito do jeito que chega.** O `playerId` vem da conexão, nunca da
mensagem; um celular não consegue rolar fora da vez, começar a partida no lugar
da mesa nem jogar pelos outros. E os limites enviados pelo celular são
reconstruídos do zero a partir do modo — item desconhecido, estado inválido ou
dupla confirmação forjada são descartados.

**Reconexão**: quem perde o wi-fi volta para a própria cadeira ao entrar com o
mesmo nome, em vez de virar um jogador novo. A mesa caindo não derruba a
partida.

## Compatibilidade e responsividade

Três superfícies, uma folha de estilo (`styles/tv.css`), escolhidas por um
`data-surface` no `<html>`:

| | tratamento |
|---|---|
| 📱 **Celular** | uma coluna, alvos de toque grandes, barra superior enxuta, layout próprio para tela deitada |
| 💻 **PC** | a referência; duas colunas onde couber |
| 📺 **TV** | tudo cresce (fonte, dados, cartas, botões), foco visível em vez de hover, margem extra contra o corte de borda das TVs |

Verificado sem transbordo horizontal em 390px, 1100px e 1920px, incluindo a tela
de limites, que é a mais densa do jogo.

## Camada visual (v0.4)

Nenhuma regra mudou nesta versão — o motor e os 243 moldes de carta são os
mesmos. O que entrou foi apresentação:

- **Identidade por modo.** O modo escolhido troca a paleta inteira: azul frio no
  Leve, âmbar no Ousado, vermelho no Adulto, amarelo elétrico e cantos duros no
  Bate-Pronto, turquesa no Livre. Tudo por tokens em `themes.css`, trocados por
  um `data-mode` no `<html>`.
- **Dados 3D de verdade.** Cubos em CSS 3D que caem escalonados. O motor sorteia
  **antes** da animação, então o dado gira e para na face certa — em vez de
  girar aleatório e trocar o ícone no fim.
- **Carta privada que vira.** O verso fica na mesa e gira 180° quando quem é da
  vez toca, com o verso desenhado na cor do modo.
- **Som sem nenhum arquivo.** `fx.js` sintetiza tudo com WebAudio na hora: dados
  batendo, carta virando, confirmação, prenda, subida de nível. Silenciável pelo
  botão na barra, com a escolha guardada entre sessões.
- **Vibração** nos mesmos momentos, quando o aparelho suporta.
- **`prefers-reduced-motion` respeitado**: sem animação nenhuma, e os dados
  mostram o resultado certo instantaneamente.
- **⏱️ Cronômetro** nas 72 cartas que pedem um tempo. Anel que drena, contagem
  audível nos últimos 5 segundos e um estado final verde. Ele é *ajuda*, não
  juiz: dá para pausar, zerar, e ninguém precisa esperar o apito para parar.

## Próximos passos

- **Hospedar o servidor** para o modo TV funcionar na versão publicada.

- **v0.6 — Multiplayer**: `engine/` sobe para um servidor Node, salas por código
  e QR, celulares como controle (modo TV + celulares já previsto na UI).
- **v1.0 — Visual 3D**: mesa virtual, objetos 3D, ambientação por modo.

---

Conteúdo adulto, para maiores de 18 anos, entre participantes que estão jogando
por vontade própria. O botão **PULAR** está sempre disponível, sem penalidade e
sem justificativa.
