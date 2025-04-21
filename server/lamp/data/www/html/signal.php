<?php
if(!isset($_SESSION)) 
    { 
        session_start(); 
    } 
include_once "src/utils/site.php";


if(isLoggedIn() === false) {
    $host = $_SERVER['HTTP_HOST'];
    //exit(header("Location: https://$host/index.php", true));
    exit(header("Location: logout.php", true));
}

if (isset($_POST['add_signal'])) {
    $startime = $_POST['time'];
    if(strlen($startime) < 5) {
        $startime = $startime.":00";
        printf("WWWWROOOONGGG TIME");
    }
    $datetime = "".$_POST['date']." ".$startime;
    $five_min_serie = isset($_POST['fiveminserie']) ? false : true;
    $yellow_flag = isset($_POST['yellowflag']) ? true : false;
    addSignal($datetime, $five_min_serie, $yellow_flag);
    unset($_POST['add_signal']);
}

if(isset($_POST['delete_pressed'])) {
    $group_id = intval($_POST['delete_pressed']);
    deleteSignal($group_id);
    unset($_POST['delete_pressed']);
}

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
                type="date"
                name="date"
                min=<?php echo(date('Y-m-d')); ?>
                max="2095-05-20"
                value=<?php echo(date('Y-m-d')); ?>
                required
            />
            <label for="time">Time:</label>
            <input id="time"
                type="time"
                name="time"
                min="08:00:00"
                max="19:59:00"
                value="19:00:00"
                step="1"
                required
            />
            <label for="yellowflag">Yellow Flag:</label>
            <input type="checkbox" id="yellowflag" name="yellowflag" />
            <div class="tooltip">
                <label for="fiveminserie">Simple:</label>
                <input type="checkbox" id="fiveminserie" name="fiveminserie" onclick="uncheckYellow(this);"/>
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
                            $list = site_get_signal_list();
                            foreach ($list as $group_id => $signalGroup) {
                                // Set Start signal first
                                $sorted = sortSignalGroup($signalGroup);
                                echo "<!--       Start Signal       -->\n";
                                echo "<tr class=\"startsignal\">\n";
                                if(count($sorted) > 1) {
                                    echo "    <td class=\"img-col\" ><img id=\"$group_id\" onmouseover=\"hoverIn(this);\" onmouseleave=\"hoverOut(this);\" onclick=\"toggle(this);\" src=\"src/images/expand.png\" width=\"16\" height=\"16\"/></td>\n";
                                } else {
                                    echo "    <td></td>\n";
                                }
                                echo "    <td>$sorted[0]</td>\n";
                                echo "    <td>Start Signal</td>\n";
                                echo "    <td><button class=\"list_button\" type=\"submit\" name=\"delete_pressed\" value=\"$group_id\">Delete</button></td>\n";
                                echo "</tr>\n";
                                if(count($sorted) >1) {
                                    $i = [1,4,5,15];
                                    foreach ($i as $index) {
                                        if(array_key_exists($index, $sorted)) {
                                            $date = $sorted[$index];
                                            $type = "One Minute Signal";
                                            if($index === 4) {
                                                $type = "Four Minute Signal";
                                            } else if($index === 5) {
                                                $type = "Five Minute Signal";
                                            } else if($index === 15) {
                                                $type = "Yellow Flag";
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
                            }
                        } catch (Exception $e) {
                            $code= $e->getCode();
                            if($code === 401) { //unauthorized
                                logout();
                                // todo fix redirect
                            } else {
                                $_SESSION['signal_error'] = $e->getMessage();
                            }
                        }
                    ?>
                </tbody>
            </table>
        </form>
    </div>
    <?php
    if(isset($_SESSION['signal_error']) === true) {
        printError($_SESSION['signal_error']);
        unset($_SESSION['signal_error']);
    }
    printFooter();
    ?>
</body>
</html>
