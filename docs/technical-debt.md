# Débitos técnicos

Itens conhecidos que decidimos não resolver agora. Cada entrada registra o contexto, o motivo do adiamento e o que fazer quando retomarmos.

---

## 1. Duplicação entre os view models e repositórios de Characters e Locations

- **Origem:** comentário de review do PR #8 (pagination + fix: header behavior).
- **Prioridade:** baixa.
- **Status:** aberto.

### Problema

Os arquivos abaixo são cópias quase literais, diferindo só em nomes (`characters`/`locations`, `Character*`/`Location*`):

- [characterListViewModel.ts](../components/characters/charactersCarousel/characterListViewModel.ts) e [locationListViewModel.ts](../components/locationsCarousel/locationListViewModel.ts): máquina de estados `loading`/`loaded`/`error`, carregamento inicial com cancelamento, `loadMore` com guarda `isLoadingMoreRef` e retry.
- [CharacterRepositoryImpl.ts](../services/data/repositoryImplementation/CharacterRepositoryImpl.ts) e [LocationRepositoryImpl.ts](../services/data/repositoryImplementation/LocationRepositoryImpl.ts): `nextUrl`, guard `inFlight` e `loadNextPage`.

Uma correção de bug na paginação precisa ser feita duas vezes e pode divergir.

### Opções de refatoração

**A. Hook genérico `usePaginatedListViewModel<T>` (recomendada)**
- Recebe um repositório que satisfaça uma interface mínima, por exemplo `{ items: T[]; hasNextPage: boolean; loadNextPage(): Promise<void> }`, ou um adaptador (`getItems: () => repo.characters`).
- Os dois view models viram wrappers finos. Elimina cerca de 80 linhas duplicadas sem mexer no Domain.

**B. Classe base `PaginatedRepository<TDto, T>` na camada Data**
- Centraliza `nextUrl` e o guard `inFlight`.
- Mudança maior, que atravessa camadas. Só vale se surgir um terceiro recurso paginado.

### Por que foi adiado

- Não é de alta prioridade: a duplicação está contida em dois recursos.
- A paginação foi implementada sem testes (decisão consciente), então um refactor agora não teria rede de segurança. O guard de concorrência é justamente o tipo de lógica que quebra em refatorações.
- Melhor fazer num PR separado de `refactor:` do que misturar com paginação e fix de header.

### Ao retomar

1. Escrever testes para o comportamento atual dos view models e do guard `inFlight`: `loadMore` sem efeito quando `hasNextPage` é false ou já há load em andamento, chamadas concorrentes de `loadNextPage()` retornando a mesma promise, erro seguido de retry.
2. Extrair a opção A com os testes verdes.
3. Avaliar a opção B se houver um terceiro recurso paginado.

---

## 2. Falta de testes para a lógica de paginação

- **Origem:** comentário de review do PR #8.
- **Prioridade:** média.
- **Status:** aberto (pulado de propósito no PR #8).

Sem cobertura para:

- `characterListViewModel.ts` e `locationListViewModel.ts`;
- o guard `inFlight` em `CharacterRepositoryImpl` e `LocationRepositoryImpl`.

Casos a cobrir: `loadMore` no-op com `hasNextPage` false ou load em andamento; chamadas concorrentes de `loadNextPage()` sem fetch duplicado; falha seguida de retry (`nextUrl` inalterado, `loadMoreError` definido e depois limpo); lista vazia.

Idealmente é feito antes do item 1, que depende desses testes.

---

## 3. Telas de busca de Characters e Locations duplicadas

- **Origem:** review da branch `adding-search-feature-characters-and-location`.
- **Prioridade:** baixa.
- **Status:** aberto.

### Problema

[characters/index.tsx](../app/(features)/characters/index.tsx) e [locations/index.tsx](../app/(features)/locations/index.tsx) ganharam cerca de 100 linhas quase idênticas cada: o mesmo header (voltar e busca), a mesma `SearchBar` flutuante e a mesma estrutura de estados (loading, vazio, erro e lista). Só mudam o tipo, o card, o view model e o placeholder. Qualquer ajuste na UI de busca precisa ser feito duas vezes e as telas podem divergir.

### Opção de refatoração

Componente genérico, por exemplo `SearchableGridScreen<T>`, que recebe o view model, o `renderItem` e o placeholder. Relacionado ao item 1, que cobre a duplicação equivalente nos view models.

### Ao retomar

Fazer junto com o item 4, num PR separado de `refactor:`, porque o view model genérico atenderia as duas telas.

---

## 4. Lógica de apresentação dentro das telas de busca

- **Origem:** review da branch `adding-search-feature-characters-and-location`.
- **Prioridade:** baixa.
- **Status:** aberto.

### Problema

Dentro do componente de cada tela há um bloco que une o estado da lista normal com o da busca em um único `view`, escolhe qual `loadMore` usar e decide quando mostrar o erro com retry. Isso é regra de apresentação e deveria estar em um view model (por exemplo `useCharacterScreenViewModel`), não no JSX. Hoje, testar esse bloco exige montar a tela inteira.

### Ao retomar

Extrair o bloco para um view model genérico depois do item 3, para servir às duas telas, e cobri-lo com testes (ver item 2).

---

## 5. Repositórios misturam estado mutável e consultas sem estado

- **Origem:** review da branch `adding-search-feature-characters-and-location`. O design é anterior à branch; a busca só adicionou mais um método sem estado.
- **Prioridade:** baixa.
- **Status:** aberto.

### Problema

`CharacterRepository` e `LocationRepository` expõem estado mutável (`characters`/`locations`, `hasNextPage`, `loadNextPage()`, que acumula páginas internamente) ao lado de consultas puras (`searchCharacters(name, page)`, `getCharacterById`, e equivalentes em Locations). Quem usa não sabe se uma chamada altera algo interno, e o estado compartilhado dificulta testar e usar o repositório em dois lugares ao mesmo tempo.

### Ao retomar

É uma decisão de arquitetura que afeta toda a camada de dados. Avaliar junto com a opção B do item 1 (classe base de repositório paginado), separando um repositório com estado de consultas sem estado. Não misturar com PRs de feature.

---

## 6. `loadAllEpisodes()` sem guarda de concorrência

- **Origem:** revisão dos specs de feature.
- **Prioridade:** baixa.
- **Status:** aberto.

[EpisodeRepositoryImpl.ts](../services/data/repositoryImplementation/EpisodeRepositoryImpl.ts) concatena os episódios a cada chamada e não tem o guard `inFlight` dos outros repositórios. Duas chamadas simultâneas (ou repetidas) duplicam a lista. Hoje os view models só chamam quando `episodes` está vazio, o que evita o problema na prática. Correção futura: reaproveitar a promise em andamento e ignorar chamadas quando já carregou.

---

## 7. Background branco na passagem de tela (ex: discover -> see all) 

- **Origem:** testagem manual 
- **Prioridade:** alta.
- **Status:** aberto.

Durante a troca de view, foi identificado que um background branco aparece, sendo mais claro durante os testes em android do que em ios. necessário pesquisar possíveis origens e entender como podemos arrumar o problema.

---

## 8. Botão dentro da custom bar - color

- **Origem:** testagem manual 
- **Prioridade:** baixa.
- **Status:** aberto.

Temos que trocar a cor do icon não selecionado da CustomTabBar, a cor atual fica escondida por conta dos cards de location. Quando pesquisamos um character/location, o ico9n aparece tranquilamente, provavelmente só precisamos deixalo um pouco mais escuro.

---

## 9. Minor — duplicated icon-shape type (unchanged from previous review)

- **Origem:** git hub review
- **Prioridade:** alta.
- **Status:** aberto.

components/locationsCarousel/details/LocationInfoTile.tsx:7 and the heroIcon return type in components/locationsCarousel/details/LocationDetailsView.tsx:15 both inline { ios: SFSymbol; android: AndroidSymbol; web: AndroidSymbol }, a shape already duplicated a third time in LocationCard.tsx:33. A shared PlatformSymbol type alias would remove the triplication next time one of these files is touched. Not blocking — already flagged as tech debt in the PR description.

---

## 10. Worth confirming — "unknown" fallback vs. spec wording (unchanged from previous review)

- **Origem:** git hub review
- **Prioridade:** alta.
- **Status:** aberto.

displayValue (LocationDetailsView.tsx:31) maps any empty/whitespace field to the literal string "unknown", so a genuinely empty API field becomes visually indistinguishable from an API-provided "unknown" value. Reasonable interpretation, but worth a design/product sign-off since the spec's "sometimes unknown" note was describing real API data, not prescribing this fallback text.