import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChainConfig, ConversationState } from "../models/types";
import { CONFIG } from "../config/config";
import { Logger } from "../utils/logger";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";

export class LangChainService {
    private llm: any;
    private conversationState: ConversationState;


    constructor() {
        this.llm = new ChatGoogleGenerativeAI({
            modelName: CONFIG.MODEL_NAME,
            temperature: CONFIG.TEMPERATURE,
            maxOutputTokens: CONFIG.MAX_TOKENS
        })

        this.conversationState = {
            messages: [],
            isActive: true

        }
        Logger.info("Service is up and active")
    }

    private createPromptTemplate(): PromptTemplate {
        const template = `You are a helpful AI assistant. Answer the following question clearly and concisely
         Answer it honestly if you do not know the answer do not provide a false answer.

Previous conversation context:
{context}

Current question: {question}

Answer:`;
        return PromptTemplate.fromTemplate(template)
    }
    async executeSimpleChain(question: string, config: ChainConfig = {}): Promise<string> {
        try {
            Logger.info("Executing Simple chain", { question });
            const prompt = this.createPromptTemplate();
            const context = this.buildConversationContext();
            const chain = new LLMChain({
                llm: this.llm,
                prompt,
            })
            const result = await chain.call({
                question,
                context,
                ...config
            })

            const response = result.text || result.output;
            this.updateConversationState(question, response)
            Logger.info("finish execution")
            return response;

        }
        catch (error) {
            Logger.error("Failed to execute ", error as Error, { question })
            throw new Error("An error occured")
        }

    }
    private buildConversationContext(): string {
        if (this.conversationState.messages.length === 0) {
            return "No previous Conversations";
        }
        const recentMessages = this.conversationState.messages.slice(-5);
        return recentMessages.map(
            msg => `${msg.role}: ${msg.content}`
        ).join('\n')
    }
    private updateConversationState(question: string, response: string): void {
        this.conversationState.messages.push(
            {
                role: 'user',
                content: question,
                timestamp: new Date(),
            },
            {
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            }
        );

        // Keep only last 10 messages to prevent memory bloat
        if (this.conversationState.messages.length > 10) {
            this.conversationState.messages = this.conversationState.messages.slice(-10);
        }
    }

    clearConversation(): void {
        this.conversationState.messages = [];
        Logger.info('Conversation history cleared');
    }

    /**
     * Gets the current conversation state
     */
    getConversationState(): ConversationState {
        return { ...this.conversationState };
    }
}