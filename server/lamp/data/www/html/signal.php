<?php
session_start();
include_once "src/utils/site.php";

if(isLoggedIn() === false) {
    $host = $_SERVER['HTTP_HOST'];
    exit(header("Location: https://$host/index.php", true));
}

if (isset($_POST['add_signal'])) {
    $datetime = "".$_POST['date']." ".$_POST['time'].":00";
    $five_min_serie = isset($_POST['fiveminserie']) ? false : true;
    addSignal($datetime, $five_min_serie);
    unset($_POST['add_signal']);
    if(isset($_SESSION['signal_error'])) {
        echo "<script>alert('". $_SESSION['signal_error'] . "');</script>";
        unset($_SESSION['signal_error']);
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type='text/css' href="src/css/signal.css">
    <title>Signal Manager</title>
</head>
<body>
    <div class="header">
        <h1>Signal Manager</h1>
        <a href="logout.php">Logout</a>
    </div>
    <div class="form-section">
        <h2>Add Signal</h2>
        <form method="POST">
            <label for="date">Date:</label>
            <input id="date"
                type="date-local"
                name="date"
                min="2025-03-20"
                max="2095-05-20"
                value="2025-10-18"
                required
            />
            <label for="time">Time:</label>
            <input id="time"
                type="time-local"
                name="time"
                min="08:00"
                max="20:00"
                value="19:00"
                required
            />
            <div class="tooltip">
                <label for="fiveminserie">Simple:</label>
                <input type="checkbox" id="fiveminserie" name="fiveminserie" />
                <span class="tooltiptext">Check if you only want to set one signal. No One/Four and Five minutes signals will be set.</span>
            </div>
            <br><button id="add-button" type="submit" name="add_signal">Add</button>
        </form>
    </div>
    <div class="list-section">
        <h2>Item List</h2>
        <table>
            <thead>
                <tr>
                    <th>Date-Time</th>
                    <th>Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="item-list">
                <!-- Items will be added here dynamically -->
                <?php
                    try {
                        $list = site_get_signal_list();
                        foreach ($list as $group_id => $signals) {
                            foreach ($signals as $signal) {
                                echo "<tr>\n";
                                echo "  <td>".$signal['date_time']."</td>\n";
                                echo "  <td>".$signal['signal_type']."</td>\n";
                                if ($signal['signal_type'] === 0) {
                                    echo "  <td><button name=\"$group_id\" >Delete</button></td>\n";
                                } else {
                                    echo "  <td></td>\n";       
                                }
                                echo "</tr>\n";
                            }
                        }
                    } catch (Exception $e) {
                        $_SESSION['signal_error'] = $e->getMessage();
                        $_SESSION['signal_error_code'] = $e->getCode();
                    }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>
<!--
<tr>
    <td>2025-05-01 19:00</td>
    <td>Start Signal</td>
    <td><button>Delete</button></td>
</tr>
<tr class="subrow">
    <td>22025-05-01 18:59</td>
    <td>One Minute Signal</td>
    <td></td>
</tr>
<tr class="subrow">
    <td>22025-05-01 16:56</td>
    <td>Four Minute Signal</td>
    <td></td>
</tr>
<tr class="subrow">
    <td>22025-05-01 18:55</td>
    <td>Five Minute Signal</td>
    <td></td>
</tr>
-->