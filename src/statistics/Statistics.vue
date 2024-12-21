<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from "@/stores/auth.js";
import axios from 'axios';
import { Bar, Pie, Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement);

// Auth Store
const authStore = useAuthStore();

// Loading state and statistics data
const loading = ref(true);
const generalStats = ref({});
const adminStats = ref({});

// Line graph
const timeFrame = ref('month'); 
const gamesByTimeData = ref([]);
const lineChartData = ref({
  labels: [],
  datasets: [],
});

// Computed Properties
const isAdmin = computed(() => authStore.userType === 'A');

// Fetch General Statistics
const fetchGeneralStats = async () => {
  try {
    const response = await axios.get('/statistics/general');
    generalStats.value = response.data;

    // Prepare Chart Data
    prepareChartData();
  } catch (error) {
    console.error('Error fetching general statistics:', error);
  }
};

// Fetch Admin Statistics
const fetchAdminStats = async () => {
  try {
    const response = await axios.get('/statistics/admin');
    adminStats.value = response.data;
    prepareRevenueChartData();
  } catch (error) {
    console.error('Error fetching admin statistics:', error);
  }
};

// Prepare Chart Data
const boardChartData = ref({
  labels: [],
  datasets: [],
});

const prepareChartData = () => {
  // Games by Board Chart
  if (generalStats.value.gamesByBoard) {
    const boards = generalStats.value.gamesByBoard;

    boardChartData.value = {
      labels: boards.map((board) => `Board ${board.board_id}`), 
      datasets: [
        {
          label: 'Games Played',
          data: boards.map((board) => board.games_count),
          backgroundColor: boards.map((_, index) => {
            // Define custom colors for each board
            const colors = ['#4BC0C0', '#9966FF', '#FF6384'];
            return colors[index % colors.length];
          }),
          borderColor: '#333333',
          borderWidth: 1,
        },
      ],
    };
  }
};

const boardChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'left',
      labels: {
        boxWidth: 20,
        boxHeight: 20,
        padding: 30,
        color: '#000',
        font: {
          size: 16,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const total = context.dataset.data.reduce((sum, value) => sum + value, 0);
          const value = context.raw;
          const percentage = ((value / total) * 100).toFixed(1);
          return `${context.label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
  layout: {
    padding: {
      left: 20,
      right: 10,
      top: 10,
      bottom: 10,
    },
  },
};

const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
        },
        tooltip: {
            callbacks: {
                label: (context) => `${context.raw} games`,
            },
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Months',
            },
        },
        y: {
            title: {
                display: true,
                text: 'Games Played',
            },
        },
    },
};

const revenueChartData = ref({
  labels: [],
  datasets: [],
});

const prepareRevenueChartData = () => {
  if (adminStats.value.revenueByPaymentType) {
    const data = adminStats.value.revenueByPaymentType;
    revenueChartData.value = {
      labels: data.map((item) => item.payment_type),
      datasets: [
        {
          label: 'Revenue (€)',
          data: data.map((item) => item.total_revenue),
          backgroundColor: ['#FF3366', '#2FE033', '#3366FF', '#FFCC33', '#663399'],
          borderColor: '#333333',
          borderWidth: 1,
        },
      ],
    };
  }
};

const fetchGamesByTime = async () => {
    try {
        const response = await axios.get(`/statistics/games-by-time/${timeFrame.value}`);
        gamesByTimeData.value = response.data;
        prepareLineChartData();
    } catch (error) {
        console.error('Error fetching games by time:', error);
    }
};

const prepareLineChartData = () => {
    if (gamesByTimeData.value.length) {
        lineChartData.value = {
            labels: gamesByTimeData.value.map((item) => item.period),
            datasets: [
                {
                    label: `Games (${timeFrame.value})`,
                    data: gamesByTimeData.value.map((item) => item.games_count),
                    fill: false,
                    borderColor: '#4BC0C0',
                    tension: 0.1, 
                },
            ],
        };
    }
};

// Watch for timeframe changes
watch(timeFrame, fetchGamesByTime);

// On component load
const loadStatistics = async () => {
  await fetchGeneralStats();
  if (isAdmin.value) {
    await fetchAdminStats();
  }
  await fetchGamesByTime();
  loading.value = false;
};

loadStatistics();
</script>

<template>
  <div v-if="loading" class="text-center text-gray-500">
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 class="text-2xl font-bold mb-6 text-center text-black">Statistics</h1>
      Loading statistics...
    </div>
  </div>
  <div v-else>
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 class="text-2xl font-bold mb-6 text-center">Statistics</h1>
        <div class="mb-6">
          <br>
          <ul class="space-y-3">
            <li class="flex justify-between border-b pb-2">
              <span>Total Players:</span>
              <span class="font-medium">{{ generalStats.totalPlayers || 0 }}</span>
            </li>
            <li class="flex justify-between border-b pb-2">
              <span>Total Games:</span>
              <span class="font-medium">{{ generalStats.totalGames || 0 }}</span>
            </li>
            <li class="flex justify-between border-b pb-2">
              <span>Games in progress:</span>
              <span class="font-medium">{{ generalStats.gamesInProgress || 0 }}</span>
            </li>
            <li class="flex justify-between border-b pb-2">
              <span>Most Popular Board:</span>
              <span class="font-medium">{{ generalStats.mostPopularBoard ? `Board ${generalStats.mostPopularBoard.board_id}` : 'N/A' }}</span>
            </li>
          </ul>

          <div class="mt-6">
            <h3 class="text-lg font-medium mb-4">Games by Board</h3>
            <div class="h-64 w-full">
              <Pie
                v-if="boardChartData.datasets.length"
                :data="boardChartData"
                :options="boardChartOptions"
              />
            </div>
          </div>
          <br>
          <ul class="space-y-3">
            <li class="flex justify-between border-b pb-2">
              <span>Average Game Duration:</span>
              <span class="font-medium">{{ `${Math.round(generalStats.averageGameDuration * 100) / 100} seconds` || 0 }}</span>
            </li>
            <li class="flex justify-between border-b pb-2">
              <span>Multiplayer Games Played:</span>
              <span class="font-medium">{{ generalStats.multiplayerGames || 0 }}</span>
            </li>
            <li class="flex justify-between border-b pb-2">
              <span>User total braincoins:</span>
              <span class="font-medium">{{ generalStats.totalBrainCoins || 0 }}</span>
            </li>
          </ul>
          <div class="mt-6">
            <h3 class="text-lg font-medium mb-4">Games Played Over Time</h3> 
            <div class="h-64 w-full">
                <Line v-if="lineChartData.datasets.length" :data="lineChartData" :options="lineChartOptions" />
            </div>
          </div>
        </div>
    </div>
    <div v-if="isAdmin" class="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 class="text-2xl font-bold mb-6 text-center">Admin Statistics</h1>
      <br>
      <ul class="space-y-3">
        <li class="flex justify-between border-b pb-2">
          <span>Brain Coins Bought:</span>
          <span class="font-medium">{{ adminStats.brainCoinsBought || 0 }}</span>
        </li>
      
        <li class="flex justify-between border-b pb-2">
          <span>Total Earnings:</span>
          <span class="font-medium">{{ adminStats.totalEarnings + '€' || 0 }}</span>
        </li>
        
        <div class="mt-6">
          <h3 class="text-lg font-medium mb-4">Revenue by Payment Type</h3>
          <div class="h-64 w-full mb-4 flex justify-center">
            <Bar v-if="revenueChartData.datasets.length" :data="revenueChartData" />
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>
