interface UserConfiguration {
  id: string;
  userId: string;
  mpAccessToken: string | null;
  eventSoldOutNotification: boolean;
  ticketTypeSoldOutNotification: boolean;
  eventToBeSoldOutNotification: boolean;
  ticketTypePublishedNotification: boolean;
  serviceCharge?: number | null;
  maxInvitesAmount?: number | null;
  maxValidatorsAmount?: number | null;
}
