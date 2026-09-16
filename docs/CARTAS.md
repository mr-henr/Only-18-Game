# Catálogo de cartas

> Gerado automaticamente a partir de `src/data/decks/` por `npm run docs`.
> Não edite este arquivo à mão — edite os baralhos e rode o script de novo.

## Resumo

| Modo | Cartas disponíveis | Teto de intensidade |
|---|---|---|
| 🌙 **Leve** | 102 | 3 |
| 🔥 **Ousado** | 186 | 4 |
| 🔥🔥 **Adulto** | 243 | 5 |
| ⚡ **Bate-Pronto** | 243 | 5 |
| 🛠️ **Livre** | 243 | 5 |

| Baralho | Total | 🌙 Leve+ | 🔥 Ousado+ | 🔥🔥 Adulto+ |
|---|---|---|---|---|
| 💬 Perguntas `questions` | **43** | 40 | 1 | 2 |
| 🎯 Desafios sociais `dares` | **37** | 34 | 3 | 0 |
| 💋 Beijos e contato físico `contact` | **48** | 12 | 36 | 0 |
| 👕 Roupa `clothing` | **25** | 0 | 25 | 0 |
| 🔞 Conteúdo sexual `adult` | **32** | 0 | 0 | 32 |
| ⛓️ Poder e exposição `power` | **29** | 0 | 11 | 18 |
| 🍻 Bebida `drinks` | **29** | 16 | 8 | 5 |
| | **243** | 102 | 84 | 57 |

### Casal (2) × grupo (3+)

**As colunas não são quatro grupos separados.** `Serve aos dois` são as cartas que
funcionam em qualquer formato; `Só casal` (`maxPlayers: 2`) e `Só grupo`
(`minPlayers: 3`) são as exclusivas. As duas últimas colunas são o total que cada
formato enxerga — ou seja, `serve aos dois` + a exclusiva dele.

As exclusivas são poucas de propósito: quando uma carta de grupo também faz sentido a
dois, ela ganha uma **redação alternativa** para duas pessoas (19 cartas hoje) em vez
de virar exclusiva. Só vira exclusiva o que não tem como existir no outro formato —
votação, apontar para alguém, corrente em roda e sorteio de dupla não existem a dois;
história em comum e cena longa a dois não funcionam com plateia.

| Baralho | 🤝 Serve aos dois | 👤👤 Só casal | 👥 Só grupo | = casal vê | = grupo vê |
|---|---|---|---|---|---|
| 💬 Perguntas | 28 | 4 | 11 | 32 | 39 |
| 🎯 Desafios sociais | 18 | 4 | 15 | 22 | 33 |
| 💋 Beijos e contato físico | 34 | 3 | 11 | 37 | 45 |
| 👕 Roupa | 16 | 2 | 7 | 18 | 23 |
| 🔞 Conteúdo sexual | 24 | 4 | 4 | 28 | 28 |
| ⛓️ Poder e exposição | 19 | 3 | 7 | 22 | 26 |
| 🍻 Bebida | 22 | 0 | 7 | 22 | 29 |
| **Total** | **161** | **20** | **62** | **181** | **223** |

🍻 **29 cartas de bebida.** Só entram se o grupo ligar "jogar com bebida" na
criação da partida — e, mesmo assim, cada jogador filtra o que aceita na aba 🍻 dos limites.

## Como ler

- **Int.** — faixa de intensidade em que a carta pode sair (`mín–máx`). A partida só sorteia a carta quando o nível atual está dentro dela.
- **Alvo** — quem participa: `só quem joga`, `sobre outro` (quem joga age sobre alguém), `entre os dois` (ação mútua) ou `grupo todo`.
- **Requisitos** — os limites do catálogo que a carta exige. Basta **um** dos envolvidos bloquear qualquer um deles para a carta não existir para aquele grupo.
- `{actor}` e `{target}` são substituídos pelos nomes. `{slot}` é uma **lacuna**: o motor testa valor a valor contra os limites e escolhe um que passe — a carta só morre se nenhum valor sobreviver.
- 🔒 carta privada: só quem joga lê a tela. 👀 carta com plateia: quem assiste precisa ter permitido `dyn_watch`, e quem está no centro, `dyn_be_watched`.
- `sorteio entre 2` monta uma dupla entre quaisquer dois jogadores — a dupla **não precisa incluir quem está na vez**, e o resto do grupo entra como plateia.

## 🌙 A partir do Modo Leve

Aparecem em **todos** os modos.

### 💬 Perguntas — `questions` (40)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `q_topic_self` | {actor}, conte para o grupo sobre {topic.label}. Sem economizar detalhes. | Pergunta | 1–5 | só quem joga | `{topic}` → 15 valores de `questionTopics`, cada valor exige o limite dele |
| `q_topic_asked` | {target} quer saber de {actor}: {topic.label}. Sem enrolar. | Pergunta | 1–5 | sobre outro | `{topic}` → 15 valores de `questionTopics`, cada valor exige o limite dele |
| `q_topic_guess` | Antes de {actor} responder, o grupo chuta: {topic.label}. Quem chegar mais perto escolhe a próxima carta. | Escolha | 1–4 | grupo todo 👥3+ | `{topic}` → 15 valores de `questionTopics`, cada valor exige o limite dele |
| `q_topic_private` | 🔒 {actor}, pense na sua resposta sobre {topic.label}. Você decide se conta ou guarda para você. | Pergunta | 2–5 | só quem joga | `{topic}` → 15 valores de `questionTopics`, cada valor exige o limite dele |
| `q_first_impression` | {actor}, qual foi sua primeira impressão sobre {target} — e o quanto ela mudou? | Pergunta | 1–2 | sobre outro | `q_about_present` |
| `q_attractive_trait` | {actor}, qual parte do corpo de {target} chama mais sua atenção? | Pergunta | 1–3 | sobre outro | `q_about_present` + `q_body_opinion` |
| `q_rate_boldness` | {actor}, dê uma nota de 0 a 10 para a ousadia de {target} — e justifique a nota. | Pergunta | 1–3 | sobre outro | `q_about_present` |
| `q_room_attraction` | {actor}, se você tivesse que ficar com alguém desta sala que não seja seu parceiro, quem seria e por quê? | Pergunta | 2–4 | só quem joga 👥3+ | `q_attraction` + `q_about_present` |
| `q_would_you_accept` | {actor}: se {target} te chamasse agora, você aceitaria? Responda só sim ou não, sem explicar. | Pergunta | 2–5 | sobre outro | `q_attraction` + `q_about_present` |
| `q_first_time` | {actor}, conte como foi sua primeira vez. Sem pular a parte constrangedora. | Pergunta | 2–4 | só quem joga | `q_sexual_experiences` |
| `q_weirdest_place` | {actor}, qual foi o lugar mais inusitado em que você já transou? | Pergunta | 2–4 | só quem joga | `q_sexual_experiences` |
| `q_body_count` | {actor}, com quantas pessoas você já transou? Número exato. | Pergunta | 3–5 | só quem joga | `q_sexual_experiences` + `q_embarrassing` |
| `q_fantasy_never_told` | {actor}, qual é a fantasia que você nunca teve coragem de contar para ninguém? | Pergunta | 3–5 | só quem joga | `q_fantasies` |
| `q_preference_position` | {actor}, qual sua posição favorita e por quê exatamente essa? | Pergunta | 2–4 | só quem joga | `q_sexual_preferences` |
| `q_preference_dominance` | {actor}, você prefere mandar ou obedecer na cama? Seja honesto. | Pergunta | 2–4 | só quem joga | `q_sexual_preferences` |
| `q_turn_on` | {actor}, o que alguém pode fazer que te deixa excitado na hora? | Pergunta | 2–4 | só quem joga | `q_sexual_preferences` |
| `q_scale_tonight` | {actor}, de 1 a 10: o quanto você quer que esta noite acabe em alguma coisa? | Pergunta | 2–5 | só quem joga | `q_intimate_personal` |
| `q_jealousy_moment` | {actor}, qual foi a vez que você sentiu mais ciúme — e o que você fez? | Pergunta | 1–3 | só quem joga | `q_jealousy` |
| `q_ex_comparison` | {actor}, o que um ex fazia que você sente falta? | Pergunta | 3–5 | só quem joga | `q_past_relationships` + `q_embarrassing` |
| `q_worst_sex` | {actor}, conte a vez mais constrangedora que você já passou transando. | Pergunta | 2–4 | só quem joga | `q_sexual_experiences` + `q_embarrassing` |
| `q_secret_confession` | {actor}, confesse algo que ninguém nesta sala sabe sobre você. | Pergunta | 2–5 | só quem joga | `q_confession` |
| `q_private_wish` | 🔒 {actor}, escreva mentalmente o que você mais quer que aconteça nesta noite. Você decide se conta ou não. | Pergunta | 2–5 | só quem joga | `q_fantasies` |
| `q_intimate_personal` | {actor}, com que frequência você se masturba? Responda sem arredondar. | Pergunta | 2–4 | só quem joga | `q_intimate_personal` |
| `q_two_truths` | {actor} conta três coisas picantes sobre si — duas verdadeiras e uma mentira. Os outros votam na mentira. | Escolha | 1–3 | grupo todo | `q_intimate_personal` |
| `q_group_vote_bold` | Todos apontam ao mesmo tempo: quem aqui é o mais safado? {actor} conta os votos. | Escolha | 1–3 | grupo todo 👥3+ | `q_about_present` |
| `q_group_vote_kisser` | Todos apontam ao mesmo tempo: quem aqui beija melhor, no chute? {actor} conta os votos. | Escolha | 1–4 | grupo todo 👥3+ | `q_about_present` |
| `q_group_vote_first` | Todos apontam: quem aqui vai ser o primeiro a topar um desafio pesado hoje? {actor} conta os votos. | Escolha | 2–4 | grupo todo 👥3+ | `q_about_present` |
| `q_group_one_word` | Ao mesmo tempo, cada um diz UMA palavra: o que você faria agora se ninguém fosse julgar? | Pergunta | 2–5 | grupo todo | `q_confession` |
| `q_target_asks` | {target} faz UMA pergunta livre para {actor}. Não vale mentir. | Pergunta | 2–5 | sobre outro | `q_intimate_personal` + `q_embarrassing` |
| `q_never_have_i` | {actor} diz um "eu nunca" de teor sexual. Quem já fez, levanta a mão. | Escolha | 1–4 | grupo todo | `q_sexual_experiences` |
| `q_point_wildest` | Todos apontam ao mesmo tempo: quem aqui já fez a maior loucura na cama? O mais votado conta. | Escolha | 2–5 | grupo todo 👥3+ | `q_sexual_experiences` + `q_about_present` |
| `q_point_body` | Todos apontam: quem aqui tem o corpo mais bonito? {actor} conta os votos e ninguém pode votar em si mesmo. | Escolha | 1–4 | grupo todo 👥3+ | `q_body_opinion` + `q_about_present` |
| `q_unlikely_couple` | {actor} escolhe dois jogadores. O grupo vota: esse casal daria certo ou seria um desastre? | Escolha | 1–4 | grupo todo 👥3+ | `q_about_present` |
| `q_swap_partners` | Se todo mundo trocasse de par agora, com quem cada um ficaria? {actor} começa e ninguém pode repetir a escolha anterior. | Pergunta | 3–5 | grupo todo 👥3+ | `q_attraction` + `q_about_present` |
| `q_secret_number` | 🔒 Cada um escreve em segredo, de 0 a 10, o quanto quer que esta noite avance. {actor} lê só a média em voz alta. | Escolha | 1–4 | grupo todo 👥3+ | `q_intimate_personal` |
| `q_chain_question` | Corrente: {actor} faz uma pergunta íntima para quem está à direita, que responde e pergunta para o próximo — até fechar a roda. | Pergunta | 2–5 | grupo todo 👥3+ | `q_intimate_personal` |
| `q_couple_first` | Qual foi o momento exato em que vocês dois souberam que queriam mais do que amizade? | Pergunta | 1–3 | entre os dois 👤👤 | `q_confession` |
| `q_couple_best_night` | Cada um descreve, em detalhe, a melhor noite que já tiveram juntos. Vocês vão discordar sobre qual foi. | Pergunta | 2–5 | entre os dois 👤👤 | `q_sexual_experiences` |
| `q_couple_never_asked` | Faça a pergunta que você nunca teve coragem de fazer para a pessoa na sua frente. | Pergunta | 2–5 | entre os dois 👤👤 | `q_intimate_personal` |
| `q_couple_wish_list` | Cada um diz três coisas que quer experimentar com o outro. Se alguma se repetir nas duas listas, façam hoje. | Pergunta | 3–5 | entre os dois 👤👤 | `q_fantasies` |

### 🎯 Desafios sociais — `dares` (34)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `d_sexy_walk` | {actor}, atravesse o ambiente do jeito mais sensual que conseguir. O grupo dá nota de 0 a 10. | Desafio | 1–3 | só quem joga | `q_embarrassing` |
| `d_pose_place` | {actor} faz a pose mais sensual que conseguir {place.label}, {modifier.label}. O grupo dá nota. | Desafio | 1–4 | só quem joga | `q_embarrassing`<br>`{place}` → 6 valores de `places`<br>`{modifier}` → 6 valores de `modifier` |
| `d_moan` | {actor}, gema de forma convincente por {duration.label}. Olhando para o grupo. | Desafio | 2–4 | só quem joga | `q_embarrassing`<br>`{duration}` → 6 valores de `durations` |
| `d_fake_call` | {actor} finge uma ligação e descreve, muito sério, o que está acontecendo nesta sala. | Desafio | 2–4 | só quem joga | `q_embarrassing` |
| `d_read_messages` | {actor}, abra suas conversas e leia em voz alta a última mensagem picante que você enviou. | Desafio | 3–5 | só quem joga | `q_confession` + `q_past_relationships` |
| `d_truth_or_double` | {actor} escolhe: responder uma pergunta íntima do grupo, ou cumprir o próximo desafio com intensidade dobrada. | Escolha | 2–4 | só quem joga | `q_intimate_personal` |
| `d_private_dare` | 🔒 {actor}, escolha em segredo o jogador que mais te deixou curioso nesta noite. Você não precisa revelar. | Desafio | 2–5 | só quem joga | `q_confession` |
| `d_impersonate` | {actor}, imite {target} até alguém do grupo acertar quem é. | Desafio | 1–2 | sobre outro 👥3+ | `q_about_present` |
| `d_compliment_modifier` | {actor} faz {count.label} elogios para {target}, {modifier.label}. Não vale repetir palavra. | Conexão | 1–3 | sobre outro | `q_body_opinion`<br>`{modifier}` → 6 valores de `modifier`<br>`{count}` → 3 valores de `counts` |
| `d_pickup_line` | {actor} tenta uma cantada em {target}. Se {target} rir, {actor} tenta de novo com outra. | Desafio | 1–3 | sobre outro | `q_about_present` |
| `d_truth_serum` | {actor} faz uma pergunta para {target}. Se {target} não responder, cumpre o próximo desafio dobrado. | Desafio | 2–5 | sobre outro | `q_intimate_personal` |
| `d_body_language` | {actor} tem que dizer com o corpo, sem falar nenhuma palavra, o que gostaria que {target} fizesse. | Desafio | 2–5 | sobre outro | `q_fantasies` + `q_about_present` |
| `d_staring` | {actor} e {target} se encaram por {duration.label}, {modifier.label}. Quem desviar primeiro perde. | Conexão | 1–3 | entre os dois | `{duration}` → 6 valores de `durations`<br>`{modifier}` → 6 valores de `modifier` |
| `d_mirror_move` | {actor} faz um movimento e {target} repete igual, cada rodada mais ousado. Quem travar primeiro perde. | Desafio | 1–4 | entre os dois | — |
| `d_compliment_round` | {actor} faz um elogio sincero e específico para cada jogador. Sem repetir palavra. | Conexão | 1–2 | grupo todo | `q_body_opinion` |
| `d_group_vote_challenge` | O grupo vota em um desafio para {actor}. Se não houver acordo em 30 segundos, {actor} escapa. | Escolha | 2–4 | grupo todo 👥3+ | `q_about_present` |
| `d_group_ranking` | {actor} coloca todo mundo em ordem, do mais tímido ao mais safado — e justifica cada posição. | Desafio | 2–4 | grupo todo 👥3+ | `q_about_present` |
| `d_group_freeze` | Ao sinal de {actor}, todos congelam na posição em que estiverem por {duration.label}. Quem se mexer paga uma prenda. | Desafio | 1–3 | grupo todo | `{duration}` → 6 valores de `durations` |
| `d_group_secret_vote` | 🔒 Cada um escolhe em segredo quem foi o mais ousado até agora. {actor} recolhe e anuncia só o resultado. | Escolha | 1–4 | grupo todo 👥3+ | `q_about_present` |
| `d_group_seats` | Todos trocam de lugar. {actor} decide quem senta ao lado de quem pelo resto da rodada. | Desafio | 1–3 | grupo todo 👥3+ | `touch_sit_close` |
| `d_random_pair_common` | Sorteio! {actor} e {target} têm {duration.label} para descobrir algo em comum que mais ninguém aqui sabe. | Conexão | 1–3 | sorteio entre 2 👥3+ | `q_intimate_personal`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `d_random_pair_dare` | Sorteio! {actor} e {target} cumprem juntos o próximo desafio, enquanto o resto do grupo assiste. | Desafio | 2–5 | sorteio entre 2 👥3+ | `q_about_present` |
| `d_hot_seat` | Cadeira quente: por {duration.label}, {actor} responde tudo que o grupo perguntar. Sem passar nenhuma. | Desafio | 2–5 | grupo todo 👥3+ | `q_intimate_personal`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `d_chain_compliment` | Corrente de elogios: {actor} elogia quem está à direita, que elogia o próximo. Quem repetir um elogio já dito, paga prenda. | Conexão | 1–3 | grupo todo 👥3+ | `q_body_opinion` |
| `d_group_pose` | Todos montam uma foto de grupo na pose que {actor} mandar. Segurem até {actor} contar até dez. | Desafio | 1–4 | grupo todo 👥3+ | `touch_sit_close` |
| `d_last_laugh` | {actor} tem {duration.label} para fazer o grupo rir. Quem rir primeiro cumpre o próximo desafio. | Desafio | 1–3 | grupo todo 👥3+ | `{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `d_pass_object` | Todos passam um objeto de mão em mão sem usar os dedos. Quem derrubar paga prenda. | Desafio | 2–4 | grupo todo 👥3+ | `touch_sit_close` + `touch_non_partner` |
| `d_vote_safest` | O grupo vota em quem está jogando mais seguro até agora. Essa pessoa cumpre a próxima carta no lugar de quem sair. | Escolha | 2–5 | grupo todo 👥3+ | `q_about_present` |
| `d_random_pair_defend` | Sorteio! {actor} e {target} têm {duration.label} para defender lados opostos de um debate safado que o grupo escolher. | Desafio | 1–4 | sorteio entre 2 👥3+ | `q_sexual_preferences`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `d_random_pair_mimic` | Sorteio! {actor} e {target} encenam, sem falar, uma cena picante que o grupo tem que adivinhar. | Desafio | 2–5 | sorteio entre 2 👥3+ | `q_embarrassing` |
| `d_couple_memory` | Em {duration.label}, cada um descreve o outro para um estranho imaginário — sem dizer nada sobre aparência. | Conexão | 1–3 | entre os dois 👤👤 | `{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `d_couple_guess_answer` | {actor} tenta adivinhar o que {target} respondeu na última pergunta antes de {target} falar. Se acertar, {target} paga prenda. | Desafio | 1–4 | entre os dois 👤👤 | `q_sexual_preferences` |
| `d_couple_role_play` | Por {duration.label}, vocês dois são outras duas pessoas que acabaram de se conhecer. {actor} escolhe quem são. | Desafio | 2–5 | entre os dois 👤👤 | `q_fantasies`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `d_couple_silent_minute` | Por {duration.label}, nenhum dos dois pode falar. Só olhar, e reagir ao que o outro fizer. | Conexão | 1–3 | entre os dois 👤👤 | `touch_sit_close`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |

### 💋 Beijos e contato físico — `contact` (12)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `c_hug_long` | {actor} abraça {target} por {duration.label} sem dizer nada. | Desafio | 1–3 | sobre outro | `touch_hug`<br>`{duration}` → 6 valores de `durations` |
| `c_eye_contact` | {actor} e {target} se olham nos olhos por {duration.label}, sem falar e sem rir. | Conexão | 1–3 | entre os dois | `touch_sit_close`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_shoulder` | {actor} encosta a cabeça no ombro de {target} e fica assim até o fim do turno. | Conexão | 1–3 | sobre outro | `touch_sit_close` |
| `c_hands_lock` | {actor} e {target} ficam de mãos dadas até a próxima vez de {actor} jogar. | Conexão | 1–3 | entre os dois | `touch_hands` |
| `c_hug_group` | Abraço coletivo de {duration.label}. {actor} decide quando todo mundo solta. | Conexão | 1–3 | grupo todo 👥3+ | `touch_hug` + `touch_non_partner`<br>`{duration}` → 6 valores de `durations` |
| `c_back_write` | {actor} escreve uma palavra picante com o dedo nas costas de {target}, que tem que adivinhar qual é. | Desafio | 1–4 | sobre outro | `touch_back` + `body_back` |
| `c_hand_read` | {actor} segura a mão de {target} e "lê" o futuro amoroso dele. Tem que ser específico e constrangedor. | Desafio | 1–3 | sobre outro | `touch_hands` + `body_hands` |
| `c_close_talk` | {actor} e {target} conversam por {duration.label} a menos de um palmo de distância, sem se afastar. | Conexão | 1–4 | entre os dois | `touch_sit_close`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_arm_wrestle` | {actor} e {target} fazem queda de braço. Quem perder escolhe uma prenda — para si mesmo. | Desafio | 1–3 | entre os dois | `touch_hands` + `touch_arms` |
| `c_copy_pose` | {target} faz uma pose. {actor} tem que copiar exatamente, ajustando {target} com as mãos para comparar. | Desafio | 1–3 | sobre outro | `touch_arms` |
| `c_feet_war` | {actor} e {target} disputam com os pés quem empurra o outro primeiro. Sem usar as mãos. | Desafio | 1–3 | entre os dois | `touch_feet` + `body_feet` |
| `c_blind_face` | {actor} fecha os olhos e tem que reconhecer {target} só tocando o rosto dele. | Desafio | 1–4 | sobre outro | `touch_face` + `body_face` |

### 🍻 Bebida — `drinks` (16)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `dk_rule` | Nova regra até a próxima vez de {actor}: {rule.label}. | Desafio | 1–4 | grupo todo | `drink_rule`<br>`{rule}` → 6 valores de `drinkRule` |
| `dk_toast` | {actor} faz um brinde constrangedor em voz alta. Todos bebem {amount.label}. | Desafio | 1–3 | grupo todo | `{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_last_one` | Todos bebem {amount.label} ao mesmo tempo. O último a terminar cumpre o próximo desafio em dobro. | Desafio | 1–4 | grupo todo | `{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_waterfall` | Cascata: {actor} começa a beber e cada um só pode parar quando o anterior parar. | Desafio | 2–5 | grupo todo 👥3+ | `drink_sip` |
| `dk_categories` | {actor} escolhe uma categoria picante. Cada um diz um item — quem travar bebe {amount.label}. | Desafio | 1–4 | grupo todo 👥3+ | `{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_never_drink` | {actor} diz um "eu nunca" de teor sexual. Quem já fez, bebe {amount.label}. | Escolha | 1–5 | grupo todo 👥3+ | `q_sexual_experiences`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_two_truths_drink` | {actor} conta duas verdades e uma mentira sobre a própria vida sexual. Quem errar bebe {amount.label}. | Escolha | 1–4 | grupo todo 👥3+ | `q_intimate_personal`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_point_drink` | Todos apontam para quem parece mais safado da sala. O mais votado bebe {amount.label}. | Escolha | 1–4 | grupo todo 👥3+ | `q_about_present`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_ranking_drink` | {actor} coloca todos em ordem de quem aguenta mais bebida. Os dois últimos da lista bebem {amount.label}. | Desafio | 2–4 | grupo todo 👥3+ | `q_about_present`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_topic_or_drink` | {actor} escolhe: contar sobre {topic.label} ou beber {amount.label}. | Escolha | 1–5 | só quem joga | `{topic}` → 15 valores de `questionTopics`, cada valor exige o limite dele<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_confession_drink` | {actor} conta um segredo de verdade ou bebe {amount.label}. O grupo decide se o segredo valeu. | Escolha | 2–5 | só quem joga | `q_confession`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_choose_who` | {actor} decide: {target} bebe {amount.label}. | Escolha | 1–4 | sobre outro | **quem faz:** `drink_choose_for_other`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_serve` | {actor} prepara a bebida de {target} do jeito que quiser. {target} bebe sem perguntar o que tem dentro. | Desafio | 1–4 | sobre outro | **quem faz:** `drink_serve`<br>**quem recebe:** `drink_sip` |
| `dk_partner_pays` | Até a próxima rodada, toda vez que {actor} rir, quem bebe {amount.label} é {target}. | Desafio | 2–5 | sobre outro | **quem recebe:** `drink_sip`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_speed` | {actor} e {target} bebem {amount.label} ao mesmo tempo. Quem terminar por último escolhe a própria próxima prenda. | Desafio | 2–5 | entre os dois | `{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_dare_or_drink` | {actor} escolhe: beber {amount.label} ou cumprir o desafio que {target} inventar agora. | Escolha | 2–5 | sobre outro | `{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |

## 🔥 A partir do Modo Ousado

Aparecem em Ousado, Adulto, Bate-Pronto e Livre. **Nunca** no Leve.

### 💬 Perguntas — `questions` (1)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `q_fantasy_with_target` | {actor}, descreva em detalhes o que você faria com {target} se não houvesse nenhuma regra. | Pergunta | 3–5 | sobre outro | `q_fantasies` + `q_about_present` |

### 🎯 Desafios sociais — `dares` (3)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `d_ice_cube` | {actor} passa um cubo de gelo em {target} — {bodyPart.em} — até derreter ou {target} pedir para parar. | Desafio | 3–5 | sobre outro | `{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}` |
| `d_statue` | {target} fica imóvel por {duration.label}. {actor} tenta fazer {target} se mexer — sem ultrapassar nenhum limite marcado. | Desafio | 2–4 | sobre outro | `touch_caress`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `d_tickle` | {actor} tem {duration.label} para fazer {target} rir sem usar as mãos. | Desafio | 2–4 | sobre outro | `touch_caress`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |

### 💋 Beijos e contato físico — `contact` (36)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `c_kiss_part` | {actor}, dê {style} em {target} — {bodyPart.em}. | Desafio | 1–5 | sobre outro | `{bodyPart}` → 14 valores de `bodyParts`, exceto mouth, exige `kiss_{id}`<br>`{style}` → 4 valores de `kissStyle` |
| `c_kiss_modifier` | {actor} beija {target} {bodyPart.em}, {modifier.label}. | Desafio | 2–5 | sobre outro | `{bodyPart}` → 15 valores de `bodyParts`, exige `kiss_{id}`<br>`{modifier}` → 6 valores de `modifier` |
| `c_kiss_mouth` | {actor} e {target} se beijam na boca por {duration.label}. | Desafio | 2–5 | entre os dois | `kiss_mouth`<br>`{duration}` → 6 valores de `durations` |
| `c_kiss_prolonged` | {actor} e {target} se beijam de língua por {duration.label}. Sem rir, sem parar antes. | Desafio | 3–5 | entre os dois | `kiss_prolonged`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_kiss_trail` | {actor}, faça uma trilha de beijos em {target}, começando {from.em} e terminando {to.em}. | Desafio | 3–5 | sobre outro | `{from}` → 12 valores de `bodyParts`, exige `kiss_{id}`<br>`{to}` → 15 valores de `bodyParts`, exige `kiss_{id}` |
| `c_kiss_countdown` | {actor} tem {duration.label} para beijar {target} em {count.label} lugares diferentes que os dois permitiram. | Desafio | 2–5 | sobre outro | `kiss_face`<br>`{count}` → 3 valores de `counts`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_kiss_blind` | {target} fecha os olhos. {actor} beija {target} {bodyPart.em} — {target} tem que adivinhar onde foi. | Desafio | 3–5 | sobre outro | `bdsm_blindfold`<br>`{bodyPart}` → 15 valores de `bodyParts`, exige `kiss_{id}` |
| `c_kiss_choose_place` | {target} escolhe um lugar do próprio corpo. {actor} beija ali — se ambos permitirem aquele ponto. | Escolha | 2–5 | entre os dois | `kiss_face` |
| `c_touch_part` | {actor}, toque {target} {bodyPart.em} {style.label} por {duration.label}. | Desafio | 1–5 | sobre outro | `{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}`<br>`{style}` → 4 valores de `touchStyle`<br>`{duration}` → 6 valores de `durations` |
| `c_touch_modifier` | {actor} toca {target} {bodyPart.em} por {duration.label}, {modifier.label}. | Desafio | 2–5 | sobre outro | `{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}`<br>`{modifier}` → 6 valores de `modifier`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_hand_stays` | {actor} põe a mão em {target} — {bodyPart.em} — e não tira até o fim da rodada. | Desafio | 2–5 | sobre outro | `{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}` |
| `c_massage` | {actor} faz massagem em {target} — {bodyPart.em} — por {duration.label}. | Desafio | 2–4 | sobre outro | **quem faz:** `touch_massage_give`<br>**quem recebe:** `touch_massage_receive`<br>`{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_massage_place` | {target} se acomoda {place.label}. {actor} faz massagem por {duration.label}, sem pressa. | Desafio | 2–5 | sobre outro | **quem faz:** `touch_massage_give`<br>**quem recebe:** `touch_massage_receive`<br>`{place}` → 6 valores de `places`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `c_lap` | {actor} senta no colo de {target} e fica lá por {duration.label}. | Desafio | 2–4 | sobre outro | `touch_lap`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_lap_dance` | {actor} senta no colo de {target} e se mexe por {duration.label}, {modifier.label}. | Desafio | 3–5 | sobre outro | `touch_lap` + `touch_dance`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3<br>`{modifier}` → 6 valores de `modifier` |
| `c_dance` | {actor} e {target} dançam colados por {duration.label}. Quem soltar primeiro perde. | Desafio | 2–4 | entre os dois | `touch_dance`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_dance_group` | Todos dançam em duplas por {duration.label}. {actor} escolhe a música e quem dança com quem. | Desafio | 2–4 | grupo todo 👥3+ | `touch_dance`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_caress_close` | {actor} e {target} deitam juntos. {actor} faz carinho em {target} por {duration.label}. | Desafio | 2–4 | sobre outro | `touch_caress` + `touch_lie_down`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_lie_together` | {actor} e {target} ficam deitados colados por {duration.label}, {modifier.label}. | Conexão | 2–5 | entre os dois | `touch_lie_down`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3<br>`{modifier}` → 6 valores de `modifier` |
| `c_hair` | {actor} passa os dedos no cabelo de {target} por {duration.label}. | Conexão | 1–4 | sobre outro | `touch_caress`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_breath_neck` | {actor} respira bem perto do pescoço de {target} por {duration.label} — sem encostar nenhuma vez. | Desafio | 3–5 | sobre outro | `touch_sit_close` + `body_neck`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_guess_touch` | {target} fecha os olhos. {actor} toca {target} {bodyPart.em} {count.label} vezes — {target} conta em voz alta. | Desafio | 2–5 | sobre outro | `bdsm_blindfold`<br>`{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}`<br>`{count}` → 3 valores de `counts` |
| `c_no_hands_challenge` | {actor} tem {duration.label} para deixar {target} arrepiado sem usar as mãos. | Desafio | 3–5 | entre os dois | `touch_caress` + `kiss_neck`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `c_whisper` | 🔒 {actor} sussurra no ouvido de {target} algo que gostaria de fazer com ele. Só {target} pode ouvir. | Desafio | 2–5 | sobre outro | `touch_sit_close` + `q_fantasies` |
| `c_random_pair_kiss` | Sorteio! {actor} e {target} se beijam por {duration.label}. | Desafio | 3–5 | sorteio entre 2 👥3+ | `kiss_mouth`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_random_pair_touch` | Sorteio! {actor} toca {target} {bodyPart.em} por {duration.label}. | Desafio | 2–5 | sorteio entre 2 👥3+ | `{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_watched_kiss` | 👀 {actor} e {target} se beijam por {duration.label} enquanto o resto do grupo assiste em silêncio. | Desafio | 3–5 | entre os dois 👥3+ | `kiss_prolonged`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_chain_kiss` | Corrente: cada um beija quem está à direita {bodyPart.em}. {actor} começa. | Desafio | 2–5 | grupo todo 👥3+ | `kiss_non_partner`<br>`{bodyPart}` → 15 valores de `bodyParts`, exige `kiss_{id}` |
| `c_pass_touch` | {actor} toca quem está à direita {bodyPart.em}; essa pessoa repete no próximo, até fechar a roda. | Desafio | 2–5 | grupo todo 👥3+ | `touch_non_partner`<br>`{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}` |
| `c_rotate_massage` | Todos formam uma fila e massageiam as costas de quem está à frente por {duration.label}. Depois a fila inverte. | Desafio | 2–4 | grupo todo 👥3+ | `touch_massage_give` + `touch_massage_receive` + `touch_non_partner`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_musical_lap` | Dança das cadeiras com uma cadeira a menos. Quem sobrar senta no colo de quem conseguiu sentar. | Desafio | 2–5 | grupo todo 👥3+ | `touch_lap` + `touch_non_partner` |
| `c_swap_dance` | Todos dançam em duplas e trocam de par a cada {duration.label}, no comando de {actor}. | Desafio | 2–4 | grupo todo 👥3+ | `touch_dance` + `touch_non_partner`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_random_pair_massage` | Sorteio! {actor} faz massagem em {target} por {duration.label} enquanto o grupo continua conversando. | Desafio | 2–5 | sorteio entre 2 👥3+ | **quem faz:** `touch_massage_give`<br>**quem recebe:** `touch_massage_receive`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_couple_forehead` | Testa na testa por {duration.label}, respirando no mesmo ritmo. Sem falar nada. | Conexão | 1–3 | entre os dois 👤👤 | `kiss_forehead` + `touch_sit_close`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `c_couple_map` | {target} guia a mão de {actor} e mostra exatamente como gosta de ser tocado {bodyPart.em}. | Desafio | 2–5 | entre os dois 👤👤 | `touch_caress`<br>`{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}` |
| `c_couple_countdown` | Por {duration.label}, nenhum dos dois pode usar a boca para falar — só para o resto. | Desafio | 3–5 | entre os dois 👤👤 | `kiss_mouth` + `touch_caress`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |

### 👕 Roupa — `clothing` (25)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `cl_remove_piece` | {actor}, tire {piece.label}. | Desafio | 1–5 | só quem joga | `{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_remove_modifier` | {actor} tira {piece.label}, {modifier.label}. | Desafio | 2–5 | só quem joga | `{piece}` → 7 valores de `clothing`, cada valor exige o limite dele<br>`{modifier}` → 6 valores de `modifier` |
| `cl_other_chooses` | {target} escolhe a peça — e sugere {piece.label}. {actor} tira. | Escolha | 2–5 | sobre outro | **quem faz:** `clothing_choose`<br>`{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_group_chooses` | O grupo vota e decide: {actor} tira {piece.label} agora. | Escolha | 3–5 | grupo todo 👥3+ | **quem faz:** `clothing_choose`<br>`{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_target_removes` | {actor} tira {piece.label} de {target}. Sem pressa. | Desafio | 3–5 | sobre outro | `touch_caress`<br>`{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_no_hands` | {actor} tira {piece.label} de {target} sem usar as mãos. | Desafio | 3–5 | sobre outro | `touch_caress`<br>`{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_swap` | {actor} e {target} trocam uma peça de roupa e ficam assim até o fim da rodada. | Desafio | 2–4 | entre os dois | `clothing_swap` |
| `cl_bet` | {actor} e {target} apostam no par ou ímpar. Quem perder tira uma peça. | Escolha | 2–5 | entre os dois | `clothing_shirt` |
| `cl_random_pair_bet` | Sorteio! {actor} e {target} disputam no jokenpô. Quem perder tira {piece.label}. | Escolha | 3–5 | sorteio entre 2 👥3+ | `{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_ransom` | {actor} pode manter {piece.label} se responder uma pergunta íntima do grupo. Se recusar, a peça sai. | Escolha | 2–5 | grupo todo | `q_intimate_personal`<br>`{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_blind_guess` | {target} fecha os olhos e tenta adivinhar qual peça {actor} está tirando. Se errar, {target} tira uma também. | Desafio | 3–5 | sobre outro | `bdsm_blindfold` + `touch_caress`<br>**quem faz:** `clothing_shirt`<br>**quem recebe:** `clothing_shirt` |
| `cl_to_underwear` | {actor} fica só de roupa íntima até o fim da rodada. | Desafio | 3–5 | só quem joga | `clothing_to_underwear` |
| `cl_stay_without` | {actor} fica sem {piece.label} até o fim da partida. | Desafio | 3–5 | só quem joga | `{piece}` → 7 valores de `clothing`, a partir do nível 2, cada valor exige o limite dele |
| `cl_partial_nude` | {actor} escolhe: parte de cima ou parte de baixo. A escolhida sai inteira. | Desafio | 4–5 | só quem joga | `clothing_partial_nude` |
| `cl_full_nude` | {actor} tira toda a roupa e fica assim pelas próximas duas rodadas. | Desafio | 4–5 | só quem joga | `clothing_full_nude` |
| `cl_strip_dance` | {actor} tem {duration.label} de música para tirar uma peça por vez enquanto todos assistem. | Desafio | 4–5 | grupo todo | `clothing_to_underwear` + `exposure_watched`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `cl_under_the_piece` | {actor} mostra para o grupo o que está por baixo de {piece.label} — sem tirar a peça. | Desafio | 3–5 | grupo todo | **quem faz:** `exposure_body_players`<br>`{piece}` → 7 valores de `clothing`, a partir do nível 2, cada valor exige o limite dele |
| `cl_trade_back` | {target} decide: {actor} recupera uma peça já tirada, ou tira mais uma. | Escolha | 3–5 | sobre outro | `clothing_swap` |
| `cl_group_roulette` | Ao sinal de {actor}, todos tiram a mesma peça ao mesmo tempo: {piece.label}. | Desafio | 2–5 | grupo todo 👥3+ | `{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_most_dressed` | Quem estiver com mais roupa neste momento tira {piece.label}. | Desafio | 2–5 | grupo todo 👥3+ | `{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_vote_who` | O grupo vota em quem tira a próxima peça. {actor} não pode votar. | Escolha | 2–5 | grupo todo 👥3+ | `clothing_choose` |
| `cl_odd_one` | {actor} diz uma característica ("já transei em praia"). Quem NÃO se encaixa tira {piece.label}. | Desafio | 2–5 | grupo todo 👥3+ | `{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_random_pair_strip` | Sorteio! {actor} tira {piece.label} de {target} na frente de todos. | Desafio | 3–5 | sorteio entre 2 👥3+ | `touch_caress`<br>`{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_couple_mirror` | Os dois tiram {piece.label} ao mesmo tempo, um de frente para o outro, sem desviar o olhar. | Desafio | 2–5 | entre os dois 👤👤 | `{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `cl_couple_slow` | {actor} leva {duration.label} inteiros para tirar {piece.label} de {target}. Se acelerar, recomeça. | Desafio | 3–5 | sobre outro 👤👤 | `touch_caress`<br>`{piece}` → 7 valores de `clothing`, cada valor exige o limite dele<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |

### ⛓️ Poder e exposição — `power` (11)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `p_orders` | {actor} dá {count.label} ordens para {target} nesta rodada. Nada fora dos limites marcados. | Desafio | 2–5 | sobre outro | `bdsm_orders`<br>`{count}` → 3 valores de `counts` |
| `p_orders_modifier` | Por {duration.label}, {target} obedece a tudo que {actor} mandar, {modifier.label}. | Desafio | 3–5 | sobre outro | `bdsm_orders`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3<br>`{modifier}` → 6 valores de `modifier` |
| `p_blindfold_round` | {target} fica de olhos vendados até o fim da rodada. {actor} conduz. | Desafio | 3–5 | sobre outro | `bdsm_blindfold` |
| `p_blindfold_who` | {target} fica vendado. {actor} escolhe outro jogador para tocar {target} {bodyPart.em} — {target} adivinha quem foi. | Desafio | 3–5 | sobre outro 👥3+ | `bdsm_blindfold`<br>`{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}` |
| `p_show_body` | {actor} mostra para o grupo a parte do corpo de que mais se orgulha. | Desafio | 3–5 | grupo todo | **quem faz:** `exposure_body_players` |
| `p_watched_act` | Todos param e observam {actor} por {duration.label}. {actor} decide o que fazer nesse tempo. | Desafio | 3–5 | grupo todo | **quem faz:** `exposure_watched`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `p_watch_pair` | 👀 {actor} e {target} cumprem o próximo desafio por {duration.label} enquanto o restante do grupo assiste. | Desafio | 3–5 | entre os dois 👥3+ | `{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `p_watch_random_pair` | Sorteio! {actor} e {target} ficam no centro por {duration.label} — {actor} toca {target} {bodyPart.em} enquanto o grupo assiste. | Desafio | 3–5 | sorteio entre 2 👥3+ | `{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `p_group_orders` | Por {duration.label}, {actor} manda em todo mundo. Cada ordem precisa caber nos limites de quem recebe. | Desafio | 2–5 | grupo todo 👥3+ | `bdsm_orders`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `p_group_blindfold` | Todos menos {actor} fecham os olhos. {actor} toca cada um {bodyPart.em} e eles adivinham a ordem depois. | Desafio | 3–5 | grupo todo 👥3+ | `bdsm_blindfold` + `touch_non_partner`<br>`{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}` |
| `p_couple_blind_hour` | {target} fica vendado por {duration.label}. {actor} não pode avisar nada do que vai fazer antes de fazer. | Desafio | 3–5 | sobre outro 👤👤 | `bdsm_blindfold` + `touch_caress`<br>`{duration}` → 6 valores de `durations`, a partir do nível 4 |

### 🍻 Bebida — `drinks` (8)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `dk_drink_or_strip` | {actor} escolhe: beber {amount.label} ou tirar {piece.label}. | Escolha | 2–5 | só quem joga | `{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele<br>`{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `dk_body_shot` | {actor} bebe {amount.label} direto de {target} — {bodyPart.em}. | Desafio | 3–5 | sobre outro | `drink_from_body`<br>`{bodyPart}` → 11 valores de `bodyParts`, exige `touch_{id}`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_mouth_to_mouth` | {actor} toma {amount.label} e passa para {target} de boca em boca, sem derramar. | Desafio | 3–5 | entre os dois | `drink_mouth_to_mouth`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_drink_kiss` | {actor} e {target} dão um gole e se beijam por {duration.label} antes de engolir. | Desafio | 3–5 | entre os dois | `kiss_prolonged` + `drink_sip`<br>`{duration}` → 6 valores de `durations`, a partir do nível 2 |
| `dk_straw` | {target} segura o copo com a boca enquanto {actor} bebe pelo canudo. Sem usar as mãos. | Desafio | 2–4 | sobre outro | `touch_sit_close` + `drink_sip` |
| `dk_blind_taste` | {target} venda {actor}, que bebe e tem que adivinhar o que é. Se errar, bebe de novo. | Desafio | 2–5 | sobre outro | `bdsm_blindfold`<br>**quem faz:** `drink_sip` |
| `dk_strip_roulette` | Todos bebem ao sinal de {actor}. O último a terminar tira {piece.label}. | Desafio | 3–5 | grupo todo 👥3+ | `drink_sip`<br>`{piece}` → 7 valores de `clothing`, cada valor exige o limite dele |
| `dk_touch_rule` | Até a próxima vez de {actor}: quem encostar em alguém bebe {amount.label}. | Desafio | 3–5 | grupo todo | `drink_rule` + `touch_caress`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |

## 🔥🔥 A partir do Modo Adulto

Aparecem em Adulto, Bate-Pronto e Livre. **Nunca** no Leve nem no Ousado.

### 💬 Perguntas — `questions` (2)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `q_dirty_description` | {actor}, descreva em voz alta, com todas as palavras, o que você quer fazer com {target} agora. | Pergunta | 4–5 | sobre outro | `sexual_dirty_talk` |
| `q_dirty_instructions` | {actor}, explique para {target} exatamente como você gosta de ser tocado. Com detalhe, não por cima. | Pergunta | 3–5 | sobre outro | `sexual_dirty_talk` + `q_sexual_preferences` |

### 🔞 Conteúdo sexual — `adult` (32)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `a_teasing` | {actor} tem {duration.label} para provocar {target} sem encostar nele nenhuma vez. | Desafio | 3–5 | sobre outro | `sexual_teasing`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_no_touch_rule` | Por {duration.label}, {actor} e {target} podem fazer o que quiserem — menos encostar nos genitais. | Desafio | 3–5 | entre os dois | `sexual_teasing`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_dirty_talk` | {actor} fala no ouvido de {target}, com todas as palavras, o que quer que aconteça em seguida. | Desafio | 3–5 | sobre outro | `sexual_dirty_talk` |
| `a_private_order` | 🔒 {actor} recebe uma instrução secreta e tem {duration.label} para executá-la em {target}. Ninguém mais pode ler. | Desafio | 3–5 | sobre outro | `sexual_teasing`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_making_out` | {actor} e {target} se agarram por {duration.label}. Quem interromper primeiro perde a rodada. | Desafio | 3–5 | entre os dois | `sexual_making_out`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_worship_part` | {actor} passa {duration.label} só em {target} — {bodyPart.em} — sem ir para nenhum outro lugar. | Desafio | 3–5 | sobre outro | `{bodyPart}` → 15 valores de `bodyParts`, exige `kiss_{id}`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_breasts` | {actor} estimula os seios de {target} com a boca e as mãos por {duration.label}. | Desafio | 4–5 | sobre outro | `sexual_breasts`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_breasts_modifier` | {actor} estimula os seios de {target} por {duration.label}, {modifier.label}. | Desafio | 4–5 | sobre outro | `sexual_breasts`<br>`{modifier}` → 6 valores de `modifier`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_manual` | {actor} masturba {target} {style.label} por {duration.label}. {target} não pode fechar os olhos. | Desafio | 4–5 | sobre outro | `sexual_manual`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3<br>`{style}` → 4 valores de `touchStyle` |
| `a_manual_modifier` | {actor} masturba {target} por {duration.label}, {modifier.label}. | Desafio | 4–5 | sobre outro | `sexual_manual`<br>`{modifier}` → 6 valores de `modifier`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_mutual` | {actor} e {target} se tocam ao mesmo tempo por {duration.label}. Quem gemer primeiro perde. | Desafio | 4–5 | entre os dois | `sexual_manual`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_anal_play` | {actor} estimula {target} na região anal, por fora, no ritmo que {target} pedir. | Desafio | 4–5 | sobre outro | `sexual_anal_play` |
| `a_oral` | {actor} faz sexo oral em {target} por {duration.label}. | Desafio | 4–5 | sobre outro | **quem faz:** `sexual_oral_give`<br>**quem recebe:** `sexual_oral_receive`<br>`{duration}` → 6 valores de `durations`, a partir do nível 4 |
| `a_oral_position` | {actor} faz sexo oral em {target}, {position.label}. | Desafio | 4–5 | sobre outro | **quem faz:** `sexual_oral_give`<br>**quem recebe:** `sexual_oral_receive`<br>`{position}` → 6 valores de `positions` |
| `a_oral_edge` | {actor} leva {target} até quase o fim com a boca — e para. Repete duas vezes antes de deixar acabar. | Desafio | 5–5 | sobre outro | **quem faz:** `sexual_oral_give`<br>**quem recebe:** `sexual_oral_receive` + `sexual_finish` |
| `a_toy` | {actor} usa um acessório sexual em {target} por {duration.label}. {target} escolhe qual. | Desafio | 4–5 | sobre outro | `sexual_toys`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_toy_choice` | {target} escolhe o acessório e onde ele vai ser usado. {actor} obedece sem discutir. | Escolha | 4–5 | sobre outro | `sexual_toys` |
| `a_solo_show` | {actor} se toca por {duration.label} enquanto {target} apenas assiste, sem encostar. | Desafio | 4–5 | sobre outro | **quem faz:** `sexual_masturbation_solo` + `exposure_watched`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_solo_narrated` | {actor} se toca por {duration.label} enquanto {target} narra em voz alta tudo o que está vendo. | Desafio | 4–5 | sobre outro | **quem faz:** `sexual_masturbation_solo` + `exposure_watched`<br>**quem recebe:** `sexual_dirty_talk`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_act_choice` | {actor} escolhe: {act.label} em {target} agora, ou passar a vez e ficar devendo uma. | Escolha | 3–5 | entre os dois | `{act}` → 5 valores de `sexAct`, cada valor exige o limite dele |
| `a_act_position` | {actor} e {target} vão {act.label}, {position.label}. | Desafio | 4–5 | entre os dois | `{act}` → 5 valores de `sexAct`, a partir do nível 4, cada valor exige o limite dele<br>`{position}` → 6 valores de `positions` |
| `a_penetration_choice` | {actor} e {target} vão {act.label}. {target} escolhe a posição. | Desafio | 5–5 | entre os dois | `{act}` → 5 valores de `sexAct`, a partir do nível 5, cada valor exige o limite dele |
| `a_random_pair_act` | Sorteio! {actor} e {target} — {act.label}. | Desafio | 4–5 | sorteio entre 2 👥3+ | `{act}` → 5 valores de `sexAct`, cada valor exige o limite dele |
| `a_no_hands_finish` | {actor} tem {duration.label} para levar {target} ao orgasmo. Se conseguir, {target} cumpre o próximo desafio dobrado. | Desafio | 5–5 | sobre outro | `sexual_finish`<br>`{duration}` → 6 valores de `durations`, a partir do nível 4 |
| `a_edge_count` | {actor} leva {target} até quase o fim {count.label} vezes antes de deixar acabar de verdade. | Desafio | 5–5 | sobre outro | `sexual_finish`<br>`{count}` → 3 valores de `counts` |
| `a_group_act` | Todos que aceitarem participam de um mesmo momento. Quem não quiser apenas passa. | Desafio | 5–5 | grupo todo 👥3+ | `sexual_group` + `dyn_more_than_two` |
| `a_couple_slow_build` | Por {duration.label}, vocês só podem aumentar a intensidade — nunca repetir o que já fizeram nem voltar atrás. | Desafio | 3–5 | entre os dois 👤👤 | `sexual_teasing` + `touch_caress`<br>`{duration}` → 6 valores de `durations`, a partir do nível 4 |
| `a_couple_guided` | {target} narra em voz alta, passo a passo, o que quer. {actor} só pode fazer exatamente o que for dito. | Desafio | 4–5 | sobre outro 👤👤 | `sexual_manual` + `sexual_dirty_talk` |
| `a_couple_choose_part` | {target} escolhe: {actor} fica {duration.label} em {bodyPart.def} — e só ali. | Escolha | 3–5 | sobre outro 👤👤 | `{bodyPart}` → 3 valores de `bodyParts`, exige `kiss_{id}`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_couple_denial` | {target} tem que pedir {count.label} vezes antes de {actor} fazer qualquer coisa. | Desafio | 4–5 | sobre outro 👤👤 | `sexual_teasing`<br>**quem recebe:** `bdsm_submit`<br>`{count}` → 3 valores de `counts` |
| `a_group_watch_pair` | Sorteio! Por {duration.label}, {actor} vai {act.label} em {target} enquanto o grupo assiste. | Desafio | 5–5 | sorteio entre 2 👥3+ | `{act}` → 5 valores de `sexAct`, cada valor exige o limite dele<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `a_group_vote_act` | O grupo vota em quem vai {act.label} com {actor}. {actor} tem direito a um veto. | Escolha | 4–5 | grupo todo 👥3+ | `{act}` → 5 valores de `sexAct`, cada valor exige o limite dele |

### ⛓️ Poder e exposição — `power` (18)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `p_dominate` | {actor} manda em {target} por {duration.label}. {target} obedece sem questionar. | Desafio | 3–5 | sobre outro | **quem faz:** `bdsm_dominate`<br>**quem recebe:** `bdsm_submit`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `p_dom_round` | {actor} manda em {target} pelo resto da rodada. {target} não pode dizer não a nada que esteja dentro dos limites. | Desafio | 4–5 | sobre outro | **quem faz:** `bdsm_dominate`<br>**quem recebe:** `bdsm_submit` |
| `p_switch` | {actor} e {target} trocam de papel agora. Quem mandava, obedece. | Escolha | 3–5 | entre os dois | `bdsm_switch` |
| `p_restraint` | {actor} prende as mãos de {target}. {target} continua o jogo assim. | Desafio | 4–5 | sobre outro | **quem faz:** `bdsm_tie_other` + `bdsm_restraint`<br>**quem recebe:** `bdsm_tie_self` + `bdsm_restraint` |
| `p_restraint_time` | {target} fica preso por {duration.label}. {actor} faz o que quiser — dentro do que os dois permitiram. | Desafio | 4–5 | sobre outro | **quem faz:** `bdsm_tie_other` + `bdsm_restraint`<br>**quem recebe:** `bdsm_tie_self` + `bdsm_restraint`<br>`{duration}` → 6 valores de `durations`, a partir do nível 4 |
| `p_accessories` | {actor} usa um acessório em {target}: algema, coleira ou mordaça. {target} escolhe qual dos três. | Escolha | 4–5 | sobre outro | `bdsm_accessories` |
| `p_spanking` | {actor} dá {count.label} palmadas em {target}. {target} conta em voz alta. | Desafio | 4–5 | sobre outro | `bdsm_spanking`<br>`{count}` → 3 valores de `counts` |
| `p_spanking_modifier` | {actor} dá {count.label} palmadas em {target}, {modifier.label}. | Desafio | 4–5 | sobre outro | `bdsm_spanking`<br>`{count}` → 3 valores de `counts`<br>`{modifier}` → 6 valores de `modifier` |
| `p_bite` | {actor} morde {target} {bodyPart.em} — de leve, mas o suficiente para marcar a intenção. | Desafio | 3–5 | sobre outro | `bdsm_pain_light`<br>`{bodyPart}` → 14 valores de `bodyParts`, exige `touch_{id}` |
| `p_show_intimate` | {actor} mostra para o grupo. Sem pressa, sem esconder. | Desafio | 5–5 | grupo todo | **quem faz:** `exposure_intimate_players` |
| `p_photo` | 🔒 {target} tira uma foto de {actor} do jeito que {target} quiser. A foto fica só entre os dois. | Desafio | 4–5 | sobre outro | **quem faz:** `exposure_photo`<br>**quem recebe:** `exposure_send_photo` |
| `p_recorded` | 🔒 {actor} e {target} gravam {duration.label} do próximo desafio. O vídeo não sai do aparelho de vocês. | Desafio | 4–5 | entre os dois | `exposure_recorded`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `p_camera_live` | {actor} liga a câmera do celular e cumpre o próximo desafio na frente dela por {duration.label}. | Desafio | 4–5 | só quem joga | **quem faz:** `exposure_camera`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `p_outside` | 🔒 {actor} manda uma mensagem ousada para alguém que não está na partida. Ninguém aqui lê o que foi escrito. | Desafio | 4–5 | só quem joga | **quem faz:** `exposure_outside` |
| `p_chain_spank` | Corrente: cada um dá {count.label} palmadas em quem está à direita. {actor} começa. | Desafio | 4–5 | grupo todo 👥3+ | `bdsm_spanking` + `touch_non_partner`<br>`{count}` → 3 valores de `counts` |
| `p_random_pair_dom` | Sorteio! Por {duration.label}, {target} obedece a tudo que {actor} mandar. | Desafio | 3–5 | sorteio entre 2 👥3+ | **quem faz:** `bdsm_dominate`<br>**quem recebe:** `bdsm_submit`<br>`{duration}` → 6 valores de `durations`, a partir do nível 3 |
| `p_couple_contract` | Vocês combinam agora quem manda até o fim da partida. Quem obedece escolhe uma palavra de segurança em voz alta. | Escolha | 3–5 | entre os dois 👤👤 | **quem faz:** `bdsm_dominate`<br>**quem recebe:** `bdsm_submit` |
| `p_couple_photo_series` | 🔒 {target} dirige um ensaio de {count.label} fotos de {actor}. As fotos ficam só no aparelho de vocês. | Desafio | 4–5 | sobre outro 👤👤 | **quem faz:** `exposure_photo`<br>**quem recebe:** `exposure_send_photo`<br>`{count}` → 3 valores de `counts` |

### 🍻 Bebida — `drinks` (5)

| ID | Texto do molde | Tipo | Int. | Alvo | Requisitos |
|---|---|---|---|---|---|
| `dk_body_shot_intimate` | {actor} bebe {amount.label} direto de {target} — {bodyPart.em}. | Desafio | 4–5 | sobre outro | `drink_from_body`<br>`{bodyPart}` → 3 valores de `bodyParts`, exige `touch_{id}`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_drink_and_act` | {actor} e {target} bebem {amount.label} e, sem intervalo, vão {act.label}. | Desafio | 4–5 | entre os dois | `{act}` → 5 valores de `sexAct`, cada valor exige o limite dele<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_moan_drink` | Enquanto {actor} provoca {target}, cada vez que {target} gemer {actor} bebe {amount.label}. | Desafio | 4–5 | sobre outro | `sexual_teasing`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |
| `dk_truth_shot` | {target} faz uma pergunta sem filtro sobre sexo. {actor} responde ou vira {amount.label}. | Escolha | 3–5 | sobre outro | `q_sexual_preferences`<br>`{amount}` → 4 valores de `drinkAmount`, a partir do nível 3, cada valor exige o limite dele |
| `dk_edge_drink` | {actor} não para até {target} pedir. Cada vez que {target} pedir para parar, bebe {amount.label} e recomeça. | Desafio | 5–5 | sobre outro | `sexual_manual`<br>`{amount}` → 4 valores de `drinkAmount`, cada valor exige o limite dele |

## 📌 Onde faltam cartas

Limites que o jogador pode permitir mas que **nenhuma carta usa ainda**.
Cada linha aqui é uma carta que vale a pena escrever.

✅ **Nenhum.** Todo limite do catálogo tem pelo menos uma carta que o usa.

_123 de 123 limites cobertos._

> Os limites `dyn_*`, `kiss_non_partner` e `touch_non_partner` não entram nesta conta:
> são aplicados pelo próprio motor a qualquer carta, não por cartas específicas.

## ➕ Como adicionar uma carta

Abra o arquivo do baralho em `src/data/decks/` e adicione um objeto ao array.

```js
{
  id: 'c_exemplo',              // único no baralho inteiro
  deck: 'contact',              // 'questions' | 'dares' | 'contact' | 'clothing' | 'adult' | 'power' | 'drinks'
  type: 'challenge',            // 'question' | 'challenge' | 'connection' | 'choice'
  minMode: 2,                   // 1 = Leve+ · 2 = Ousado+ · 3 = Adulto+
  intensity: [2, 4],            // faixa de nível em que pode sair
  targeting: 'other',           // 'self' | 'other' | 'pair' | 'all'
  visibility: 'public',         // 'private' esconde a carta dos outros jogadores

  requires: ['touch_caress'],        // exigido de TODOS os envolvidos
  requiresActor: ['bdsm_dominate'],  // exigido só de quem faz
  requiresTarget: ['bdsm_submit'],   // exigido só de quem recebe

  slots: {                      // lacunas (opcional)
    bodyPart: { pool: 'bodyParts', filter: { touchable: true }, limitKey: 'touch_{id}' },
    duration: { pool: 'durations', filter: { minTier: 2 } }
  },

  text: '{actor}, toque {target} {bodyPart.em} por {duration.label}.',
  points: { love: 2, fire: 3 }  // ❤️ conexão e 🔥 coragem
}
```

### Pools disponíveis para os slots

| Pool | Valores | Campos usáveis no texto | Limite por valor |
|---|---|---|---|
| `bodyParts` | 15 | `.id`, `.label`, `.def`, `.em` | `body_<id>` + o que o `limitKey` montar |
| `durations` | 6 | `.id`, `.label` | — |
| `counts` | 3 | `.id`, `.label` | — |
| `clothing` | 7 | `.id`, `.label` | `{limit}` do valor |
| `kissStyle` | 4 | `.id`, `.label` | `{limit}` do valor |
| `touchStyle` | 4 | `.id`, `.label` | — |
| `sexAct` | 5 | `.id`, `.label` | `{limit}` do valor |
| `power` | 4 | `.id`, `.label` | `{limit}` do valor |
| `questionTopics` | 15 | `.id`, `.label` | `{limit}` do valor |
| `modifier` | 6 | `.id`, `.label` | `{limit}` do valor |
| `positions` | 6 | `.id`, `.label` | — |
| `drinkAmount` | 4 | `.id`, `.label` | `{limit}` do valor |
| `drinkRule` | 6 | `.id`, `.label` | — |
| `places` | 6 | `.id`, `.label` | — |

### Regras que a carta precisa respeitar

1. **Nunca exija um limite acima do próprio `minMode`.** Uma carta `minMode: 2` não pode pedir `sexual_*` — o limite nem existe no Modo 2 e a carta nunca sairia.
2. **Separe quem faz de quem recebe.** Sexo oral não é a mesma permissão para os dois lados: use `requiresActor` e `requiresTarget`.
3. **Prefira slot a texto fixo.** Uma carta com `{bodyPart}` vale por dez cartas fixas e respeita os limites sozinha.
4. **`intensity` precisa caber no teto do modo.** O Ousado só chega ao nível 4: uma carta `[5, 5]` com `minMode: 2` nunca apareceria lá.
5. Rode `npm run check` depois — ele valida as regras 1 e 4 e avisa se a carta referencia um limite inexistente.
