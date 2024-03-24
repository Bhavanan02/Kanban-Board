document.addEventListener('DOMContentLoaded', function () {
    const columns = document.querySelectorAll('.column');
    const addTaskButtons = document.querySelectorAll('.add-task-btn');

    let draggedCard = null;

    // Load board state from local storage
    loadBoardState();

    // Add click event listeners to add task buttons
    addTaskButtons.forEach(button => {
        button.addEventListener('click', addNewTask);
    });

    // Add drag and drop event listeners to columns
    columns.forEach(column => {
        column.addEventListener('dragover', dragOver);
        column.addEventListener('drop', drop);
    });

    function dragOver(e) {
        e.preventDefault();
    }

    function drop() {
        this.appendChild(draggedCard);
        saveBoardState(); // Save board state after dropping a card
    }

    function addNewTask() {
        const column = this.closest('.column');
        const newTaskText = prompt('Enter task for new card:');
        if (newTaskText) {
            const newCard = createCard(newTaskText);
            column.appendChild(newCard);
            saveBoardState(); // Save board state after adding a new card
        }
    }

    function createCard(text) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.draggable = true;
        card.textContent = text;
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragend', dragEnd);
        return card;
    }

    function dragStart() {
        draggedCard = this;
        setTimeout(() => this.style.display = 'none', 0);
    }

    function dragEnd() {
        draggedCard.style.display = 'block';
        draggedCard = null;
        saveBoardState(); // Save board state after dragging ends
    }

    function saveBoardState() {
        const boardState = {};
        columns.forEach(column => {
            const cards = Array.from(column.querySelectorAll('.card')).map(card => card.textContent);
            boardState[column.id] = cards;
        });
        localStorage.setItem('kanban-board-state', JSON.stringify(boardState));
    }

    function loadBoardState() {
        const savedState = localStorage.getItem('kanban-board-state');
        if (savedState) {
            const boardState = JSON.parse(savedState);
            Object.keys(boardState).forEach(columnId => {
                const column = document.getElementById(columnId);
                if (column) {
                    boardState[columnId].forEach(text => {
                        const card = createCard(text);
                        column.appendChild(card);
                    });
                }
            });
        }
    }
});
