document.addEventListener("DOMContentLoaded", () => {
    const networkForm = document.getElementById("network-form");
    const categoryForm = document.getElementById("category-form");
    const networkList = document.getElementById("network-list-admin");
    const categorySelect = document.getElementById("network-categories");

    let networks = JSON.parse(localStorage.getItem("networks")) || [];
    let categories = JSON.parse(localStorage.getItem("categories")) || [
        { name: "Обработка изображений", desc: "Нейросети для работы с графикой" },
        { name: "Обработка текста", desc: "Нейросети для анализа текста" },
        { name: "Chat AI", desc: "Чат-боты на основе ИИ" },
        { name: "Генерация музыки", desc: "Нейросети для создания музыки" },
        { name: "Дизайн", desc: "Нейросети для создания дизайна и логотипов" }
    ];

    function updateCategories() {
        categorySelect.innerHTML = "";
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.name;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
        localStorage.setItem("categories", JSON.stringify(categories));
    }

    function updateCategoryList() {
        const categoryList = document.getElementById("category-list-admin");
        categoryList.innerHTML = "";

        categories.forEach((cat, index) => {
            const li = document.createElement("li");
            li.textContent = `${cat.name} — ${cat.desc}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Удалить";
            deleteBtn.className = "delete-btn";
            deleteBtn.addEventListener("click", () => {
                if (confirm(`Удалить категорию "${cat.name}"?`)) {
                    categories.splice(index, 1);
                    localStorage.setItem("categories", JSON.stringify(categories));
                    updateCategories();
                    updateCategoryList();
                }
            });

            li.appendChild(deleteBtn);
            categoryList.appendChild(li);
        });
    }

    function updateNetworkList() {
        networkList.innerHTML = "";
        networks.forEach((net, index) => {
            const li = document.createElement("li");
            li.textContent = `${net.name} (${net.categories.join(", ")}) - ${net.status}`;

            const editBtn = document.createElement("button");
            editBtn.textContent = "Редактировать";
            editBtn.className = "edit-btn";
            editBtn.addEventListener("click", () => editNetwork(index));

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Удалить";
            deleteBtn.className = "delete-btn";
            deleteBtn.addEventListener("click", () => {
                networks.splice(index, 1);
                localStorage.setItem("networks", JSON.stringify(networks));
                updateNetworkList();
            });

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            networkList.appendChild(li);
        });
    }

    function editNetwork(index) {
        const net = networks[index];
        document.getElementById("network-name").value = net.name;
        document.getElementById("network-desc").value = net.desc;
        document.getElementById("network-url").value = net.url;
        document.getElementById("network-status").value = net.status;

        const categoryOptions = Array.from(categorySelect.options);
        categoryOptions.forEach(option => {
            option.selected = net.categories.includes(option.value);
        });

        document.getElementById("edit-index").value = index;
        document.getElementById("network-logo").value = "";
    }

    networkForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("network-name").value;
        const desc = document.getElementById("network-desc").value;
        const url = document.getElementById("network-url").value;
        const status = document.getElementById("network-status").value;
        const categories = Array.from(document.getElementById("network-categories").selectedOptions).map(opt => opt.value);
        const editIndex = document.getElementById("edit-index").value;
        const logoInput = document.getElementById("network-logo");

        let logo = editIndex !== "-1" ? networks[editIndex].logo : "";

        if (logoInput.files && logoInput.files[0]) {
            const formData = new FormData();
            formData.append("logo", logoInput.files[0]);

            try {
                const response = await fetch("http://localhost:3000/upload-logo", {
                    method: "POST",
                    body: formData
                });
                const result = await response.json();
                logo = result.url;
            } catch (error) {
                console.error("Ошибка загрузки логотипа:", error);
                return;
            }
        }

        saveNetwork(name, desc, url, status, categories, logo, editIndex);
    });

    function saveNetwork(name, desc, url, status, categories, logo, editIndex) {
        const newNetwork = { categories, name, logo, desc, url, status };
        if (editIndex === "-1") {
            networks.push(newNetwork);
        } else {
            networks[editIndex] = newNetwork;
        }
        localStorage.setItem("networks", JSON.stringify(networks));
        updateNetworkList();
        networkForm.reset();
        document.getElementById("edit-index").value = "-1";
    }

    categoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("category-name").value;
        const desc = document.getElementById("category-desc").value;

        if (categories.some(cat => cat.name === name)) {
            alert("Категория с таким названием уже существует!");
            return;
        }

        categories.push({ name, desc });
        localStorage.setItem("categories", JSON.stringify(categories));
        updateCategories();
        updateCategoryList();
        categoryForm.reset();
    });

    updateCategories();
    updateNetworkList();
    updateCategoryList();
});
