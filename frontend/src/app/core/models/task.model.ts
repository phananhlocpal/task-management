export interface Task {
    id: number;
    title: string;
    description: string;
    startDate: string;  
    dueDate: string;    
    inchargeId: number | null;
    inchargeName?: string | null;
    isCompleted: boolean;
}
