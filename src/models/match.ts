export type StatusMatch = "pre_start" | "in_progress" | "closed"

export interface Match {
    id: string,
    player1: string,
    player2: string | null,
    status: StatusMatch,
    currentPlayer: string,
    field: Array<Array<0 | 1  | 2 | 3 | 4 >>,
    date: Date,
    messages: Message[]
}

export type SetMove = Record< 'startX' | 'startY' | 'finalX' | 'finalY', number>
export type Message = Record<'nickname' | 'content', string>
