export  interface Task {
    id?: string;
    desc: string;
    completed: boolean;
    priority: boolean;
    dueDate?: Date;
    reminder?: Date;
    remark?: string;
    createDate: Date;
    ownerId?: string;
    participantIds: string[];
    taskListId: string;
}
