<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Item Manager</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .form-section {
            width: 50%;
            text-align: center;
            margin-bottom: 20px;
        }
        .form-section input, .form-section button {
            display: block;
            margin: 10px auto;
        }
        .list-section {
            width: 80%;
        }
        .list-section table {
            width: 100%;
            border-collapse: collapse;
        }
        .list-section th, .list-section td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .list-section th {
            background-color: #f2f2f2;
        }
        .subrow td {
            padding-left: 40px; /* Add padding to the left of subitems */
        }
        .subrow {
            display: none; /* Ensure subitems are not visible when unexpanded */
        }
    </style>
</head>
<body>
    <div class="form-section">
        <h2>Add Signal</h2>
        <label for="datetime">Date-Time:</label>
        <input type="datetime-local" id="datetime" name="datetime">
        <label>
            <input type="checkbox" id="one-minute" name="one-minute" checked> One minute
        </label>
        <label>
            <input type="checkbox" id="four-minutes" name="four-minutes" checked> Four minutes
        </label>
        <label>
            <input type="checkbox" id="five-minutes" name="five-minutes" checked> Five minutes
        </label>
        <button id="add-button">Add</button>
    </div>
    <div class="list-section">
        <h2>Item List</h2>
        <table>
            <thead>
                <tr>
                    <th>Date-Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="item-list">
                <!-- Items will be added here dynamically -->
            </tbody>
        </table>
    </div>

    <script>
        document.getElementById('add-button').addEventListener('click', function() {
            const datetime = document.getElementById('datetime').value;
            if (!datetime) {
                alert('Please select a date-time.');
                return;
            }

            const checkboxes = [
                { id: 'one-minute', label: 'One minute' },
                { id: 'four-minutes', label: 'Four minutes' },
                { id: 'five-minutes', label: 'Five minutes' }
            ];

            const selectedCheckboxes = checkboxes.filter(checkbox => document.getElementById(checkbox.id).checked);

            const itemList = document.getElementById('item-list');
            const row = document.createElement('tr');

            const dateTimeCell = document.createElement('td');
            const expandButton = document.createElement('button');
            expandButton.textContent = 'Expand';
            expandButton.addEventListener('click', function() {
                const isExpanded = subrows.some(subrow => subrow.style.display === 'table-row');
                subrows.forEach(subrow => subrow.style.display = isExpanded ? 'none' : 'table-row');
                expandButton.textContent = isExpanded ? 'Expand' : 'Un-expand';
            });
            dateTimeCell.appendChild(expandButton);
            dateTimeCell.appendChild(document.createTextNode(' ' + datetime));
            row.appendChild(dateTimeCell);

            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                itemList.removeChild(row);
                subrows.forEach(subrow => itemList.removeChild(subrow));
            });
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            itemList.appendChild(row);

            const subrows = selectedCheckboxes.map(checkbox => {
                const subrow = document.createElement('tr');
                subrow.classList.add('subrow');

                const subrowCell = document.createElement('td');
                subrowCell.textContent = checkbox.label;
                subrow.appendChild(subrowCell);

                const subrowActionsCell = document.createElement('td');
                const subrowDeleteButton = document.createElement('button');
                subrowDeleteButton.textContent = 'Delete';
                subrowDeleteButton.addEventListener('click', function() {
                    itemList.removeChild(subrow);
                });
                subrowActionsCell.appendChild(subrowDeleteButton);
                subrow.appendChild(subrowActionsCell);

                itemList.appendChild(subrow);
                return subrow;
            });

            // Clear the form
            document.getElementById('datetime').value = '';
            document.getElementById('one-minute').checked = true;
            document.getElementById('four-minutes').checked = true;
            document.getElementById('five-minutes').checked = true;
        });
    </script>
</body>
</html>
