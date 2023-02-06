<?php

namespace Bachacode\BachacoBot;

use Discord\Parts\Channel\Message;

class Replies
{
    static function replyToMsg(Message $message, string $msg, string $response)
    {
        if(strtolower($message->content) === $msg) return $message->reply($response);
    }

    static function reactToMsg(Message $message, string $msg, string $reaction)
    {
        if($message->content === $msg) return $message->react($reaction);
    }

    static function jodeteLia(Message $message, string $response)
    {
        if(str_contains($message->content, 'https://') && str_contains($message->content, 'gif'))
        {
            return $message->reply($response);
        }
    }
}