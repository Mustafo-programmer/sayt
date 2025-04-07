// Начальные категории (если localStorage пуст)
const defaultCategories = [
    { name: "Все нейросети", desc: "Все доступные нейросети" },
    { name: "Обработка изображений", desc: "Нейросети для работы с графикой" },
    { name: "Обработка текста", desc: "Нейросети для анализа текста" },
    { name: "Chat AI", desc: "Чат-боты на основе ИИ" },
    { name: "Генерация музыки", desc: "Нейросети для создания музыки" },
    { name: "Дизайн", desc: "Нейросети для создания дизайна и логотипов" }
];

// Начальные нейросети (если localStorage пуст)
const defaultNetworks = [
    {
        categories: ["Chat AI", "Обработка текста"],
        name: "ChatGPT",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
        desc: "ИИ для генерации текста и разговоров от OpenAI",
        url: "https://chat.openai.com/",
        status: "mixed"
    },
    {
        categories: ["Chat AI"],
        name: "Grok",
        logo: "https://example.com/grok-logo.png",
        desc: "ИИ-ассистент от xAI для ответов на вопросы",
        url: "https://grok.x.ai/",
        status: "paid"
    },
    {
        categories: ["Chat AI"],
        name: "Claude",
        logo: "https://example.com/claude-logo.png",
        desc: "Безопасный и интерпретируемый ИИ от Anthropic",
        url: "https://www.anthropic.com/",
        status: "paid"
    },
    {
        categories: ["Chat AI"],
        name: "Bard",
        logo: "https://example.com/bard-logo.png",
        desc: "ИИ от Google для генерации текста",
        url: "https://bard.google.com/",
        status: "free"
    },
    {
        categories: ["Обработка изображений", "Chat AI"],
        name: "DALL-E",
        logo: "https://example.com/dalle-logo.png",
        desc: "Генерация изображений из текста от OpenAI",
        url: "https://openai.com/dall-e-2/",
        status: "mixed"
    },
    {
        categories: ["Обработка изображений"],
        name: "Midjourney",
        logo: "https://example.com/midjourney-logo.png",
        desc: "Генерация изображений с помощью ИИ",
        url: "https://www.midjourney.com/",
        status: "paid"
    },
    {
        categories: ["Обработка изображений"],
        name: "Stable Diffusion",
        logo: "https://example.com/stable-diffusion-logo.png",
        desc: "Генерация изображений из текста с открытым кодом",
        url: "https://stability.ai/",
        status: "mixed"
    },
    {
        categories: ["Обработка текста", "Chat AI"],
        name: "BERT",
        logo: "https://example.com/bert-logo.png",
        desc: "Модель для обработки естественного языка от Google",
        url: "https://github.com/google-research/bert",
        status: "free"
    },
    {
        categories: ["Обработка текста"],
        name: "GPT-3",
        logo: "https://example.com/gpt3-logo.png",
        desc: "Модель генерации текста от OpenAI",
        url: "https://openai.com/",
        status: "paid"
    },
    {
        categories: ["Обработка изображений", "Chat AI"],
        name: "RunwayML",
        logo: "https://example.com/runwayml-logo.png",
        desc: "Инструмент для создания изображений и текста с ИИ",
        url: "https://runwayml.com/",
        status: "mixed"
    },
    {
        categories: ["Генерация музыки"],
        name: "Suno AI",
        logo: "https://example.com/suno-ai-logo.png",
        desc: "Генерация музыки по текстовым запросам",
        url: "https://suno.ai/",
        status: "mixed"
    },
    {
        categories: ["Генерация музыки"],
        name: "AIVA",
        logo: "https://example.com/aiva-logo.png",
        desc: "AI-композитор для создания музыки в разных жанрах",
        url: "https://www.aiva.ai/",
        status: "mixed"
    },
    {
        categories: ["Генерация музыки", "Обработка текста"],
        name: "MusicGen",
        logo: "https://example.com/musicgen-logo.png",
        desc: "Генерация музыки по текстовым описаниям от Meta",
        url: "https://huggingface.co/spaces/facebook/MusicGen",
        status: "free"
    },
    {
        categories: ["Дизайн", "Обработка изображений"],
        name: "Looka",
        logo: "https://example.com/looka-logo.png",
        desc: "Создание логотипов и фирменного стиля",
        url: "https://looka.com/",
        status: "paid"
    },
    {
        categories: ["Дизайн"],
        name: "Brandmark",
        logo: "https://example.com/brandmark-logo.png",
        desc: "Автоматизированное создание логотипов",
        url: "https://brandmark.io/",
        status: "mixed"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const categoryList = document.getElementById("category-list");
    const networkList = document.getElementById("networks");
    const selectedCategoryTitle = document.getElementById("selected-category");
    const searchInput = document.getElementById("search-input");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Загружаем данные из localStorage
    let categories = JSON.parse(localStorage.getItem("categories")) || defaultCategories;
    let networks = JSON.parse(localStorage.getItem("networks")) || defaultNetworks;
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("networks", JSON.stringify(networks));

    let currentFilter = "all";

    // Добавляем категории
    categories.forEach(category => {
        const btn = document.createElement("button");
        btn.className = "category-btn";
        btn.textContent = category.name;
        btn.setAttribute("data-desc", category.desc);
        btn.addEventListener("click", () => showNetworks(category.name));
        categoryList.appendChild(btn);
    });

    // Фильтры по статусу
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter");
            showNetworks(selectedCategoryTitle.textContent === "Все нейросети" ? null : selectedCategoryTitle.textContent);
        });
    });

    // Отображение нейросетей
    function showNetworks(category = null) {
        networkList.innerHTML = "";
        let filteredNetworks = networks;

        if (category && category !== "Все нейросети") {
            selectedCategoryTitle.textContent = category;
            filteredNetworks = networks.filter(net => net.categories.includes(category));
        } else {
            selectedCategoryTitle.textContent = "Все нейросети";
        }

        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredNetworks = filteredNetworks.filter(net =>
                net.name.toLowerCase().includes(searchTerm)
            );
            selectedCategoryTitle.textContent = searchTerm ? "Результаты поиска" : "Все нейросети";
        }

        if (currentFilter !== "all") {
            filteredNetworks = filteredNetworks.filter(net => net.status === currentFilter);
        }

        filteredNetworks.forEach(net => {
            const btn = document.createElement("a");
            btn.className = "network-btn";
            btn.href = net.url;
            btn.target = "_blank";
            btn.innerHTML = `
                <img src="${net.logo}" alt="${net.name} logo">
                <h3>${net.name}</h3>
                <span class="status-circle status-${net.status}"></span>
            `;
            btn.setAttribute("data-desc", net.desc);
            networkList.appendChild(btn);
        });
    }

    // Поиск в реальном времени
    searchInput.addEventListener("input", () => {
        showNetworks(selectedCategoryTitle.textContent === "Все нейросети" ? null : selectedCategoryTitle.textContent);
    });

    // Показываем все нейросети по умолчанию
    showNetworks();
});