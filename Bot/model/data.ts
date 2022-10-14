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

class TempChannel {
    channel_id: string;
    name: string;
    constructor(channel_id: string, name: string) {
        this.channel_id = channel_id;
        this.name = name;
    }
}

export class Data{
    id: string;
    config: Config
    temp_channel: TempChannel[]
    constructor(id:string) {
        this.config = new Config();
        this.temp_channel = [];
        this.id = id;
    }
}