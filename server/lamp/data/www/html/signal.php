<?php
session_start();
include_once "src/utils/site.php";
if(isLoggedIn() === false) {
    $host = $_SERVER['HTTP_HOST'];
    exit(header("Location: https://$host/index.php", true));
}


if (isset($_POST['add_signal'])) {
    var_dump($_POST);
    $d = isset($_POST['datetime']) ? $_POST['datetime'] : "1800-01-01T19:00";
    $datetime =  $d !== "" ? $d : "1900-01-01T19:00";
    $one_minute = isset($_POST['one-minute']) ? 'true' : 'false';
    $four_minutes = isset($_POST['four-minutes']) ? 'true' : 'false';
    $five_minutes = isset($_POST['five-minutes']) ? 'true' : 'false';
    addSignal($datetime, $one_minute, $four_minutes, $five_minutes);
}

?>
<!DOCTYPE html>
<html lang="en">
<!-- https://www.shareicon.net/big-mug-line-up-arrow-symbol-angle-symbols-arrows-up-arrows-arrow-683097 -->
 <!-- https://stackoverflow.com/questions/3490216/html-css-adding-an-icon-to-a-button -->
 <!-- https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp -->
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type='text/css' href="src/css/signal.css">
    <title>Signal Manager</title>
</head>
<body>
    <div class="header">
        <h1>Signal Manager</h1>
        <a href="logout.php">Logout</a> <!-- https://www.w3schools.com/howto/howto_css_logout_button.asp -->
    </div>
    <div class="form-section">
        <h2>Add Signal</h2>
        <form action="signal.php" method="POST">
            <label for="datetime">Date-Time:</label>
            <input type="date-local" id="datetime" name="datetime" />
            <!-- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local -->
            <label>
                <input type="checkbox" id="one-minute" name="one-minute" checked /> One minute
            </label>
            <label>
                <input type="checkbox" id="four-minutes" name="four-minutes" checked /> Four minutes
            </label>
            <label>
                <input type="checkbox" id="five-minutes" name="five-minutes" checked /> Five minutes
            </label>
            <button id="add-button" type="submit" name="add_signal">Add</button>
        </form>
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
                <?php getList(); ?>
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
