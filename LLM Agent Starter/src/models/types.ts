export interface ConversationState{
    messages: Message[]
    isActive : boolean
    context? : string
}

export interface Message{
    role: 'user' | 'assistant'
    content: string;
    timestamp: Date
}



export interface ChainConfig{
    // 0-1.0
    temprature?:number
    maxTokens?: number
    streaming?:boolean
}