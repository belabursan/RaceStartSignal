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
        }
        .container {
            display: flex;
            justify-content: space-between;
        }
        .form-section, .list-section {
            width: 45%;
        }
        .form-section input, .form-section button {
            display: block;
            margin: 10px 0;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="form-section">
            <h2>Add Item</h2>
            <label for="datetime">Date-Time:</label>
            <input type="datetime-local" id="datetime" name="datetime">
            <label>
                <input type="checkbox" id="one-minute" name="one-minute"> One minute
            </label>
            <label>
                <input type="checkbox" id="four-minutes" name="four-minutes"> Four minutes
            </label>
            <label>
                <input type="checkbox" id="five-minutes" name="five-minutes"> Five minutes
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
    </div>

    <script>
        document.getElementById('add-button').addEventListener('click', function() {
            const datetime = document.getElementById('datetime').value;
            if (!datetime) {
                alert('Please select a date-time.');
                return;
            }

            const itemList = document.getElementById('item-list');
            const row = document.createElement('tr');

            const dateTimeCell = document.createElement('td');
            dateTimeCell.textContent = datetime;
            row.appendChild(dateTimeCell);

            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                itemList.removeChild(row);
            });
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            itemList.appendChild(row);

            // Clear the form
            document.getElementById('datetime').value = '';
            document.getElementById('one-minute').checked = false;
            document.getElementById('four-minutes').checked = false;
            document.getElementById('five-minutes').checked = false;
        });
    </script>
</body>
</html>