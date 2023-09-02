const cardTypes = [
    "行动卡",
    "魔法卡",
    "行动魔法卡",
    "武器卡",
    "附着魔法卡",
    "持续魔法卡",
    "反制卡"
];

const cardContainer = document.getElementById("card-container");
const addCardButton = document.getElementById("add-card");
const exportButton = document.getElementById("export");
const importButton = document.getElementById("import");
const fileInput = document.getElementById("file-input");

let decks = {};

addCardButton.addEventListener("click", () => {
    createCard();
});

exportButton.addEventListener("click", () => {
    exportDeck();
});

importButton.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {
    importDeck(e.target.files[0]);
});

function createCard(name = "", type = cardTypes[0], description = "") {
    const card = document.createElement("div");
    card.className = "card";

    const nameInput = document.createElement("input");
    nameInput.value = name;
    card.appendChild(nameInput);

    const typeSelect = document.createElement("select");
    cardTypes.forEach((cardType) => {
        const option = document.createElement("option");
        option.value = cardType;
        option.textContent = cardType;
        if (cardType === type) {
            option.selected = true;
        }
        typeSelect.appendChild(option);
    });
    card.appendChild(typeSelect);

    // 修改为 textarea，并设置默认显示4行字
    const descriptionInput = document.createElement("textarea");
    descriptionInput.value = description;
    descriptionInput.rows = 4;
    card.appendChild(descriptionInput);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "删除";
    deleteButton.addEventListener("click", () => {
        // 添加删除确认信息
        if (confirm("确定要删除这张卡片吗？")) {
            cardContainer.removeChild(card);
        }
    });
    card.appendChild(deleteButton);

    cardContainer.appendChild(card);
}
function exportDeck() {
    const cards = Array.from(cardContainer.children).map((card) => {
        const inputs = card.getElementsByTagName("input");
        const select = card.getElementsByTagName("select")[0];
        return {
            name: inputs[0].value,
            type: select.value,
            description: inputs[1].value
        };
    });

    const json = JSON.stringify(cards);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "deck.json";
    link.click();
}

function saveDeck(deckName) {
    const cards = Array.from(cardContainer.children).map((card) => {
        return {
            name: card.querySelector("input").value,
            type: card.querySelector("select").value,
            description: card.querySelector("textarea").value,
        };
    });

    decks[deckName] = cards;
    localStorage.setItem("decks", JSON.stringify(decks));
}

let current_deck_name = "";

function loadDeck(deckName) {
    current_deck_name = deckName;
    cardContainer.innerHTML = "";
    if (decks[deckName]) {
        decks[deckName].forEach((card) => {
            createCard(card.name, card.type, card.description);
        });
    }
}

/*
function importDeck(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const cards = JSON.parse(e.target.result);
        cardContainer.innerHTML = "";
        cards.forEach((card) => {
            createCard(card.name, card.type, card.description);
        });
    };
    reader.readAsText(file);
}*/

/*
// Save deck to localStorage on window unload
window.addEventListener("beforeunload", () => {
    const cards = Array.from(cardContainer.children).map((card) => {
        const inputs = card.getElementsByTagName("input");
        const select = card.getElementsByTagName("select");
        return {
            name: inputs.value,
            type: select.value,
            description: inputs.value
        };
    });

    const json = JSON.stringify(cards);
    localStorage.setItem("deck", json);
});*/

const deckSelect = document.getElementById("select-deck");
deckSelect.addEventListener("change", () => {
    saveDeck(current_deck_name);
    loadDeck(deckSelect.value);
});

const saveButton = document.getElementById("save-deck");
saveButton.addEventListener("click", () => {
    const deckName = prompt("请输入卡组名称：");
    if (deckName) {
        saveDeck(deckName);
        updateDeckSelect();
    }
});

const loadButton = document.createElement("button");
loadButton.textContent = "加载";
loadButton.addEventListener("click", () => {
    loadDeck(deckSelect.value);
});


function updateDeckSelect() {
    deckSelect.innerHTML = "";
    for (const deckName in decks) {
        const option = document.createElement("option");
        option.value = deckName;
        option.textContent = deckName;
        deckSelect.appendChild(option);
    }
}


const storedDecks = localStorage.getItem("decks");
if (storedDecks) {
    decks = JSON.parse(storedDecks);
    updateDeckSelect();
}
