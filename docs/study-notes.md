# Docs de estudo — React Native / Expo

Anotações coletadas dos comentários do código, organizadas por tema. Cada seção indica o arquivo de origem.

---

## Arquitetura e organização de pastas

Origem: [app/(tabs)/index.tsx](../app/(tabs)/index.tsx)

- **`app/`** → só as telas (`index.tsx`, `[id].tsx`), propositalmente "magras": chamam o hook do view model e renderizam o componente, mas não guardam lógica de UI ou de estado.
- **`components/`** → blocos reutilizáveis de apresentação: Cards, Carousels, ViewModels (`useCharacterCarouselViewModel`) e UI States. Nada aqui sabe que existe uma rota; um `CharactersCarousel` pode, em tese, ser usado em duas telas diferentes sem saber de nenhuma delas.
- **`services/`** → Domain e Data (repositórios, entidades, mappers) — a camada mais pura, sem nada de UI.
- **`index`** é basicamente a rota de entrada de uma pasta (principal arquivo de referência numa navegação).

---

## Layouts e navegação (Expo Router)

### `app/_layout.tsx`
Origem: [app/_layout.tsx](../app/_layout.tsx)

Engloba a raiz do app inteiro. Ele:
- monta o `Stack` (o navigator principal, tipo pilha);
- faz o trabalho de startup (carregar fontes, controlar a splash screen, aplicar o `ThemeProvider` claro/escuro);
- declara `(tabs)` como uma tela dentro desse Stack, com `headerShown: false` (a tab bar cuida da própria navegação, não precisa do header do Stack por cima).

### `app/(tabs)/_layout.tsx`
Origem: [app/(tabs)/_layout.tsx](../app/(tabs)/_layout.tsx)

É a configuração de um container que vai exibir outras telas dentro dele.

---

## ScrollView vs FlatList

Origem: [app/(features)/characters/index.tsx](../app/(features)/characters/index.tsx)

- **ScrollView** → renderiza todos os filhos de uma vez, mesmo os que estão fora da tela.
- **FlatList** → construída em cima da ScrollView e renderiza só os itens visíveis e uns poucos ao redor.

---

## Container/View Pattern

Origem: [components/season+episodes/SeasonCard.tsx](../components/season+episodes/SeasonCard.tsx)

Abordagem comum no desenvolvimento React Native. A ideia é separar a lógica de apresentação (**View**) da lógica de negócios (**Container**):

- O **Container** gerencia o estado, busca dados e lida com eventos.
- A **View** renderiza a interface com base nos dados fornecidos pelo Container.

Benefícios: melhor organização do código, manutenção mais fácil e reutilização de componentes em diferentes partes do app.

Isso também faz a view ser independente de layout e o container ser independente de estilo, promovendo reutilização e separação de responsabilidades (acredito que isso seja o *modifier* deles).

### `export const` vs `export default`

- `export const` permite exportar múltiplos componentes/funções do mesmo arquivo; o nome precisa ser usado explicitamente ao importar.
- `export default` permite exportar apenas um componente/função como padrão.

---

## Estado e ViewModel (hooks)

Origem: [components/season+episodes/seasonViewModel.ts](../components/season+episodes/seasonViewModel.ts)

- `useState` ≈ `@Published` (Swift) / `MutableStateFlow` (Kotlin): garante que a memória continue viva mesmo que tudo seja re-renderizado.
- `state` é o valor que usamos nas views; o `setState` tem a energia de um `self.state = newValue`.
- `useEffect` (no mount) funciona como um *on appear*.

---

## Discriminated union (UI State)

Origem: [components/season+episodes/seasonEpisodesUiState.ts](../components/season+episodes/seasonEpisodesUiState.ts)

Mesma energia de um `enum` com associated values (Swift) ou de uma `sealed class` (Kotlin). O nome disso é **discriminated union**.

---

## Animação e tab bar customizada

Origem: [components/shared/CustomTabBar.tsx](../components/shared/CustomTabBar.tsx)

- Constantes definem o tamanho da barra, margens e espaçamento do "pill" (indicador de seleção).
- O esquema de cores atual (claro ou escuro) vem do arquivo `Colors.ts`.
- A largura da barra e de cada item (aba) é calculada com base no número de rotas.
- `useSharedValue` (Reanimated) cria uma variável animada que representa a posição do "pill", baseada no índice da aba selecionada.

---

## Botão de voltar do header

Origem: [components/shared/HeaderBackButton.tsx](../components/shared/HeaderBackButton.tsx)

- Wrapper com o mesmo sistema de sombras e bordas arredondadas da `CustomTabBar`.
- Item para `unstable_headerLeftItems`: `hidesSharedBackground` remove o fundo de vidro nativo do iOS 26, que duplicaria o fundo do botão.
- Ajuste óptico leve para centralizar a seta do chevron perfeitamente.

---

## Models e Regex

### `RMCharacter`
Origem: [services/data/remote/characters/RMCharacter.ts](../services/data/remote/characters/RMCharacter.ts)

1. Enum para o status do personagem.
2. Interface para a origem do personagem.
3. O modelo principal mapeado do *Data Class*.

### `Episode`
Origem: [services/domain/model/Episode.ts](../services/domain/model/Episode.ts)

- Se não encontrar o padrão na Regex, retorna `[0, 0]`.
- `match[1]` captura o primeiro grupo `(\d+)` e `match[2]` o segundo.
