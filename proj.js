function initializeStorage() {
    if (!localStorage.getItem("expenses")) {
        localStorage.setItem("expenses", JSON.stringify([]));
    }
}

function formatCurrency(amount) {
    return "KES " + amount.toLocaleString("en-KE");
}

function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses")) || [];
}

function saveExpenses(expenses) {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}


function initializeAddPage() {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const title = document.querySelector("#title").value.trim();
        const amount = parseFloat(document.querySelector("#amount").value);
        const category = document.querySelector("#category").value;
        const customCategory = document.querySelector("#customCategory").value.trim();
        const date = document.querySelector("#date").value;

        const finalCategory =
            category === "Other" && customCategory !== ""
                ? customCategory
                : category;

        if (!title || !amount || amount <= 0 || !finalCategory || !date) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const newExpense = {
            id: Date.now(),
            title,
            amount,
            category: finalCategory,
            date
        };

        const expenses = getExpenses();
        expenses.push(newExpense);
        saveExpenses(expenses);

        window.location.href = "index.html";
    });
}


function initializeDashboard() {
    const expenseList = document.getElementById("expenseList");
    const totalAmountElement = document.getElementById("totalAmount");

    if (!expenseList || !totalAmountElement) return;

    const expenses = getExpenses();

    expenseList.innerHTML = "";

    if (expenses.length === 0) {
        expenseList.innerHTML = "<p>No expenses added yet.</p>";
        totalAmountElement.textContent = "0";
        return;
    }

    let total = 0;

    expenses.forEach(expense => {
        total += expense.amount;

        const card = document.createElement("div");

        card.innerHTML = `
            <h3>${expense.title}</h3>
             <p>Amount: ${formatCurrency(expense.amount)}</p>
            <p>Category: ${expense.category}</p>
            <p>Date: ${expense.date}</p>
            <button data-id="${expense.id}">Delete</button>
        `;

        expenseList.appendChild(card);
    });

   totalAmountElement.textContent = formatCurrency(total);

    attachDeleteListeners();
}

function attachDeleteListeners() {
    const buttons = document.querySelectorAll("button[data-id]");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const id = Number(this.getAttribute("data-id"));
            deleteExpense(id);
        });
    });
}

function deleteExpense(id) {
    let expenses = getExpenses();
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses(expenses);
    initializeDashboard();
}


function initializeReports() {
    const totalAmountElement = document.getElementById("reportTotalAmount");
    const totalTransactionsElement = document.getElementById("reportTotalTransactions");
    const categoryBreakdown = document.getElementById("categoryBreakdown");

    if (!totalAmountElement || !totalTransactionsElement || !categoryBreakdown) return;

    const expenses = getExpenses();

    if (expenses.length === 0) {
        totalAmountElement.textContent = "0";
        totalTransactionsElement.textContent = "0";
        categoryBreakdown.innerHTML = "<p>No expenses to analyze.</p>";
        return;
    }

    let totalAmount = 0;

    expenses.forEach(expense => {
        totalAmount += expense.amount;
    });

    totalAmountElement.textContent = formatCurrency(totalAmount);
    totalTransactionsElement.textContent = expenses.length;

    const categoryTotals = {};

    expenses.forEach(expense => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += expense.amount;
    });

    categoryBreakdown.innerHTML = "";

    for (let category in categoryTotals) {
        const div = document.createElement("div");
        div.innerHTML = `
            <p><strong>${category}</strong>: ${formatCurrency(categoryTotals[category])}</p>

        `;
        categoryBreakdown.appendChild(div);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    initializeStorage();

    if (document.getElementById("expenseList")) {
        initializeDashboard();
    }

    if (document.querySelector("form")) {
        initializeAddPage();
    }

    if (document.getElementById("categoryBreakdown")) {
        initializeReports();
    }
});