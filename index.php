<?php
include __DIR__ . '/vendor/autoload.php';
use Discord\Discord;
use Discord\WebSockets\Event;
use Discord\Parts\Channel\Message;
use Botchaco\Replies;
use Discord\Parts\Embed\Embed;
use Discord\Voice\VoiceClient;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$key = $_ENV['APP_KEY'];


$discord = new Discord([
    'token'=>$key
]);

// Replies interactions
$replies = new Replies;

// setting funny replies
$replies
->setFunnyReply('marico', 'eres')
->setFunnyReply('verga', 'comes')
->setFunnyReply('gatoc', '<:gatoC:957421664738639872> 🍷')
->setFunnyReply('boku no hero', 'https://cdn.discordapp.com/attachments/801954893437861918/958565875961716736/unknown.png')
->setFunnyReply('mediocre', 'https://cdn.discordapp.com/attachments/801954893437861918/958565875961716736/unknown.png')
->setFunnyReply('women', '☕')
->setFunnyReply('contexto', 'https://i.ytimg.com/vi/x6aBFSJHslE/hqdefault.jpg')
->setFunnyReply('litio', '🐒');

// Setting funny reactions
$replies
->setFunnyReaction('<:gatoC:957421664738639872>', ':gatoC:957421664738639872');

$discord ->on('ready', function(Discord $discord) use ($replies)
{

    // Listen for messages.
    $discord->on(Event::MESSAGE_CREATE, function (Message $message, Discord $discord) use ($replies)
    {
        echo "{$message->author->username}: {$message->content}", PHP_EOL;

        // Check if bot
        if($message->author->bot) return;

        // Check for funny replies
        $replies->replyToMsg($message);

        // Check for funny reactions
        $replies->reactToMsg($message);

        if($message->content == 'chaco!m'){
            $channel = $discord->getChannel(603201649099669528);
            $discord->joinVoiceChannel($channel)->then(function (VoiceClient $voice) {
                $song = fopen('smell.mp3', 'r');
                $voice->playFile($song)->then(function () {
                    echo 'funciono';
                });
            });
            // $voiceClient = $discord->getVoiceClient(603201649099669524);
            // var_dump($voiceClient);
            // $song = file_get_contents('smell.mp3');
            // $voiceClient->playFile($song);
        }

        if($message->content == 'chaco!profile') {
            $embed = new Embed($discord
            ['title_test']
            );
            $message->addEmbed($embed)->done(function (Message $message, Discord $discord) {
                $message->reply($message->content);
            });
        }
    
    });

});

$discord->run();