<template>
  <v-app>
    <v-main class="pa-4" style="background-color: #f0f4f8">
      <v-container>
        <h2 class="text-h5 mb-4">🛒 Lista de Mercado</h2>

        <!-- Formulário -->
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="newItem.name"
              label="Nome do Produto"
              dense
              outlined
              color="primary"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-combobox
              v-model="newItem.category"
              :items="availableCategories"
              label="Categoria"
              dense
              outlined
              color="primary"
              clearable
              hint="Escolha ou crie"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field
              v-model.number="newItem.quantity"
              type="number"
              label="Qtd"
              min="1"
              dense
              outlined
              color="primary"
            />
          </v-col>
          <v-col cols="12" md="3" class="d-flex align-center">
            <v-btn color="primary" block @click="addItem">
              Adicionar Produto
            </v-btn>
          </v-col>
        </v-row>

        <!-- Lista de Produtos -->
        <v-card class="mt-6" elevation="2">
          <v-card-title
            class="d-flex justify-space-between align-center bg-blue-darken-1 text-white"
          >
            <span>📦 Lista de Produtos</span>
            <v-btn color="red" density="comfortable" @click="clearItems">
              Excluir Todos
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                class="d-flex justify-space-between align-center"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                  <div class="text-caption">
                    Categoria: {{ item.category }} | Qtd: {{ item.quantity }}
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <v-btn
                    color="green"
                    :disabled="cart.some((i) => i.name === item.name)"
                    @click="addToCart(index)"
                  >
                    ADICIONAR
                  </v-btn>
                  <v-btn color="red" @click="removeItem(index)">
                    EXCLUIR
                  </v-btn>
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Carrinho -->
        <v-card v-if="cart.length" class="mt-6" elevation="2">
          <v-card-title class="bg-green-darken-2 text-white">
            🛍️ Itens no Carrinho
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(item, index) in cart"
                :key="index"
                class="d-flex justify-space-between align-center"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                  <div class="text-caption">
                    Categoria: {{ item.category }} | Qtd: {{ item.quantity }}
                  </div>
                </div>
                <div class="d-flex align-center gap-2">
                  <v-text-field
                    v-model.number="item.price"
                    type="number"
                    label="Valor R$"
                    density="compact"
                    style="max-width: 120px"
                    @input="saveCart"
                  />
                  <div class="text-caption text-grey-darken-1">
                    Total: R$ {{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                  <v-btn icon color="red" @click="removeFromCart(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Botão de Orçamento -->
        <v-btn class="mt-4" color="indigo" @click="showBudgetDialog = true">
          💳 Adicionar Orçamento
        </v-btn>

        <!-- Modal de Orçamento -->
        <v-dialog
          v-model="showBudgetDialog"
          persistent
          max-width="400"
          attach="body"
        >
          <v-card>
            <v-card-title class="text-h6">💳 Novo Orçamento</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="newBudget.name"
                label="Nome (ex: Cartão)"
                outlined
              />
              <v-text-field
                v-model.number="newBudget.value"
                label="Valor (R$)"
                type="number"
                outlined
              />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn text @click="showBudgetDialog = false">Cancelar</v-btn>
              <v-btn color="primary" @click="saveBudget">Salvar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Total e Orçamento -->
        <div class="text-right mt-4">
          <div class="text-h6">🧾 Total: R$ {{ total.toFixed(2) }}</div>
          <div v-if="budgets.length" class="text-subtitle-2 mt-2">
            <div v-for="(b, i) in budgets" :key="i" class="mt-1">
              💳 <strong>{{ b.name }}:</strong> R$ {{ b.value.toFixed(2) }}
              <v-btn
                icon
                color="red"
                variant="outlined"
                density="comfortable"
                @click="excluirBudget(i)"
              >
                x
              </v-btn>
            </div>
            <div class="mt-1">
              🧮 <strong>Total Orçamento:</strong> R$ {{ totalBudget.toFixed(2)
              }}<br />
              💰
              <strong :class="saldo < 0 ? 'text-red' : 'text-green'">
                Saldo: R$ {{ saldo.toFixed(2) }}
              </strong>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref, computed, onMounted, watch } from "vue";

  const newItem = ref({ name: "", category: "", quantity: 1 });
  const items = ref([]);
  const cart = ref([]);
  const availableCategories = ref([]);

  const showBudgetDialog = ref(false);
  const budgets = ref([]); // [{ name: 'Cartão', value: 150 }]
  const newBudget = ref({ name: "", value: 0 });

  const totalBudget = computed(() =>
    budgets.value.reduce((sum, b) => sum + (b.value || 0), 0)
  );

  const saldo = computed(() => totalBudget.value - total.value);

  const total = computed(() =>
    cart.value.reduce((sum, item) => {
      const subtotal =
        item.price && item.quantity ? item.price * item.quantity : 0;
      return sum + subtotal;
    }, 0)
  );

  onMounted(() => {
    const savedItems = localStorage.getItem("marketListItems");
    const savedCart = localStorage.getItem("marketCart");
    const savedBudgets = localStorage.getItem("marketBudgets");

    if (savedItems) items.value = JSON.parse(savedItems);
    if (savedCart) cart.value = JSON.parse(savedCart);
    if (savedBudgets) budgets.value = JSON.parse(savedBudgets);

    updateCategories();
  });

  const addItem = () => {
    const name = newItem.value.name.trim();
    const category = newItem.value.category.trim();
    const quantity = parseInt(newItem.value.quantity);

    if (!name || !category || quantity < 1) return;

    items.value.push({ name, category, quantity });
    newItem.value = { name: "", category: "", quantity: 1 };

    updateCategories();
    saveItems();
  };

  const removeItem = (index) => {
    items.value.splice(index, 1);
    updateCategories();
    saveItems();
  };

  const excluirBudget = (index) => {
    budgets.value.splice(index, 1);
    localStorage.setItem("marketBudgets", JSON.stringify(budgets.value));
  };

  const addToCart = (index) => {
    const item = items.value[index];
    if (!cart.value.some((i) => i.name === item.name)) {
      cart.value.push({ ...item, price: 0 });
      saveCart();
    }
  };

  const removeFromCart = (index) => {
    cart.value.splice(index, 1);
    saveCart();
  };

  const clearItems = () => {
    items.value = [];
    cart.value = [];
    saveItems();
    saveCart();
  };

  const saveItems = () => {
    localStorage.setItem("marketListItems", JSON.stringify(items.value));
  };

  const saveCart = () => {
    localStorage.setItem("marketCart", JSON.stringify(cart.value));
  };

  const saveBudget = () => {
    if (!newBudget.value.name || newBudget.value.value <= 0) return;

    budgets.value.push({ ...newBudget.value });
    localStorage.setItem("marketBudgets", JSON.stringify(budgets.value));

    newBudget.value = { name: "", value: 0 };
    showBudgetDialog.value = false;
  };

  const updateCategories = () => {
    const categorias = items.value.map((item) => item.category);
    availableCategories.value = [...new Set(categorias)];
  };

  watch(items, saveItems, { deep: true });
  watch(cart, saveCart, { deep: true });
</script>

<style scoped>
  .gap-2 {
    gap: 8px;
  }
  .text-red {
    color: red;
  }
  .text-green {
    color: green;
  }
</style>
