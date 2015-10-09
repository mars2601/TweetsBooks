<?php
//start session
session_start();

// Include config file and twitter PHP Library by Abraham Williams (abraham@abrah.am)
include_once("config.php");
include_once("inc/twitteroauth.php");
?>
<!doctype html>
<html lang="
">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Document</title>

    <link rel="stylesheet" href="./library/assets/css/main.light.css?ver=123"/>

</head>
<body class="mainPage">

<?php
if(isset($_SESSION['status']) && $_SESSION['status'] == 'verified'):

    //Retrive variables
    $screen_name 		= $_SESSION['request_vars']['screen_name'];
    $twitter_id			= $_SESSION['request_vars']['user_id'];
    $oauth_token 		= $_SESSION['request_vars']['oauth_token'];
    $oauth_token_secret = $_SESSION['request_vars']['oauth_token_secret'];

    require_once('twitterAPIExchange.php');


    $settings = array(
        'oauth_access_token' => $oauth_token,
        'oauth_access_token_secret' => $oauth_token_secret,
        'consumer_key' => CONSUMER_KEY,
        'consumer_secret' => CONSUMER_SECRET
    );

    $url = 'https://api.twitter.com/1.1/users/show.json';
    // The request method, according to the docs, is GET, not POST
    $requestMethod = 'GET';

    // Set up your get string, we're using my screen name here
    $getfield = '?screen_name='.$screen_name;

    // Create the object
    $twitter = new TwitterAPIExchange($settings);

    // Make the request and get the response into the $json variable
    $json =  $twitter->setGetfield($getfield)
        ->buildOauth($url, $requestMethod)
        ->performRequest();

    // It's json, so decode it into an array
    $result = json_decode($json);


    //Show welcome message
    echo '<div class="welcome_txt">Welcome <strong>'.$screen_name.'</strong> (Twitter ID : '.$twitter_id.'). <a href="logout.php?logout">Logout</a>!</div>';
    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $oauth_token, $oauth_token_secret);

    //If user wants to tweet using form.
    /*if(isset($_POST["updateme"]))
    {
        //Post text to twitter
        $my_update = $connection->post('statuses/update', array('status' => $_POST["updateme"]));
        die('<script type="text/javascript">window.top.location="index.php"</script>'); //redirect back to index.php
    }

    //show tweet form
    echo '<div class="tweet_box">';
    echo '<form method="post" action="index.php"><table width="200" border="0" cellpadding="3">';
    echo '<tr>';
    echo '<td><textarea name="updateme" cols="60" rows="4"></textarea></td>';
    echo '</tr>';
    echo '<tr>';
    echo '<td><input type="submit" value="Tweet" /></td>';
    echo '</tr></table></form>';
    echo '</div>';*/

    //Get latest tweets
    $my_tweets = $connection->get('statuses/user_timeline', array('screen_name' => $screen_name, 'count' => 5));

    /*echo '<div class="tweet_list"><strong>Latest Tweets : </strong>';
    echo '<ul>';
    foreach ($my_tweets  as $my_tweet) {
        echo '<li>'.$my_tweet->text.' <br />-<i>'.$my_tweet->created_at.'</i></li>';
    }
    echo '</ul></div>';*/

    ?>

    <header class="header">
        <div class="container">
            <div class="header__user">
                <img class="header__user__img" src="<?= $result->profile_image_url; ?>" alt="<?= $screen_name; ?> profile image"/>
                <h2 class="header__user__name">@<?= $screen_name; ?></h2>
            </div>
            <div class="header__logo">
                <h1 class="header__logo__title">
                    <a class="header__logo__link" href="">
                        TweetsBook<span class="header__logo__link--blue">.</span>
                    </a>
                </h1>

            </div>
        </div>
    </header>
    <main class="main">
        <nav class="main__filter">
            <h1 class="main__filter__title hidden">Tweet filter</h1>
            <button title="List all tweets" class="main__filter__button main__filter__button--all current">All filter</button>
            <button title="List the not readed tweets" class="main__filter__button main__filter__button--notreaded">Not readed</button>
            <button title="List the readed tweets" class="main__filter__button main__filter__button--readed">Readed</button>
            <button title="List the favorite tweets" class="main__filter__button main__filter__button--favorite">Favorite</button>
        </nav>
        <div class="container">
            <section class="main__parts">
                <div id="notreaded" class="main__list">
                    <ul id="notreaded-content" class="tweets-list">
                        <h1 class="main__list__title main__list__title--notreaded">All <span class="main__list__title--thin">tweets</span></h1>
                        <?php foreach ($my_tweets  as $my_tweet): ?>
                            <!--                        --><?php /*print_r($my_tweet); */?>
                            <?= $my_tweet->entities->media_url; ?>
                            <!--                        --><?/*= var_dump($my_tweet->entities->hashtags); */?>
                            <!--                        --><?/*= $my_tweet->description->urls->profile_background_image_url; */?>
                            <li class="tweets-list__item">
                                <article class="tweets-list__item__art">
                                    <date class="tweets-list__item__date"><?= date('l j F Y', strtotime($my_tweet->created_at)); ?></date>
                                    <div class="param">
                                        <p class="hidden tweet_id"><?= $my_tweet->id_str; ?></p>
                                        <button title="Add to readed" class="param__item param__item--readed"></button>
                                        <button title="Add to favorite" class="param__item param__item--favorite"></button>
                                    </div>
                                    <h1 class="tweets-list__item__title"><?= $my_tweet->text; ?>
                                        <!--<span class="tweets-list__item__title--hashtag">
                                        <?php /*foreach ($my_tweet->entities->hashtags  as $hashtags): */?>
                                            <?/*= '#'.$hashtags->text; */?>
                                        <?php /*endforeach; */?>
                                    </span>-->
                                    </h1>
                                    <!--                                <a class="tweets-list__item__link" href="http://www.innovationexcellence.com/blog/2015/06/20/getting-into-higher-collaborative-gear/">http://www.innovationexcellence.com/blog/2015/06/20/getting-into-higher-collaborative-gear/</a>
                                    -->                             <?php if($my_tweet->entities->expanded_url): ?>
                                        <img class="tweets-list__item__img" src="<? $my_tweet->entities->expanded_url; ?>" alt=""/>
                                    <?php endif; ?>
                                </article>
                            </li>
                        <?php endforeach; ?>
                        <!--<li class="tweets-list__item">
                            <article class="tweets-list__item__art">
                                <date class="tweets-list__item__date">24 septembre</date>
                                <div class="param">
                                    <button title="Add to readed" class="param__item param__item--readed"></button>
                                    <button title="Add to favorite" class="param__item param__item--favorite"></button>
                                </div>
                                <h1 class="tweets-list__item__title">Michael E. Prter over the best strategy
                                    <span class="tweets-list__item__title--hashtag">#business</span>
                                </h1>
                                <a class="tweets-list__item__link" href="http://www.innovationexcellence.com/blog/2015/06/20/getting-into-higher-collaborative-gear/">http://www.innovationexcellence.com/blog/2015/06/20/getting-into-higher-collaborative-gear/</a>
                                <img class="tweets-list__item__img" src="https://pbs.twimg.com/media/CQGgTlFWwAA7wFh.png" alt="Albert Einstein"/>
                            </article>
                        </li>-->
                    </ul>
                </div>
                <div id="readed" class="main__list">
                    <ul id="readed-content" class="tweets-list main__list--readed">
                        <h1 class="main__list__title main__list__title--readed">Readed <span class="main__list__title--thin">tweets</span></h1>
                        <?php
                        $cookieReaded = $_COOKIE['cReaded'];
                        $cookieReaded = stripslashes($cookieReaded);
                        $savedCardArrayReaded = json_decode($cookieReaded, true);
                        foreach ($my_tweets  as $my_tweet): ?>
                            <?php if(in_array($my_tweet->id, $savedCardArrayReaded)): ?>
                                <!--                        --><?php /*print_r($my_tweet); */?>
                                <?= $my_tweet->entities->media_url; ?>
                                <!--                        --><?/*= var_dump($my_tweet->entities->hashtags); */?>
                                <!--                        --><?/*= $my_tweet->description->urls->profile_background_image_url; */?>
                                <li class="tweets-list__item">
                                    <article class="tweets-list__item__art">
                                        <date class="tweets-list__item__date"><?= date('l j F Y', strtotime($my_tweet->created_at)); ?></date>
                                        <h1 class="tweets-list__item__title"><?= $my_tweet->text; ?>
                                            <!--<span class="tweets-list__item__title--hashtag">
                                        <?php /*foreach ($my_tweet->entities->hashtags  as $hashtags): */?>
                                            <?/*= '#'.$hashtags->text; */?>
                                        <?php /*endforeach; */?>
                                    </span>-->
                                        </h1>
                                        <!--                                <a class="tweets-list__item__link" href="http://www.innovationexcellence.com/blog/2015/06/20/getting-into-higher-collaborative-gear/">http://www.innovationexcellence.com/blog/2015/06/20/getting-into-higher-collaborative-gear/</a>
                                        -->                             <?php if($my_tweet->entities->expanded_url): ?>
                                            <img class="tweets-list__item__img" src="<? $my_tweet->entities->expanded_url; ?>" alt=""/>
                                        <?php endif; ?>
                                    </article>
                                </li>
                            <?php endif; ?>
                        <?php endforeach; ?>
                        <?php if(sizeof($savedCardArrayReaded) == 0): ?>
                            <li class="tweets-list__item">
                                <article class="tweets-list__item__art">
                                    <h1 class="tweets-list__item__title">
                                        No readed tweets !
                                    </h1>
                                </article>
                            </li>
                        <?php endif; ?>
                    </ul>
                </div>
                <div id="favorite" class="main__list">
                    <ul id="favorite-content" class="tweets-list main__list--favorite">
                        <h1 class="main__list__title main__list__title--favorite">Favorite <span class="main__list__title--thin">tweets</span></h1>
                        <?php
                        $cookieFavorite = $_COOKIE['cFavorite'];
                        $cookieFavorite = stripslashes($cookieFavorite);
                        $savedCardArrayFavorite = json_decode($cookieFavorite, true);
                        foreach ($my_tweets  as $my_tweet): ?>
                            <?php if(in_array($my_tweet->id, $savedCardArrayFavorite)): ?>
                                <!--                        --><?php /*print_r($my_tweet); */?>
                                <?= $my_tweet->entities->media_url; ?>
                                <!--                        --><?/*= var_dump($my_tweet->entities->hashtags); */?>
                                <!--                        --><?/*= $my_tweet->description->urls->profile_background_image_url; */?>
                                <li class="tweets-list__item">
                                    <article class="tweets-list__item__art">
                                        <date class="tweets-list__item__date"><?= date('l j F Y', strtotime($my_tweet->created_at)); ?></date>
                                        <h1 class="tweets-list__item__title">
                                            <?= $my_tweet->text; ?>
                                            <!--<span class="tweets-list__item__title--hashtag">
                                        <?php /*foreach ($my_tweet->entities->hashtags  as $hashtags): */?>
                                            <?/*= '#'.$hashtags->text; */?>
                                        <?php /*endforeach; */?>
                                    </span>-->
                                        </h1>
                                        <!--                                <a class="tweets-list__item__link" href="http://www.innovationexcellence.com/blog/2015/06/20/getting-into-higher-collaborative-gear/">http://www.innovationexcellence.com/blog/2015/06/20/getting-into-higher-collaborative-gear/</a>
                                        -->                             <?php if($my_tweet->entities->expanded_url): ?>
                                            <img class="tweets-list__item__img" src="<? $my_tweet->entities->expanded_url; ?>" alt=""/>
                                        <?php endif; ?>
                                    </article>
                                </li>
                            <?php endif; ?>
                        <?php endforeach; ?>
                        <?php if(sizeof($savedCardArrayFavorite) == 0): ?>
                            <li class="tweets-list__item">
                                <article class="tweets-list__item__art">
                                    <h1 class="tweets-list__item__title">
                                        No favorite tweets !
                                    </h1>
                                </article>
                            </li>
                        <?php endif; ?>
                    </ul>
                </div>
            </section>
        </div>



    </main>

<?php else: ?>
    <?php echo '<a href="process.php"><img src="images/sign-in-with-twitter.png" width="151" height="24" border="0" /></a>'; ?>
<?php endif; ?>



<footer class="footer">
    <div class="container">
        <h1 class="footer__title">Made with <span class="footer__title--love"></span> by <a class="footer__title--link" href="http://marcel-pirnay.be/">Marcel Pirnay</a></h1>
    </div>
</footer>
<script src="./library/assets/js/main.js?ver=123" type="text/javascript"></script>

</body>
</html>