document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const addLoginForm = document.getElementById("add-login-form");
  const loginSection = document.getElementById("login-section");
  const adminSection = document.getElementById("admin-section");
  const loginList = document.getElementById("login-list");
  const logoutBtn = document.getElementById("logout-btn");

  // Основной админский логин и пароль
  const mainAdminEmail = "am01102005mo@gmail.com";
  const mainAdminPassword = "@AmonovM2005";

  // Загружаем список логинов из localStorage
  let logins = JSON.parse(localStorage.getItem("logins")) || [
      { email: mainAdminEmail, password: mainAdminPassword }
  ];

  // Обновляем список логинов
  function updateLoginList() {
      loginList.innerHTML = "";
      logins.forEach((login, index) => {
          if (login.email === mainAdminEmail) return; // Скрываем основной логин
          const li = document.createElement("li");
          li.textContent = `${login.email}`;
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Удалить";
          deleteBtn.className = "delete-btn";
          deleteBtn.addEventListener("click", () => {
              logins.splice(index, 1);
              localStorage.setItem("logins", JSON.stringify(logins));
              updateLoginList();
          });
          li.appendChild(deleteBtn);
          loginList.appendChild(li);
      });
  }

  // Вход
  loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const user = logins.find(l => l.email === email && l.password === password);
      if (user) {
          if (email === mainAdminEmail) {
              // Только основной админ видит управление логинами
              loginSection.style.display = "none";
              adminSection.style.display = "block";
              updateLoginList();
          } else {
              // Другие пользователи сразу переходят в админ-панель
              window.location.href = "admin.html";
          }
      } else {
          alert("Неверный email или пароль!");
      }
  });

  // Добавление нового логина
  addLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newEmail = document.getElementById("new-email").value;
      const newPassword = document.getElementById("new-password").value;

      if (logins.some(l => l.email === newEmail)) {
          alert("Этот email уже используется!");
          return;
      }

      logins.push({ email: newEmail, password: newPassword });
      localStorage.setItem("logins", JSON.stringify(logins));
      updateLoginList();
      addLoginForm.reset();
  });

  // Выход
  logoutBtn.addEventListener("click", () => {
      loginSection.style.display = "block";
      adminSection.style.display = "none";
      loginForm.reset();
  });
});