export class MasterChannel {
    channel_id: string;
    name: string;
    counter: number[];
    constructor(channel_id: string, name: string) {
        this.channel_id = channel_id;
        this.name = name;
        this.counter = [];
    }
}

class TempVoice {
    master_channels: MasterChannel[];
    constructor() {
        this.master_channels = [];
    }
}

class Config {
    temp_voice: TempVoice
    constructor() {
        this.temp_voice = new TempVoice();
    }
}

export class TempChannel {
    master_channel: string;
    counter: number;
    channel_id: string;
    owner: string;
    constructor(channel_id: string, owner: string, counter: number, master_channel: string) {
        this.channel_id = channel_id;
        this.owner = owner;
        this.counter = counter;
        this.master_channel = master_channel;
    }
}

export class Data{
    id: string;
    config: Config
    temp_channels: TempChannel[]
    constructor(id:string) {
        this.config = new Config();
        this.temp_channels = [];
        this.id = id;
    }
}