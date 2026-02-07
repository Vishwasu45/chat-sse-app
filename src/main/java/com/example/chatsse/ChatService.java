package com.example.chatsse;

import org.springframework.ai.chat.ChatResponse;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ChatService {

    private final OllamaChatClient chatClient;

    @Autowired
    public ChatService(OllamaChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public Flux<String> streamChat(String message) {
        Prompt prompt = new Prompt(new UserMessage(message));
        return chatClient.stream(prompt)
                .map(response -> (response.getResult() != null && response.getResult().getOutput() != null
                        && response.getResult().getOutput().getContent() != null)
                                ? response.getResult().getOutput().getContent()
                                : "");
    }
}
