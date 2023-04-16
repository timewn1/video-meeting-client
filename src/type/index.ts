export interface IUser {
    username: string;
}

export interface IPc extends IUser {
    clientId: string;
}

export interface ISetting {
    video: string;
    audioInput: string;
}

export interface IToggle {
    audio: boolean;
    video: boolean;
}

export interface IActive {
    exit: boolean,
    setting: boolean,
    audio: boolean,
    video: boolean,
    chat: boolean
}

export interface IMessage {
    time: Date,
    isFile: boolean,
    content: string,
    user_id: string | undefined,
    userName: string,
    uploadedName?: string,
}
