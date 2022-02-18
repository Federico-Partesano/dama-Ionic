import { User } from "./user";

export interface Message {
    nickname: string;
    content: string;
}

export interface Chat {

        id: string, 
        user1: User, 
        user2: User,
        messages: Message[]
    
}