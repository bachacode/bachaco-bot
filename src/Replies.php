<?php

namespace Botchaco;

use Discord\Parts\Channel\Message;

class Replies
{
    private array $funnyReplies = [];
    private array $funnyReactions = [];

    public function setFunnyReply(string $message, string $response): self
    {
        $this->funnyReplies[$message] = $response;
        return $this;
    }

    public function setFunnyReaction(string $message, string $response): self
    {
        $this->funnyReactions[$message] = $response;
        return $this;
    }
    
    public function replyToMsg(Message $message): void
    {
        $lowercaseMessage = strtolower($message->content);
        foreach ($this->funnyReplies as $msg => $reply) {
            if($lowercaseMessage === $msg) $message->reply($reply);
        }
    }

    public function reactToMsg(Message $message): void
    {
        foreach ($this->funnyReactions as $msg => $reply) {
            if($message->content === $msg) $message->react($reply);
        }
    }
}

        // // Jodete Lia
        // $gifs = [
        //     "https://tenor.com/view/felix-re-zero-felix-argyle-speech-bubble-speech-gif-25397116",
        //     "https://media.discordapp.net/attachments/875956289698693131/987104745149849680/bebebr.gif",
        //     "https://media.discordapp.net/attachments/603802912254328865/994450990726139964/react.gif",
        //     "https://tenor.com/view/hitori-bocchi-talking-anime-gif-25385670",
        //     "https://media.discordapp.net/attachments/796246474614112293/1032451838563319889/fhqfblts6fh.gif",
        //     "https://tenor.com/view/speech-bubble-cat-talking-reply-gif-24471552",
        //     "https://media.discordapp.net/attachments/837067165403971625/1044710866056126586/astolfo-text-bubble.gif"
        // ];

        // $rand_keys = array_rand($gifs, 1);
        
        // if($message->author->username != 'Lia✿') return;
        // Replies::jodeteLia($message, $gifs[$rand_keys]);
        
        
        // if(strlen($message->content) > 20 && mb_strtoupper($message->content) === $message->content){
        //     $message->reply('https://tenor.com/view/speech-bubble-cat-talking-reply-gif-24471552');
        // }