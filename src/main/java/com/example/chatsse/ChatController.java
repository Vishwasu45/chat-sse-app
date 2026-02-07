package com.example.chatsse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@RestController
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * Streams chat responses as Server-Sent Events.
     * Each token from the LLM is emitted as a separate SSE event.
     * Uses JSON payload to preserve whitespace in tokens.
     *
     * @param message The user's chat message
     * @return A Flux of ServerSentEvent containing the streamed response
     */
    @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<Map<String, String>>> chat(@RequestParam String message) {
        AtomicLong eventId = new AtomicLong(0);

        return chatService.streamChat(message)
                .filter(content -> content != null && !content.isEmpty())
                .map(content -> ServerSentEvent.<Map<String, String>>builder()
                        .id(String.valueOf(eventId.incrementAndGet()))
                        .event("message")
                        .data(Collections.singletonMap("content", content))
                        .build())
                .concatWith(Flux.just(
                        ServerSentEvent.<Map<String, String>>builder()
                                .id(String.valueOf(eventId.incrementAndGet()))
                                .event("complete")
                                .data(Collections.singletonMap("content", "[DONE]"))
                                .build()));
    }
}
