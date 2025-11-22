import { createPinia } from "pinia";
import { createApp } from "vue";

import "@/style.css";
import App from "@/App.vue";
import Button from "@/components/primitives/Button.vue";
import Card from "@/components/primitives/Card.vue";
import InputField from "@/components/primitives/InputField.vue";
import router from "@/router";

const pinia = createPinia();

const app = createApp(App);
app.use(pinia).use(router);

app.component("Button", Button);
app.component("Card", Card);
app.component("InputField", InputField);

app.mount("#app");
