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
