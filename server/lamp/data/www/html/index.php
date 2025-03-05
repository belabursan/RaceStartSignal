<?php
include_once "src/helper/site.php";
redirectTohttps();

?><!DOCTYPE html>

<html>
    <head>
        <?php
            printHeadContent("index", false);
            addCssLink("src/css/index.css", true);
        ?>
    </head>
    <body>
        <main class="index_main">
            <div class="welcome">
                <div class="index_title"><h1>V&auml;lkommen till b&aring;tlaget <span class="myc2">MYC2</span></h1></div>
                <br><br>
                <div class="index_text">
                    H&auml;r kan du bl.a. hitta vilka veckor som du och andra f&ouml;rfogar &ouml;ver b&aring;ten, byta veckor, hitta information om b&aring;ten och Grekland.
                </div>
            </div>
            <div class="login_container">
                <form role="form" action="src/login.php" method="post">
                    <button type="submit" name="login" class="button login_button">Logga In</button>
                </form>
            </div>
        </main>
        <?php printFooter(); ?>
    </body>
</html>
