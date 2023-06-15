<?php

namespace Botchaco;
// Check if bot
        if($message->author->bot) return;

        // check if command
        if(strpos($message->content, '!')  === false) return;

        //check if user in voice chat
        if($message->author)
        // play song
        if(strpos($message->content, '!play') === true){

        }
        
            