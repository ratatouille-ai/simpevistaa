<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import CurrentAdminUserService from "../services/CurrentAdminUserService";
import RatatouilleApi from "../../api/index";

interface ClientsCount {
  total: string | number;
}

export default defineComponent({
  name: "Home",
  setup() {
    const router = useRouter();
    const activeClientsCount = ref<number>(0);
    const isLoadingClientsCount = ref(false);

    const fetchActiveClientsCount = async () => {
      isLoadingClientsCount.value = true;
      try {
        const query = `
          SELECT COUNT(*) as total 
          FROM clients 
          WHERE is_active = true
        `;
        
        const response = await RatatouilleApi.doQuery(query);
        const result = response as ClientsCount[];
        activeClientsCount.value = parseInt(result[0]?.total?.toString() || "0");
      } catch (error) {
        console.error("Error fetching active clients count:", error);
        activeClientsCount.value = 0;
      } finally {
        isLoadingClientsCount.value = false;
      }
    };

    const navigateToClients = () => {
      router.push("/clients");
    };

    onMounted(() => {
      fetchActiveClientsCount();
    });

    return {
      adminUser: CurrentAdminUserService.getAdminUser(),
      activeClientsCount,
      isLoadingClientsCount,
      navigateToClients,
    };
  },
});
</script>

<template>
  <div class="home">
    <div class="page-header">
      <div class="page-icon">
        <img :src="'https://res.cloudinary.com/dt2jraprb/image/upload/w_150/v1760222828/ChatGPT_Image_12_oct_2025_00_46_39_uustfa.webp'" alt="Ratatouille" />
      </div>
      <h1 class="page-title">Hello {{ adminUser.first_name }}</h1>
    </div>

    <div class="content-grid">
      <div class="card card-welcome">
        <h2>Welcome to Ratatouille</h2>
        <p>
          🚀 Ready to build your web platform?
          <a
            href="https://ratatouille-ai.github.io/app-generator?edit=simpevistaa"
            class="link"
            target="_blank"
          >
            Start now!
          </a>
        </p>
      </div>

      <div class="card card-counter" @click="navigateToClients">
        <div class="card-counter-content">
          <div class="counter-icon">👥</div>
          <div class="counter-info">
            <h3 class="counter-title">Active Clients</h3>
            <div class="counter-value">
              <span v-if="isLoadingClientsCount" class="loading-dots">...</span>
              <span v-else class="count">{{ activeClientsCount }}</span>
            </div>
          </div>
        </div>
        <div class="counter-action">
          <span class="action-text">Click to view all clients →</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.card-links,
.card-getting-started {
  grid-column: span 1;
}

.card-counter {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.card-counter:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 167, 111, 0.15);
}

.card-counter-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.counter-icon {
  font-size: 48px;
  opacity: 0.8;
}

.counter-info {
  flex: 1;
}

.counter-title {
  font-size: 16px;
  color: #666;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.counter-value {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.count {
  font-size: 36px;
  font-weight: 700;
  color: #00a76f;
  line-height: 1;
}

.loading-dots {
  font-size: 36px;
  font-weight: 700;
  color: #00a76f;
  line-height: 1;
  opacity: 0.6;
}

.counter-action {
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
  margin-top: 15px;
}

.action-text {
  font-size: 14px;
  color: #00a76f;
  font-weight: 500;
}

.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.steps-list {
  margin: 0;
  padding-left: 20px;
  color: #666;
  font-size: 14px;
  line-height: 1.8;
}

.steps-list li {
  margin-bottom: 8px;
}

.steps-list li:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>