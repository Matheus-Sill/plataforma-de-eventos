export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string | null;
};

export type Registration = {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  event: EventItem;
};