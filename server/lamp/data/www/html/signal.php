<?php
// https://stackoverflow.com/questions/8683528/embed-image-in-a-button-element -->
session_start();
include_once "src/utils/site.php";

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
    if(isset($_SESSION['signal_error'])) {
        echo "<script>alert('". $_SESSION['signal_error'] . "');</script>";
        unset($_SESSION['signal_error']);
    }
}

if(isset($_POST['delete_pressed'])) {
    $group_id = intval($_POST['delete_pressed']);
    deleteSignal($group_id);
    unset($_POST['delete_pressed']);
    if(isset($_SESSION['signal_error'])) {
        echo "<script>alert('". $_SESSION['signal_error'] . "');</script>";
        unset($_SESSION['signal_error']);
    }
}
if(isLoggedIn() === false) {
    exit(header("Location: logout.php", true));
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type='text/css' href="src/css/signal.css">
    <title>Race Signal Manager</title>
    <script>
        function toggle(element){
            var i = element.id;
            var one = document.getElementById("subrow_"+i+"-1");
            var four = document.getElementById("subrow_"+i+"-4");
            var five = document.getElementById("subrow_"+i+"-5");
            
            if(element.src.search("arrow_down") > -1) {
                one.classList.remove('subrow');
                one.classList.add('subrow-visible');
                four.classList.remove('subrow');
                four.classList.add('subrow-visible');
                five.classList.remove('subrow');
                five.classList.add('subrow-visible');
                element.src = "src/images/arrow_up.png";
            } else {
                one.classList.remove('subrow-visible');
                one.classList.add('subrow');
                four.classList.remove('subrow-visible');
                four.classList.add('subrow');
                five.classList.remove('subrow-visible');
                five.classList.add('subrow');
                element.src = "src/images/arrow_down.png";
                
            }
        }
    </script>
</head>
<body>
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
        <h2>Item List</h2>
        <form method="POST">
            <table>
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
                                if(count($sorted) >1) {
                                    echo "    <td><img id=\"$group_id\" onclick=\"toggle(this);\" src=\"src/images/arrow_down.png\" width=\"20\" height=\"15\"/></td>\n";
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
                                $message= $e->getMessage();
                                echo "<script>alert('ERROR $code: $message');</script>";
                            }
                        }
                    ?>
                </tbody>
            </table>
        </form>
    </div>
</body>
</html>
