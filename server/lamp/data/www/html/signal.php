<?php
include_once "src/utils/site.php";
s_start();

if(isLoggedIn() === false) {
    $host = $_SERVER['HTTP_HOST'];
    //exit(header("Location: https://$host/index.php", true));
    exit(header("Location: logout.php", true));
}

if (isset($_POST['add_signal'])) {
    $datetime = "".$_POST['date']." ".$_POST['time'].":00";
    $five_min_serie = isset($_POST['fiveminserie']) ? false : true;
    addSignal($datetime, $five_min_serie);
    unset($_POST['add_signal']);
}

if(isset($_POST['delete_pressed'])) {
    $group_id = intval($_POST['delete_pressed']);
    deleteSignal($group_id);
    unset($_POST['delete_pressed']);
}
s_stop();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow" />
    <link rel="stylesheet" type='text/css' href="src/css/signal.css">
    <script src="src/scripts/site.js"></script>
    <title>Race Signal Manager</title>

</head>
<body onload="fadeOut('error-monitor');">
    <div class="header">
        <h1>Race Signal Manager</h1>
        <a href="logout.php">Logout</a>
    </div>
    <div class="add_form_section">
        <h2>Add Signal</h2>
        <form method="POST">
            <label for="date">Date:</label>
            <input id="date"
                type="date-local"
                name="date"
                min="2025-03-20"
                max="2095-05-20"
                value="2025-01-18"
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
        <h2>Signal List</h2>
        <form method="POST">
            <table>
                <colgroup>
                    <col span="1" style="width: 6%;">
                    <col span="1" style="width: 37%;">
                    <col span="1" style="width: 37%;">
                    <col span="1" style="width: 20%;">
                </colgroup>
                <thead>
                    <tr>
                        <th></th>
                        <th>Date-Time</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <?php
                        try {
                            s_start();
                            $list = site_get_signal_list();
                            foreach ($list as $group_id => $signalGroup) {
                                // Set Start signal first
                                $sorted = sortSignalGroup($signalGroup);
                                echo "<!--       Start Signal       -->\n";
                                echo "<tr class=\"startsignal\">\n";
                                if(count($sorted) >1) {
                                    echo "    <td class=\"img-col\" ><img id=\"$group_id\" onmouseover=\"hoverIn(this);\" onmouseleave=\"hoverOut(this);\" onclick=\"toggle(this);\" src=\"src/images/expand.png\" width=\"16\" height=\"16\"/></td>\n";
                                } else {
                                    echo "    <td></td>\n";
                                }
                                echo "    <td>$sorted[0]</td>\n";
                                echo "    <td>Start Signal</td>\n";
                                echo "    <td><button class=\"list_button\" type=\"submit\" name=\"delete_pressed\" value=\"$group_id\">Delete</button></td>\n";
                                echo "</tr>\n";
                                if(count($sorted) >1) {
                                    $i = [1,4,5];
                                    foreach ($i as $index) {
                                        $date = $sorted[$index];
                                        $type = "One Minute Signal";
                                        if($index === 4) {
                                            $type = "Four Minute Signal";
                                        } else if($index === 5) {
                                            $type = "Five Minute Signal";
                                        }

                                        echo "<tr id=\"subrow_$group_id-$index\" class=\"subrow\">\n";
                                        echo "    <td></td>\n";
                                        echo "    <td class=\"sub-td\">$date</td>\n";
                                        echo "    <td class=\"sub-td\">$type</td>\n";
                                        echo "    <td></td>\n";
                                        echo "</tr>\n";
                                    }
                                }
                            }
                        } catch (Exception $e) {
                            $code= $e->getCode();
                            if($code === 401) { //unauthorized
                                logout();
                                // todo fix redirect
                            } else {
                                $_SESSION['signal_error'] = $e->getMessage();
                            }
                        } finally {
                            s_stop();
                        }
                    ?>
                </tbody>
            </table>
        </form>
    </div>
    <?php
    s_start();
    if(isset($_SESSION['signal_error']) === true) {
        printError($_SESSION['signal_error']);
        unset($_SESSION['signal_error']);
    }
    printFooter();
    s_stop();
    ?>
</body>
</html>
<?php
s_start();
if(isLoggedIn() === false) {
    $host = $_SERVER['HTTP_HOST'];
    //exit(header("Location: https://$host/index.php", true));
    exit(header("Location: logout.php", true));
}
s_stop();
?>
