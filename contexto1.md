# Projeto: Noite de Desafios - Contexto Completo e GDD

Este documento contém o histórico completo de ideação e desenvolvimento do jogo "Noite de Desafios". Leia todo o histórico abaixo para entender a arquitetura, as mecânicas, os modos de jogo e o sistema de limites decididos até o momento. Ao final do documento, há as instruções exatas de como você deve prosseguir.

---

## 💬 Histórico Completo da Conversa

**Usuário:**
Preciso de ajuda para elaborar uma ideia.
Quero fazer um jogo web (que tenha compatibilidade com celular, computador e Televisão)
A ideia é ser um jogo adulto, sexual
Eu pensei em envolver dados e cartas, mas a ideia pode mudar conforme oq você me ajudar a pensar.

**Assistente (GPT):**
Dá para desenvolver a ideia como um jogo adulto para maiores de 18, focado em interação entre jogadores, sorte, escolhas e desafios de teor sensual — e podemos trabalhar bastante na parte de game design, regras, progressão, interface e arquitetura web.
Uma direção interessante seria não deixar o jogo simplesmente como “jogar dados e cumprir uma carta”, mas criar um sistema que gere uma experiência diferente a cada partida.

Por exemplo:
🎲 Conceito inicial — "Noite de Desafios"
Um jogo para 2 ou mais adultos, funcionando em celular, PC e TV.
A partida teria:
* Dados → determinam categoria, intensidade ou quem joga.
* Cartas → apresentam desafios/perguntas/ações de teor sensual.
* Afinidade → jogadores acumulam pontos conforme interagem.
* Nível de intensidade → a partida começa leve e pode avançar gradualmente.
* Limites individuais → cada jogador define previamente categorias que aceita ou não.
* Papéis/personagens → poderiam existir arquétipos diferentes para mudar a dinâmica.
* Objetivos → em vez de simplesmente “quem fizer mais pontos ganha”, a partida poderia ter objetivos secretos ou coletivos.

📱🖥️📺 O diferencial para web
Eu faria a arquitetura pensando em uma tela principal + celulares como controles.
TV/PC: Mostra o tabuleiro, jogadores, cartas, animações e resultado dos dados.
Celulares: Cada jogador entra por um código/QR Code e usa o celular para escolher respostas, votar, rolar dados, receber cartas secretas, aceitar/pular desafios, etc.

🃏 E podemos ir além de cartas fixas
Um sistema que acho particularmente interessante: Carta = estrutura + parâmetros. Em vez de armazenar "Carta X: faça determinada coisa", a carta poderia ter:
Categoria: Intimidade | Intensidade: 2 | Jogadores: 2 | Duração: 60s | Visibilidade: Privada | Tipo: Desafio.
O jogo então monta a experiência usando esses parâmetros, permitindo centenas de combinações.

**Usuário:**
Gostei da ideia e quero começar a desenvolver assim mesmo!
Mas também acho que seria interessante colocar uma opção de jogo onde teria 1 única tela (para casos onde o casal ou grupo não tenha mais de 1 tela disponível)

**Assistente (GPT):**
Sim — e acho que essa opção de tela única deve fazer parte do projeto desde o começo, não como um modo improvisado depois. Na prática, podemos estruturar o jogo com dois modos de interação:

📺 Modo TV + celulares: A tela principal mostra a partida. Cada jogador usa o próprio celular para decisões privadas.
📱 Modo tela única: Aqui tudo acontece no mesmo dispositivo. A interface muda para evitar mostrar informações privadas. Criamos uma espécie de "passar o aparelho". O jogador toca para revelar e, quando termina, toca em "Ocultar e Continuar".

💡 Modo Híbrido: TV/PC mostra a partida e quem quiser pode entrar pelo celular.
Isso torna o jogo acessível para: Modo 1 (1 tela), Modo 2 (TV + 1 celular), Modo 3 (TV + vários celulares), Modo 4 (PC sozinho).

🧩 Eu estruturaria o projeto assim:
Desde o começo, o jogo teria uma camada central (Game Engine) que controla turnos, dados, regras, etc. A interface (tela única, TV, celulares) é apenas uma maneira diferente de acessar esse mesmo jogo.

**Usuário:**
Pode continuar desenvolvendo!

**Assistente (GPT):**
Perfeito. Então vamos tratar isso como o início de um Game Design Document (GDD).

1. 👥 Quantidade de jogadores: 2–8 jogadores (preparado para mais). Casal e Grupo têm mecânicas diferentes.
2. 🏠 Sistema de salas: Criar sala -> Código/QR Code -> Jogadores entram.
3. 🎮 O ciclo principal da partida: Escolher jogador -> Rolar dados -> Categoria -> Carta -> Escolha/Ação -> Recompensa -> Aumenta intensidade? -> Próximo turno.
4. 🎲 Os dados: Dado 1 (Quem?), Dado 2 (Tipo: Pergunta, Desafio, etc), Dado 3 (Intensidade 1 a 6). A revelação dos dados pode ter animações de expectativa.
5. 🃏 Sistema de cartas: Metadados que o sistema procura para achar a carta adequada ao contexto.
6. 🔥 Sistema de intensidade: Nível 1 (Leve), Nível 2 (Clima), Nível 3 (Intenso), Nível 4 (Adulto), Nível 5 (Personalizado).
7. 🛑 Sistema de limites: Antes de jogar, configura-se categorias aceitas/bloqueadas. Botão "PULAR" sempre disponível na partida.
8. 🔒 Cartas privadas: Ações e decisões secretas, lidas apenas pelo jogador da vez.
9. 🏆 Pontuação: Conexão (interação), Coragem (desafios), Experiência (geral).
10. 🧠 Objetivos secretos: Ex: "Faça outro jogador escolher opção X" para gerar estratégia.
14. 🌐 Arquitetura: Frontend (UI, Animações, Websocket) separado do Backend (Game Engine, Room Manager, Base de dados).

**Usuário:**
Defina essas coisas e inicie a programação
Me mostre um protótipo

**Assistente (GPT):**
Fechado. Já transformei a ideia em uma primeira especificação de gameplay e iniciei a programação com um protótipo funcional v0.1 (turnos, rolagem de dados, intensidade, pontuação). O próximo passo seria transformar na v0.2.

**Usuário:**
gostei do resultado ate agora, quando o projeto estiver ainda mais desenvolvido vamos adicionar a estetica 3D e mais gameficada
prossiga.

**Assistente (GPT):**
Perfeito. Vamos manter a estética 3D/gameficada para uma etapa posterior (v1.0). Avancei o protótipo para a v0.2.
O que entrou: Tela inicial, Criar/Entrar, Lobby, Fluxo de partida, Modo TV/Celular/Tela Única, Categorias, Cartas privadas.
Próxima evolução (v0.3): Transformar em um jogo real com sistema de cartas estruturado, regras dos dados, limites individuais e filtros avançados de conteúdo.

**Usuário:**
tambem pensei na ideia de ter modos de jogo:
Modo mais tranquilo para jogar em grupo de amigos sem nada muito agressivo (perguntas picantes, intimas, desafios simples não sexuais).
um modo 2, maximo de agressividade seria remover roupas, contato fisico (beijo no rosto, braço, pés) sem sexo.
um modo 3 onde ja teria contatos fisicos sexuais e desafios sexuais (usuario escolhe limites: BDSM, anal, pés, etc).
um modo bate-pronto onde teria todas as categorias sem burocracia, só joga e faz (para dar clima rápido).
e um modo livre onde teria de tudo e cada usuario seleciona limites (aberto, direto).

**Assistente (GPT):**
Essa divisão de modos faz bastante sentido. O modo determina o "teto" do conteúdo, e os limites individuais determinam o que aparece para cada um.
* Modo 1 — Leve / Amigos (nada de nudez/sexo).
* Modo 2 — Ousado (remoção de roupa, contato físico, sem sexo explícito).
* Modo 3 — Adulto (conteúdo sexual, habilitado via limites).
* Modo 4 — Bate-Pronto (zero preparação, fluxo direto: Rola -> Revela -> Faz).
* Modo 5 — Livre (configuração 100% personalizada por jogador).

🔒 O sistema de limites: Não usaria apenas "Aceito/Não aceito". Criaria três estados: ✅ PERMITIDO, ⚠️ PERGUNTAR ANTES, ❌ BLOQUEADO.
Cada carta não pertence a apenas um modo, ela tem TAGS (ex: [intimidade], [sexual], exposição: baixa). O sistema filtra: Modo Escolhido -> Limites Individuais -> Intensidade -> Nº Jogadores = Carta. Se uma carta exige uma categoria que UM dos envolvidos bloqueou, ela não é sorteada para aquele grupo.

**Usuário:**
Sobre as categorias para eu validar, prefiro que sejam mais diretas e especificas, não quero deixar muito generalisadas, para q assim o usuario conseguir ter uma certeza maior doq marcar.

**Assistente (GPT):**
Concordo. Deixar explícito. Em vez de "Contato físico", teríamos menus expansíveis:
* Perguntas: relacionamentos, experiências, preferências, fantasias, ciúmes, etc.
* Beijos: rosto, testa, mãos, pés, boca, prolongado, etc.
* Contato físico: abraçar, carinho, massagem, sentar no colo, tocar partes específicas, etc.
* Roupa: tirar acessórios, camisa, calça, nudez parcial/total, etc.
* Sexual: desafios, estimulação, genitais, oral, penetração (vaginal/anal).
* Partes do Corpo: pés, pernas, coxas, glúteos, seios, barriga, boca, genitais. (Permitir ação ≠ permitir qualquer parte).
* BDSM: dominação, amarrar, venda, etc.
* Exposição: mostrar partes íntimas, gravar, expor a terceiros, etc.
* Dinâmica: com parceiro, com qualquer um, etc.

Cada item terá ✅ Permitir, ⚠️ Perguntar, 🚫 Bloquear.

**Usuário:**
gostei dessa nova lista
sobre os beijos: Acredito que faltou beijos em partes intimas explicitas e como seria determinado o "parceiro"?
sobre beijos em partes intimas etc, eu acredito que deveria nas categorias anteriores ja mostrar opções com essas partes intimas e intimidades no geral e nas categorias mais "Adultas" caso o usuario tenha permitido nas anteriores elas ja ficariam marcadas como permitido nas Adultas, assim alem de deixar ainda mais especifico tambem já teria uma dupla confirmação.
Na Dinamica entre pessoas acredito que seja interessante o seguinte: caso 1 do casal selecione algo como "Somente com meu parceiro" para o outro iria aparecer uma caixinha mostrando q o parceiro selecionou isso. mas tirando essa logica do parceiro, não acho que seja justo em um jogo assim o usuario poder selecionar pessoas, então remova a opção "Somente com uma pessoa escolhida por mim"
concordo com todo o restante que foi dito, então pode seguir.

---

## 🎯 INSTRUÇÕES PARA O CLAUDE CODE (PROMPT DE CONTINUAÇÃO)

Você agora é o Engenheiro de Software Fullstack e Game Designer encarregado de construir a **v0.3** do projeto "Noite de Desafios".

**Contexto e Ponto de Partida:**
Acabei de fazer o upload dos arquivos da versão v0.2. O escopo do jogo, os Modos de Jogo (1, 2, 3, Bate-Pronto e Livre) e a mecânica das Tags já estão aprovados conforme o histórico acima.

**Suas Tarefas Iniciais:**
1. **Ler os Arquivos:** Analise os arquivos da v0.2 que forneci para entender o estado atual da arquitetura e da UI.
2. **Estruturação de Dados (Banco de Cartas & Limites):** Desenvolva a estrutura JSON/objeto que abrigará o sistema de limites hiper-específicos acordados acima (Perguntas, Beijos, Contato Físico, Roupa, Sexual, Partes do Corpo, BDSM, Exposição e Dinâmica).
3. **Regra de Dupla Confirmação:** Implemente a lógica solicitada: se o usuário permitir toques/beijos íntimos nas abas iniciais/gerais, o sistema já pré-seleciona "Permitido" na aba "Adulto", servindo como confirmação e especificando exatamente a ação. O banco de dados precisa suportar beijos em partes íntimas explícitas.
4. **Regra do Parceiro (Notificação Mútua):** Codifique a mecânica onde, se o jogador A seleciona "Somente com meu parceiro", o sistema gera um alerta/caixa na tela do parceiro informando essa escolha. Remova qualquer lógica que permita escolher um alvo arbitrário.
5. **ContentFilter & Tags:** Crie a lógica do motor (`GameMode -> PlayerLimits -> ContentFilter`) que seleciona a carta ideal, garantindo que o teto do modo escolhido nunca seja furado e que as preferências (Permitir/Perguntar/Bloquear) de *todos* os envolvidos na ação sejam respeitadas.

**Como Responder:**
Antes de cuspir arquivos soltos, me apresente um resumo técnico de como você planeja estruturar o novo JSON de limites e a lógica do filtro do motor (`ContentFilter`). Aguardarei sua visão da arquitetura da v0.3 para pros
