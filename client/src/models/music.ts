export type Music = {
  id?: string;
  title: string;
  artist: string;
  yt_id: string;
  lyrics: { [time: string]: string };
}
