<?php
include dirname(__DIR__) . '/vendor/autoload.php';
use Discord\Discord;
use Discord\WebSockets\Event;
use Discord\Parts\Channel\Message;
use Bachacode\BachacoBot\Replies;


$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();

$key = $_ENV['APP_KEY'];


$discord = new Discord([
    'token'=>$key
]);

$discord ->on('ready', function(Discord $discord){
    echo 'BACHACO ACTIVADO', PHP_EOL;

    // Listen for messages.
    $discord->on(Event::MESSAGE_CREATE, function (Message $message, Discord $discord){
        echo "{$message->author->username}: {$message->content}", PHP_EOL;

        // Check if bot
        if($message->author->bot) return;

        
        //$embed = new Embed;
        // $message->addEmbed($embed)->done(function (Message $message) {
        //     // ...
        // });
        // check if command
        
        
        
        // Funny replies
        $funnyReplies = [
            "marico" => "eres",
            "verga" => "comes",
            "gatoc" => "<:gatoC:957421664738639872> 🍷",
            "boku no hero" => "https://cdn.discordapp.com/attachments/801954893437861918/958565875961716736/unknown.png",
            "mediocre" => "https://cdn.discordapp.com/attachments/801954893437861918/958565875961716736/unknown.png",
            "webo tu bot no sirve" => "mamalo",
            "women" => "☕",
            "contexto" => "https://i.ytimg.com/vi/x6aBFSJHslE/hqdefault.jpg",
            "litio" => "🐒",
            ];

        foreach ($funnyReplies as $msg => $response) {
            Replies::replyToMsg($message, $msg, $response);
        }
       
        // Funny reactions
        $funnyReactions = [
            "<:gatoC:957421664738639872>" => ":gatoC:957421664738639872"
        ];

        foreach ($funnyReactions as $msg => $reaction) {
            Replies::reactToMsg($message, $msg, $reaction);
        }

        // Jodete Lia
        $gifs = [
            "https://tenor.com/view/felix-re-zero-felix-argyle-speech-bubble-speech-gif-25397116",
            "https://media.discordapp.net/attachments/875956289698693131/987104745149849680/bebebr.gif",
            "https://media.discordapp.net/attachments/603802912254328865/994450990726139964/react.gif",
            "https://tenor.com/view/hitori-bocchi-talking-anime-gif-25385670",
            "https://media.discordapp.net/attachments/796246474614112293/1032451838563319889/fhqfblts6fh.gif",
            "https://tenor.com/view/speech-bubble-cat-talking-reply-gif-24471552",
            "https://media.discordapp.net/attachments/837067165403971625/1044710866056126586/astolfo-text-bubble.gif"
        ];

        $rand_keys = array_rand($gifs, 1);
        
        if($message->author->username != 'Lia✿') return;
        Replies::jodeteLia($message, $gifs[$rand_keys]);
        
        
        // if(strlen($message->content) > 20 && mb_strtoupper($message->content) === $message->content){
        //     $message->reply('https://tenor.com/view/speech-bubble-cat-talking-reply-gif-24471552');
        // }
    
    });

});

$discord -> run();