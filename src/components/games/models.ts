import DayJS from "../../helpers/DayJS";

export class Game {
  id: number;
  name: string;
  startTime: Date;
  closeTime: Date;
  createdAt: Date;
  updatedAt: Date;
  owner: Owner;

  constructor(game: any) {
    this.id = game.id;
    this.name = game.name;
    this.startTime = game.start_times;
    this.closeTime = game.close_time;
    this.createdAt = game.created_at;
    this.updatedAt = game.updated_at;
    this.owner = new Owner(game.owner);
  }

  duration() {
    const diff = DayJS(this.closeTime).diff(DayJS(this.startTime));
    return DayJS.duration(diff).humanize();
  }

  status() {
    const now = DayJS();
    if (now > DayJS(this.closeTime)) {
      return "Finished";
    }

    if (now > DayJS(this.startTime)) {
      return `Ends in ${DayJS(this.closeTime).fromNow()}`;
    }

    return `Starts in ${DayJS(this.startTime).fromNow()}`;
  }

  /**
  * Returns a the representation required for the API
  */
  apiObject() {
    return {
      id: this.id,
      name: this.name,
      start_time: this.startTime,
      close_time: this.closeTime,
    }
  }
}

export class Owner {
  id: number;
  username: string;

  constructor(owner: any) {
    this.id = owner.id;
    this.username = owner.username;
  }
}